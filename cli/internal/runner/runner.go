package runner

import (
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

func Run(command string, args []string, tailN int) Result {
	start := time.Now()

	cmd := exec.Command(command, args...)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return Result{Err: err}
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return Result{Err: err}
	}

	tail := NewTailBuffer(tailN)

	if err := cmd.Start(); err != nil {
		return Result{Err: err}
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
