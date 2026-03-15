package executor

import (
	"context"
	"os/exec"
	"syscall"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/domain/job"
)

func resolveExit(ctx context.Context, exitErr *exec.ExitError) (job.Status, int) {
	if ctx.Err() != nil {
		return job.StatusCanceled, job.CanceledExitCode
	}

	waitStatus, ok := exitErr.Sys().(syscall.WaitStatus)
	if ok && waitStatus.Signaled() {
		switch waitStatus.Signal() {
		case syscall.SIGINT, syscall.SIGTERM:
			return job.StatusCanceled, job.CanceledExitCode
		}
	}

	return job.StatusFailed, exitErr.ExitCode()
}
