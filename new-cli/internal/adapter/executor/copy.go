package executor

import (
	"errors"
	"fmt"
	"io"
	"os"
)

func copyOutput(src io.Reader, dst io.Writer, collector *lineCollector) error {
	_, err := io.Copy(io.MultiWriter(dst, collector), src)
	if errors.Is(err, os.ErrClosed) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("copy output: %w", err)
	}
	return nil
}
