package config

type Config struct {
	Project Project `yaml:"project"`
	API     API     `yaml:"api"`
	Run     Run     `yaml:"run"`
	Notify  Notify  `yaml:"notify"`
}

type Project struct {
	Name string   `yaml:"name"`
	Tags []string `yaml:"tags"`
}

type API struct {
	Enabled bool   `yaml:"enabled"`
	BaseURL string `yaml:"base_url"`
	Token   string `yaml:"token"`
}

type Run struct {
	LogTail int `yaml:"log_tail"`
}

type Notify struct {
	OnSuccess bool      `yaml:"on_success"`
	OnFailure bool      `yaml:"on_failure"`
	Channels  []Channel `yaml:"channels"`
}

type Channel struct {
	Kind     string         `yaml:"kind"`
	Settings map[string]any `yaml:"settings"`
}
