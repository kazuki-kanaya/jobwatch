package run

import (
	"context"
	"fmt"
	"strings"

	"github.com/kazuki-kanaya/obsern/new-cli/internal/domain/job"
)

type Service struct {
	executor Executor
	reporter JobReporter
	notifier Notifier
	logger   Logger
	clock    Clock
}

func NewService(executor Executor, reporter JobReporter, notifier Notifier, logger Logger, clock Clock) (*Service, error) {
	if executor == nil {
		return nil, fmt.Errorf("executor is required")
	}
	if reporter == nil {
		return nil, fmt.Errorf("reporter is required")
	}
	if notifier == nil {
		return nil, fmt.Errorf("notifier is required")
	}
	if logger == nil {
		return nil, fmt.Errorf("logger is required")
	}
	if clock == nil {
		return nil, fmt.Errorf("clock is required")
	}

	return &Service{
		executor: executor,
		reporter: reporter,
		notifier: notifier,
		logger:   logger,
		clock:    clock,
	}, nil
}

func (s *Service) Execute(ctx context.Context, req Request) (int, error) {
	if err := req.Validate(); err != nil {
		return job.FailedExitCode, err
	}

	startedAt := s.clock.Now()
	runningJob, err := job.NewRunning(joinCommand(req.Command, req.Args), req.Tags, startedAt)
	if err != nil {
		return job.FailedExitCode, err
	}

	jobID, err := s.reporter.Start(ctx, runningJob)
	if err != nil {
		s.logger.Warnf("failed to create remote job: %v", err)
	}

	execResult, err := s.executor.Execute(ctx, req)
	if err != nil {
		return job.FailedExitCode, err
	}

	finishedAt := s.clock.Now()
	if err := runningJob.Finish(execResult.Status, execResult.TailLines, finishedAt); err != nil {
		return job.FailedExitCode, err
	}

	if jobID != "" {
		if err := s.reporter.Finish(ctx, jobID, runningJob); err != nil {
			s.logger.Warnf("failed to update remote job: %v", err)
		}
	}

	if err := s.notifier.Notify(ctx, runningJob); err != nil {
		s.logger.Warnf("failed to notify job result: %v", err)
	}

	return execResult.ExitCode, nil
}

func joinCommand(command string, args []string) string {
	if len(args) == 0 {
		return command
	}

	return strings.Join(append([]string{command}, args...), " ")
}
