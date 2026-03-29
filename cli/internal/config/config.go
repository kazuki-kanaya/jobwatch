package config

type Config struct {
	Run    RunConfig     `yaml:"run"`
	API    *APIConfig    `yaml:"api"`
	Notify *NotifyConfig `yaml:"notify"`
}

type RunConfig struct {
	Tags      []string `yaml:"tags"`
	TailLines int      `yaml:"tail_lines"`
}

type APIConfig struct {
	HostToken string `yaml:"host_token"`
	BaseURL   string `yaml:"base_url"`
}

type NotifyConfig struct {
	TimeZone string         `yaml:"time_zone"`
	Slack    *SlackConfig   `yaml:"slack"`
	Discord  *DiscordConfig `yaml:"discord"`
}

type SlackConfig struct {
	WebhookURL string `yaml:"webhook_url"`
}

type DiscordConfig struct {
	WebhookURL string `yaml:"webhook_url"`
}

func (n NotifyConfig) HasAnyProvider() bool {
	return n.Slack != nil || n.Discord != nil
}
