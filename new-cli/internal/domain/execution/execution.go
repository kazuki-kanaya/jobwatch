package execution

import (
	"fmt"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/domain/job"
)

type Execution struct {
	Status    job.Status
	ExitCode  int
	TailLines []string
}

func New(
	status job.Status,
	exitCode int,
	tailLines []string,
) (Execution, error) {
	if !status.IsTerminal() {
		return Execution{}, fmt.Errorf("status must be terminal: %q", status)
	}

	if status == job.StatusCanceled && exitCode != job.CanceledExitCode {
		return Execution{}, fmt.Errorf("canceled execution must use exit code %d, got %d", job.CanceledExitCode, exitCode)
	}

	if status == job.StatusFinished && exitCode != job.SuccessExitCode {
		return Execution{}, fmt.Errorf("finished execution must use exit code %d, got %d", job.SuccessExitCode, exitCode)
	}

	if status == job.StatusFailed && exitCode == job.SuccessExitCode {
		return Execution{}, fmt.Errorf("failed execution must use non-zero exit code %d", job.SuccessExitCode)
	}

	return Execution{
		Status:    status,
		ExitCode:  exitCode,
		TailLines: cloneStrings(tailLines),
	}, nil
}

func cloneStrings(values []string) []string {
	cloned := make([]string, len(values))
	copy(cloned, values)
	return cloned
}
