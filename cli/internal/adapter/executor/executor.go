package executor

import (
	"fmt"
	"io"

	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

type Executor struct {
	stdout io.Writer
	stderr io.Writer
}

func New(stdout, stderr io.Writer) (*Executor, error) {
	if stdout == nil {
		return nil, fmt.Errorf("stdout is required")
	}
	if stderr == nil {
		return nil, fmt.Errorf("stderr is required")
	}
	return &Executor{
		stdout: stdout,
		stderr: stderr,
	}, nil
}

var _ run.Executor = (*Executor)(nil)
