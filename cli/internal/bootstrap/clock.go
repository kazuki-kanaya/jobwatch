package bootstrap

import (
	"time"

	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

type systemClock struct{}

func NewClock() run.Clock {
	return systemClock{}
}

func (systemClock) Now() time.Time {
	return time.Now().UTC()
}
