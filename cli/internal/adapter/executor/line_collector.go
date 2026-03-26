package executor

import (
	"bytes"
	"sync"
)

type lineCollector struct {
	tail        *tailBuffer
	buf         bytes.Buffer
	mu          sync.Mutex
	pendingCR   bool
	dropOnFlush bool
}

func newLineCollector(tail *tailBuffer) *lineCollector {
	return &lineCollector{tail: tail}
}

// Write keeps only newline-finalized output.
// Standalone CR updates are treated as in-place overwrites, while CRLF is
// treated as a normal line ending.
func (c *lineCollector) Write(p []byte) (int, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	for _, b := range p {
		if c.pendingCR {
			if b == '\n' {
				c.flushLine() // CRLF: treat as a normal newline.
				continue
			}
			// Standalone CR: treat as an in-place overwrite.
			c.buf.Reset()
			c.pendingCR = false
			c.dropOnFlush = true
		}

		switch b {
		case '\r':
			c.pendingCR = true
		case '\n':
			c.flushLine()
		default:
			if err := c.buf.WriteByte(b); err != nil {
				return 0, err
			}
		}
	}
	return len(p), nil
}

// Flush preserves a trailing fragment only when it is a normal unfinished line.
// Pending CR-based updates are dropped as transient progress output.
func (c *lineCollector) Flush() {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Drop unfinished CR-based updates, such as partial tqdm progress output.
	if c.pendingCR || c.dropOnFlush {
		c.buf.Reset()
		c.pendingCR = false
		c.dropOnFlush = false
		return
	}

	c.flushLine()
}

func (c *lineCollector) flushLine() {
	if c.buf.Len() > 0 {
		c.tail.Add(c.buf.String())
	}
	c.buf.Reset()
	c.pendingCR = false
	c.dropOnFlush = false
}
