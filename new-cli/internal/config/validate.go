package config

import (
	"fmt"
	"net/url"
	"strings"
)

const (
	minTailLines = 0
	maxTailLines = 200
)

func Validate(cfg Config) error {
	if cfg.Run.TailLines < minTailLines || cfg.Run.TailLines > maxTailLines {
		return fmt.Errorf("run.tail_lines must be between %d and %d", minTailLines, maxTailLines)
	}

	hasAPI := cfg.API != nil
	hasNotify := cfg.Notify != nil && cfg.Notify.HasAnyProvider()

	if !hasAPI && !hasNotify {
		return fmt.Errorf("at least one of api or notify must be configured")
	}

	if cfg.API != nil {
		if err := validateAPI(*cfg.API); err != nil {
			return err
		}
	}

	if cfg.Notify != nil {
		if err := validateNotify(*cfg.Notify); err != nil {
			return err
		}
	}

	return nil
}

func validateAPI(cfg APIConfig) error {
	if strings.TrimSpace(cfg.HostToken) == "" {
		return fmt.Errorf("api.host_token is required")
	}

	if strings.TrimSpace(cfg.BaseURL) == "" {
		return fmt.Errorf("api.base_url is required")
	}

	if err := validateURL("api.base_url", cfg.BaseURL); err != nil {
		return err
	}

	return nil
}

func validateNotify(cfg NotifyConfig) error {
	if cfg.Slack != nil {
		if strings.TrimSpace(cfg.Slack.WebhookURL) == "" {
			return fmt.Errorf("notify.slack.webhook_url is required")
		}

		if err := validateURL("notify.slack.webhook_url", cfg.Slack.WebhookURL); err != nil {
			return err
		}
	}

	return nil
}

func validateURL(fieldName, value string) error {
	parsed, err := url.ParseRequestURI(value)
	if err != nil {
		return fmt.Errorf("%s must be a valid URL", fieldName)
	}

	if parsed.Scheme == "" || parsed.Host == "" {
		return fmt.Errorf("%s must be an absolute URL", fieldName)
	}

	return nil
}
