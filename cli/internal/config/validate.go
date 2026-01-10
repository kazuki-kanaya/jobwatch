package config

import (
	"errors"
	"fmt"
)

func (c Config) Validate() error {
	if c.Project.Name == "" {
		return errors.New("project.name is required")
	}
	if c.Run.LogTail < 0 {
		return errors.New("run.log_tail must be >= 0")
	}

	for i, ch := range c.Notify.Channels {
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
