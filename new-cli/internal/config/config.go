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
	Slack *SlackConfig `yaml:"slack"`
}

type SlackConfig struct {
	WebhookURL string `yaml:"webhook_url"`
}

func (n NotifyConfig) HasAnyProvider() bool {
	return n.Slack != nil
}
