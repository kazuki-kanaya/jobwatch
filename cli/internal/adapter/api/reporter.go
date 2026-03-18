package api

import (
	"context"
	"fmt"
	"time"

	"github.com/kazuki-kanaya/obsern/cli/internal/domain/job"
	"github.com/kazuki-kanaya/obsern/cli/internal/run"
)

type Reporter struct {
	client *Client
}

func NewReporter(client *Client) (run.JobReporter, error) {
	if client == nil {
		return nil, fmt.Errorf("client is required")
	}

	return &Reporter{client: client}, nil
}

func (r *Reporter) Start(ctx context.Context, j job.Job) (string, error) {
	if j.Status != job.StatusRunning {
		return "", fmt.Errorf("started job must be running: %q", j.Status)
	}

	resp, err := r.client.CreateJob(ctx, createJobRequest{
		Command:   j.Command,
		Tags:      cloneStrings(j.Tags),
		StartedAt: formatTime(j.StartedAt),
	})
	if err != nil {
		return "", err
	}

	return resp.ID, nil
}

func (r *Reporter) Finish(ctx context.Context, jobID string, j job.Job) error {
	if !j.Status.IsTerminal() {
		return fmt.Errorf("finished job must be terminal: %q", j.Status)
	}

	if j.FinishedAt == nil {
		return fmt.Errorf("finished job must include finished_at")
	}

	return r.client.UpdateJob(ctx, jobID, updateJobRequest{
		Status:     string(j.Status),
		TailLines:  cloneStrings(j.TailLines),
		FinishedAt: formatTime(*j.FinishedAt),
	})
}

func formatTime(value time.Time) string {
	return value.UTC().Format(time.RFC3339)
}

func cloneStrings(values []string) []string {
	cloned := make([]string, len(values))
	copy(cloned, values)
	return cloned
}

var _ run.JobReporter = (*Reporter)(nil)
