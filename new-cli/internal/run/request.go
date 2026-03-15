package run

import "fmt"

type Request struct {
	Command   string
	Args      []string
	Tags      []string
	TailLines int
}

func (r Request) Validate() error {
	if r.Command == "" {
		return fmt.Errorf("command is required")
	}

	if r.TailLines < 0 {
		return fmt.Errorf("tail_lines must be greater than or equal to 0")
	}

	return nil
}
