package job

import (
	"fmt"
	"time"
)

type Job struct {
	Command    string
	Status     Status
	Tags       []string
	TailLines  []string
	StartedAt  time.Time
	FinishedAt *time.Time // Nil while the job is still running.
}

func NewRunning(command string, tags []string, startedAt time.Time) (Job, error) {
	if command == "" {
		return Job{}, fmt.Errorf("command is required")
	}
	if startedAt.IsZero() {
		return Job{}, fmt.Errorf("started_at is required")
	}

	return Job{
		Command:   command,
		Status:    StatusRunning,
		Tags:      tags,
		StartedAt: startedAt,
	}, nil
}

func (j *Job) Finish(status Status, tailLines []string, finishedAt time.Time) error {
	if status.IsRunning() {
		return fmt.Errorf("status must be terminal: %q", status)
	}

	if finishedAt.IsZero() {
		return fmt.Errorf("finished_at is required")
	}

	if finishedAt.Before(j.StartedAt) {
		return fmt.Errorf("finished_at must be after started_at")
	}

	j.Status = status
	j.TailLines = cloneStrings(tailLines) // Copy to keep the finished job as an immutable snapshot.
	j.FinishedAt = &finishedAt
	return nil
}

func cloneStrings(s []string) []string {
	clone := make([]string, len(s))
	copy(clone, s)
	return clone
}
