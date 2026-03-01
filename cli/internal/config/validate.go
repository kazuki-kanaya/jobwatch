package config

import (
	"errors"
	"fmt"
)

func (cfg Config) Validate() error {
	if cfg.Project.Name == "" {
		return errors.New("project.name is required")
	}
	if cfg.Run.LogTail < 0 {
		return errors.New("run.log_tail must be >= 0")
	}
	if !cfg.API.Enabled && !cfg.Notify.Enabled {
		return errors.New("api.enabled and notify.enabled cannot both be false")
	}
	if !cfg.Notify.Enabled {
		return nil
	}

	for i, ch := range cfg.Notify.Channels {
		if ch.Kind == "" {
			return fmt.Errorf("notify.channels[%d].kind is required", i)
		}

		if ch.Kind == "slack" {
			v, ok := ch.Settings["webhook_url"]
			if !ok {
				return fmt.Errorf("notify.channels[%d].settings.webhook_url is required for slack", i)
			}
			s, ok := v.(string)
			if !ok || s == "" {
				return fmt.Errorf("notify.channels[%d].settings.webhook_url must be a non-empty string", i)
			}
		}
	}

	return nil
}
