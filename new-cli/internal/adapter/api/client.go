package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"path"
	"strings"
)

type Client struct {
	baseURL    *url.URL
	hostToken  string
	httpClient *http.Client
}

func NewClient(baseURL, hostToken string) (*Client, error) {
	if strings.TrimSpace(baseURL) == "" {
		return nil, fmt.Errorf("baseURL is required")
	}
	if strings.TrimSpace(hostToken) == "" {
		return nil, fmt.Errorf("hostToken is required")
	}

	parsed, err := url.ParseRequestURI(baseURL)
	if err != nil {
		return nil, fmt.Errorf("baseURL must be a valid URL: %w", err)
	}
	if parsed.Scheme == "" || parsed.Host == "" {
		return nil, fmt.Errorf("baseURL must be an absolute URL")
	}
	if parsed.Path != "" && parsed.Path != "/" {
		parsed.Path = strings.TrimSuffix(parsed.Path, "/")
	}

	return &Client{
		baseURL:    parsed,
		hostToken:  hostToken,
		httpClient: &http.Client{},
	}, nil
}

func (c *Client) CreateJob(ctx context.Context, req createJobRequest) (createJobResponse, error) {
	httpReq, err := c.newJSONRequest(ctx, http.MethodPost, "/jobs", req)
	if err != nil {
		return createJobResponse{}, err
	}

	var resp createJobResponse
	if err := c.doJSON(httpReq, &resp); err != nil {
		return createJobResponse{}, err
	}

	if resp.ID == "" {
		return createJobResponse{}, fmt.Errorf("create job response missing id")
	}

	return resp, nil
}

func (c *Client) UpdateJob(ctx context.Context, jobID string, req updateJobRequest) error {
	if strings.TrimSpace(jobID) == "" {
		return fmt.Errorf("jobID is required")
	}

	httpReq, err := c.newJSONRequest(ctx, http.MethodPatch, "/jobs/"+url.PathEscape(jobID), req)
	if err != nil {
		return err
	}

	return c.doJSON(httpReq, nil)
}

func (c *Client) newJSONRequest(ctx context.Context, method, endpoint string, body any) (*http.Request, error) {
	payload, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("marshal request body: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, method, c.endpointURL(endpoint), bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("build request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.hostToken)
	req.Header.Set("Content-Type", "application/json")

	return req, nil
}

func (c *Client) doJSON(req *http.Request, out any) error {
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		body, readErr := io.ReadAll(io.LimitReader(resp.Body, 4096))
		if readErr != nil {
			return fmt.Errorf("request failed with status %d", resp.StatusCode)
		}

		message := strings.TrimSpace(string(body))
		if message == "" {
			return fmt.Errorf("request failed with status %d", resp.StatusCode)
		}

		return fmt.Errorf("request failed with status %d: %s", resp.StatusCode, message)
	}

	if out == nil {
		// Drain the response body so the underlying HTTP connection can be reused.
		io.Copy(io.Discard, resp.Body)
		return nil
	}

	if err := json.NewDecoder(resp.Body).Decode(out); err != nil {
		return fmt.Errorf("decode response body: %w", err)
	}

	return nil
}

func (c *Client) endpointURL(endpoint string) string {
	base := *c.baseURL
	endpoint = strings.TrimPrefix(endpoint, "/")
	base.Path = path.Join(base.Path, endpoint)
	if !strings.HasPrefix(base.Path, "/") {
		base.Path = "/" + base.Path
	}

	return base.String()
}
