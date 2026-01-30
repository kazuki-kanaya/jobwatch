package tracker

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type APIClient struct {
	httpClient *http.Client
	baseURL    string
	token      string
}

func NewAPIClient(tr *http.Transport, baseURL, token string) *APIClient {
	return &APIClient{
		httpClient: &http.Client{
			Transport: tr,
			Timeout:   10 * time.Second,
		},
		baseURL: baseURL,
		token:   token,
	}
}

type jobCreateRequest struct {
	Project   string    `json:"project"`
	Command   string    `json:"command"`
	Args      []string  `json:"args"`
	Tags      []string  `json:"tags"`
	StartedAt time.Time `json:"started_at"`
}

type jobCreateResponse struct {
	JobID      string     `json:"job_id"`
	Project    string     `json:"project"`
	Command    string     `json:"command"`
	Args       []string   `json:"args"`
	Tags       []string   `json:"tags"`
	Status     string     `json:"status"`
	StartedAt  time.Time  `json:"started_at"`
	FinishedAt *time.Time `json:"finished_at"`
}

type jobUpdateRequest struct {
	Status     *string    `json:"status,omitempty"`
	Err        *string    `json:"err,omitempty"`
	TailLines  []string   `json:"tail_lines,omitempty"`
	FinishedAt *time.Time `json:"finished_at,omitempty"`
}

func (c *APIClient) Start(ctx context.Context, req StartRequest) (string, error) {
	payload := jobCreateRequest{
		Project:   req.Project,
		Command:   req.Command,
		Args:      req.Args,
		Tags:      req.Tags,
		StartedAt: req.StartedAt,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		c.baseURL+"/v1/jobs",
		bytes.NewReader(body),
	)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+c.token)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	var result jobCreateResponse
	if err := json.Unmarshal(respBody, &result); err != nil {
		return "", fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return result.JobID, nil
}

func (c *APIClient) Finish(ctx context.Context, jobID string, req FinishRequest) error {
	status := string(req.Status)
	payload := jobUpdateRequest{
		Status:     &status,
		TailLines:  req.TailLines,
		FinishedAt: &req.FinishedAt,
	}

	if req.Err != "" {
		payload.Err = &req.Err
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(
		ctx,
		http.MethodPatch,
		fmt.Sprintf("%s/v1/jobs/%s", c.baseURL, jobID),
		bytes.NewReader(body),
	)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+c.token)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return nil
}
