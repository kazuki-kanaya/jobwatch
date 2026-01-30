package runner

import (
	"context"
	"os"
	"os/exec"
	"sync"
	"time"
)

type Result struct {
	Err        error
	TailLines  []string
	StartedAt  time.Time
	FinishedAt time.Time
}

type Runner interface {
	Run(ctx context.Context, command string, args []string) Result
}

type Executor struct {
	tailN int
}

func NewExecutor(tailN int) *Executor {
	return &Executor{tailN: tailN}
}

func (e *Executor) Run(ctx context.Context, command string, args []string) Result {
	start := time.Now()

	cmd := exec.CommandContext(ctx, command, args...)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return Result{
			Err:        err,
			StartedAt:  start,
			FinishedAt: time.Now(),
		}
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return Result{
			Err:        err,
			StartedAt:  start,
			FinishedAt: time.Now(),
		}
	}

	tail := NewTailBuffer(e.tailN)

	if err := cmd.Start(); err != nil {
		return Result{
			Err:        err,
			StartedAt:  start,
			FinishedAt: time.Now(),
		}
	}

	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		stream(stdout, os.Stdout, tail)
	}()

	go func() {
		defer wg.Done()
		stream(stderr, os.Stderr, tail)
	}()

	err = cmd.Wait()
	wg.Wait()

	return Result{
		Err:        err,
		TailLines:  tail.Lines(),
		StartedAt:  start,
		FinishedAt: time.Now(),
	}
}
