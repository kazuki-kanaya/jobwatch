package executor

import (
	"fmt"
	"io"
)

func copyOutput(src io.Reader, dst io.Writer, collector *lineCollector) error {
	_, err := io.Copy(io.MultiWriter(dst, collector), src)
	if err != nil {
		return fmt.Errorf("copy output: %w", err)
	}
	return nil
}
