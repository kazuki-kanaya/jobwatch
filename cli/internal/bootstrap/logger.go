package bootstrap

import (
	"log"

	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

type stdLogger struct{}

func NewLogger() run.Logger {
	return stdLogger{}
}

func (stdLogger) Warnf(format string, args ...any) {
	log.Printf(format, args...)
}
