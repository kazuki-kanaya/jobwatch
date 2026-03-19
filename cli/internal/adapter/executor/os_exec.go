package executor

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os/exec"
	"syscall"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/execution"
	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

func (e *Executor) Execute(ctx context.Context, req run.Request) (execution.Execution, error) {
	cmd := exec.CommandContext(ctx, req.Command[0], req.Command[1:]...)

	tail, err := newTailBuffer(req.TailLines)
	if err != nil {
		return execution.Execution{}, fmt.Errorf("create tail buffer: %w", err)
	}

	stdoutCollector := newLineCollector(tail)
	stderrCollector := newLineCollector(tail)
	cmd.Stdout = io.MultiWriter(e.stdout, stdoutCollector)
	cmd.Stderr = io.MultiWriter(e.stderr, stderrCollector)

	if err := cmd.Start(); err != nil {
		return execution.Execution{}, fmt.Errorf("start command: %w", err)
	}

	err = cmd.Wait()

	stdoutCollector.Flush()
	stderrCollector.Flush()

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
