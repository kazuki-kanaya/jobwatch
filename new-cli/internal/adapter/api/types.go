package api

type createJobRequest struct {
	Command   string   `json:"command"`
	Status    string   `json:"status"`
	Tags      []string `json:"tags"`
	StartedAt string   `json:"started_at"`
}

type createJobResponse struct {
	ID string `json:"id"`
}

type updateJobRequest struct {
	Status     string   `json:"status"`
	TailLines  []string `json:"tail_lines"`
	FinishedAt string   `json:"finished_at"`
}
