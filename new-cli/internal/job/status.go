package job

type Status string

const (
	StatusRunning  Status = "running"
	StatusFinished Status = "finished"
	StatusFailed   Status = "failed"
	StatusCanceled Status = "canceled"
)

func (s Status) IsValid() bool {
	switch s {
	case StatusRunning, StatusFinished, StatusFailed, StatusCanceled:
		return true
	default:
		return false
	}
}

func (s Status) IsRunning() bool {
	switch s {
	case StatusRunning:
		return true
	default:
		return false
	}
}
