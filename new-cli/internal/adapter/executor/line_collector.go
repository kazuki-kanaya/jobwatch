package executor

import (
	"bytes"
	"strings"
	"sync"
)

type lineCollector struct {
	tail *tailBuffer
	buf  bytes.Buffer
	mu   sync.Mutex
}

func newLineCollector(tail *tailBuffer) *lineCollector {
	return &lineCollector{
		tail: tail,
	}
}

func (c *lineCollector) Write(p []byte) (int, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if _, err := c.buf.Write(p); err != nil {
		return 0, err
	}

	for {
		data := c.buf.Bytes()
		newline := bytes.IndexByte(data, '\n')
		if newline < 0 {
			break
		}
		line := string(data[:newline])
		line = strings.TrimSuffix(line, "\r")
		c.tail.Add(line)

		c.buf.Next(newline + 1)
	}
	return len(p), nil
}

func (c *lineCollector) Flush() {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.buf.Len() == 0 {
		return
	}

	line := c.buf.String()
	line = strings.TrimSuffix(line, "\n")
	line = strings.TrimSuffix(line, "\r")
	if line != "" {
		c.tail.Add(line)
	}

	c.buf.Reset()
}
