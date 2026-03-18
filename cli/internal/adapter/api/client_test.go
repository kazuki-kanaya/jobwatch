package api

import (
	"context"
	"io"
	"net/http"
	"strings"
	"testing"
)

func TestNewClient(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		baseURL string
		token   string
		wantErr string
	}{
		{name: "valid base url", baseURL: "https://api.obsern.com/", token: "token"},
		{name: "missing base url", baseURL: "", token: "token", wantErr: "baseURL is required"},
		{name: "missing host token", baseURL: "https://api.obsern.com", token: "", wantErr: "hostToken is required"},
		{name: "relative base url", baseURL: "/api", token: "token", wantErr: "baseURL must be an absolute URL"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			client, err := NewClient(tt.baseURL, tt.token)
			if tt.wantErr == "" && err != nil {
				t.Fatalf("NewClient() error = %v, want nil", err)
			}
			if tt.wantErr == "" {
				if client == nil {
					t.Fatal("NewClient() returned nil client")
				}
				return
			}
			if err == nil {
				t.Fatalf("NewClient() error = nil, want %q", tt.wantErr)
			}
			if !strings.Contains(err.Error(), tt.wantErr) {
				t.Fatalf("NewClient() error = %q, want substring %q", err.Error(), tt.wantErr)
			}
		})
	}
}

func TestClientCreateJob(t *testing.T) {
	t.Parallel()

	var (
		gotMethod string
		gotPath   string
		gotAuth   string
		gotBody   string
	)

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		gotMethod = req.Method
		gotPath = req.URL.Path
		gotAuth = req.Header.Get("Authorization")

		body, err := io.ReadAll(req.Body)
		if err != nil {
			t.Fatalf("read request body: %v", err)
		}
		gotBody = string(body)

		return jsonResponse(http.StatusCreated, `{"job_id":"job-123"}`), nil
	})

	resp, err := client.CreateJob(context.Background(), createJobRequest{
		Command:   "python train.py",
		Tags:      []string{"ml"},
		StartedAt: "2026-03-16T10:00:00Z",
	})
	if err != nil {
		t.Fatalf("CreateJob() error = %v", err)
	}

	if gotMethod != http.MethodPost {
		t.Fatalf("method = %q, want %q", gotMethod, http.MethodPost)
	}
	if gotPath != "/cli/jobs" {
		t.Fatalf("path = %q, want %q", gotPath, "/cli/jobs")
	}
	if gotAuth != "Bearer host-token" {
		t.Fatalf("authorization = %q, want %q", gotAuth, "Bearer host-token")
	}
	if !strings.Contains(gotBody, `"command":"python train.py"`) {
		t.Fatalf("body = %q, want command", gotBody)
	}
	if resp.ID != "job-123" {
		t.Fatalf("response id = %q, want %q", resp.ID, "job-123")
	}
}

func TestClientCreateJobRequiresResponseID(t *testing.T) {
	t.Parallel()

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		return jsonResponse(http.StatusCreated, `{}`), nil
	})

	_, err := client.CreateJob(context.Background(), createJobRequest{})
	if err == nil {
		t.Fatal("CreateJob() error = nil, want missing id error")
	}
	if !strings.Contains(err.Error(), "create job response missing id") {
		t.Fatalf("CreateJob() error = %q, want missing id error", err.Error())
	}
}

func TestClientUpdateJob(t *testing.T) {
	t.Parallel()

	var (
		gotMethod string
		gotPath   string
		gotBody   string
	)

	client := newClientWithTransport(t, "https://api.obsern.com/api/", func(req *http.Request) (*http.Response, error) {
		gotMethod = req.Method
		gotPath = req.URL.Path

		body, err := io.ReadAll(req.Body)
		if err != nil {
			t.Fatalf("read request body: %v", err)
		}
		gotBody = string(body)

		return jsonResponse(http.StatusOK, ``), nil
	})

	err := client.UpdateJob(context.Background(), "job-123", updateJobRequest{
		Status:     "finished",
		TailLines:  []string{"done"},
		FinishedAt: "2026-03-16T10:05:00Z",
	})
	if err != nil {
		t.Fatalf("UpdateJob() error = %v", err)
	}

	if gotMethod != http.MethodPatch {
		t.Fatalf("method = %q, want %q", gotMethod, http.MethodPatch)
	}
	if gotPath != "/api/cli/jobs/job-123" {
		t.Fatalf("path = %q, want %q", gotPath, "/api/cli/jobs/job-123")
	}
	if !strings.Contains(gotBody, `"status":"finished"`) {
		t.Fatalf("body = %q, want status", gotBody)
	}
}

func TestClientUpdateJobRequiresJobID(t *testing.T) {
	t.Parallel()

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		t.Fatal("transport should not be called")
		return nil, nil
	})

	err := client.UpdateJob(context.Background(), "", updateJobRequest{})
	if err == nil {
		t.Fatal("UpdateJob() error = nil, want missing jobID error")
	}
	if !strings.Contains(err.Error(), "jobID is required") {
		t.Fatalf("UpdateJob() error = %q, want missing jobID error", err.Error())
	}
}

func TestClientReturnsHTTPError(t *testing.T) {
	t.Parallel()

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		return jsonResponse(http.StatusBadRequest, `bad request`), nil
	})

	_, err := client.CreateJob(context.Background(), createJobRequest{})
	if err == nil {
		t.Fatal("CreateJob() error = nil, want HTTP error")
	}
	if !strings.Contains(err.Error(), "request failed with status 400: bad request") {
		t.Fatalf("CreateJob() error = %q, want HTTP error with body", err.Error())
	}
}

func TestClientReturnsHTTPErrorWithoutBody(t *testing.T) {
	t.Parallel()

	client := newClientWithTransport(t, "https://api.obsern.com", func(req *http.Request) (*http.Response, error) {
		return jsonResponse(http.StatusInternalServerError, ``), nil
	})

	_, err := client.CreateJob(context.Background(), createJobRequest{})
	if err == nil {
		t.Fatal("CreateJob() error = nil, want HTTP error")
	}
	if !strings.Contains(err.Error(), "request failed with status 500") {
		t.Fatalf("CreateJob() error = %q, want HTTP status error", err.Error())
	}
	if strings.Contains(err.Error(), ": ") {
		t.Fatalf("CreateJob() error = %q, want no trailing colon for empty body", err.Error())
	}
}

func newClientWithTransport(t *testing.T, baseURL string, fn func(*http.Request) (*http.Response, error)) *Client {
	t.Helper()

	client, err := NewClient(baseURL, "host-token")
	if err != nil {
		t.Fatalf("NewClient() error = %v", err)
	}

	client.httpClient.Transport = roundTripFunc(fn)

	return client
}

func jsonResponse(statusCode int, body string) *http.Response {
	return &http.Response{
		StatusCode: statusCode,
		Body:       io.NopCloser(strings.NewReader(body)),
		Header:     make(http.Header),
	}
}

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return fn(req)
}
