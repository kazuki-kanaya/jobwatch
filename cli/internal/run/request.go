package run

import "fmt"

type Request struct {
	Command   []string
	Tags      []string
	TailLines int
}

func (r Request) Validate() error {
	if len(r.Command) == 0 {
		return fmt.Errorf("command is required")
	}

	if r.Command[0] == "" {
		return fmt.Errorf("command[0] is required")
	}

	if r.TailLines < 0 {
		return fmt.Errorf("tail_lines must be greater than or equal to 0")
	}

	return nil
}
