package executor

import (
	"context"
	"errors"
	"fmt"
	"os/exec"
	"sync"
	"syscall"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/domain/execution"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/domain/job"
	"github.com/kazuki-kanaya/obsern/new-cli/internal/run"
)

func (e *Executor) Execute(ctx context.Context, req run.Request) (execution.Execution, error) {
	cmd := exec.CommandContext(ctx, req.Command[0], req.Command[1:]...)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return execution.Execution{}, fmt.Errorf("create stdout pipe: %w", err)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return execution.Execution{}, fmt.Errorf("create stderr pipe: %w", err)
	}

	tail, err := newTailBuffer(req.TailLines)
	if err != nil {
		return execution.Execution{}, fmt.Errorf("create tail buffer: %w", err)
	}

	if err := cmd.Start(); err != nil {
		return execution.Execution{}, fmt.Errorf("start command: %w", err)
	}

	var wg sync.WaitGroup
	wg.Add(2)

	copyErrCh := make(chan error, 2)

	stdoutCollector := newLineCollector(tail)
	stderrCollector := newLineCollector(tail)

	go func() {
		defer wg.Done()
		copyErrCh <- copyOutput(stdout, e.stdout, stdoutCollector)
	}()

	go func() {
		defer wg.Done()
		copyErrCh <- copyOutput(stderr, e.stderr, stderrCollector)
	}()

	err = cmd.Wait()
	wg.Wait()

	stdoutCollector.Flush()
	stderrCollector.Flush()

	close(copyErrCh)

	for copyErr := range copyErrCh {
		if copyErr != nil {
			return execution.Execution{}, fmt.Errorf("observe command output: %w", copyErr)
		}
	}

	if err == nil {
		return execution.New(job.StatusFinished, job.SuccessExitCode, tail.Lines())
	}

	if ctx.Err() != nil {
		return execution.New(job.StatusCanceled, job.CanceledExitCode, tail.Lines())
	}

	var exitErr *exec.ExitError
	if errors.As(err, &exitErr) {
		status, exitCode := resolveExit(exitErr)
		return execution.New(status, exitCode, tail.Lines())
	}
	return execution.Execution{}, fmt.Errorf("observe command execution: %w", err)
}

func resolveExit(exitErr *exec.ExitError) (job.Status, int) {
	waitStatus, ok := exitErr.Sys().(syscall.WaitStatus)
	if ok && waitStatus.Signaled() {
		switch waitStatus.Signal() {
		case syscall.SIGINT, syscall.SIGTERM:
			return job.StatusCanceled, job.CanceledExitCode
		}
	}

	return job.StatusFailed, exitErr.ExitCode()
}
