package tracker

import (
	"context"
	"time"
)

// JobStatus represents the status of a job
type JobStatus string

const (
	JobStatusRunning  JobStatus = "RUNNING"
	JobStatusFinished JobStatus = "FINISHED"
	JobStatusFailed   JobStatus = "FAILED"
	JobStatusCanceled JobStatus = "CANCELED"
)

type StartRequest struct {
	Project   string
	Command   string
	Args      []string
	Tags      []string
	StartedAt time.Time
}

type FinishRequest struct {
	Status     JobStatus
	Err        string
	TailLines  []string
	FinishedAt time.Time
}

type JobTracker interface {
	Start(ctx context.Context, req StartRequest) (jobID string, err error)
	Finish(ctx context.Context, jobID string, req FinishRequest) error
}

type NoopTracker struct{}

func NewNoopTracker() *NoopTracker {
	return &NoopTracker{}
}

func (n *NoopTracker) Start(ctx context.Context, req StartRequest) (string, error) {
	return "", nil
}

func (n *NoopTracker) Finish(ctx context.Context, jobID string, req FinishRequest) error {
	return nil
}
