package executor

import (
	"fmt"
	"sync"
)

type tailBuffer struct {
	mu    sync.Mutex
	limit int
	lines []string
	next  int  // Next write position in the ring buffer.
	full  bool // Whether the ring has wrapped at least once.
}

func newTailBuffer(limit int) (*tailBuffer, error) {
	if limit < 0 {
		return nil, fmt.Errorf("limit must be greater than or equal to 0")
	}

	return &tailBuffer{
		limit: limit,
		lines: make([]string, limit),
	}, nil
}

// Add adds a line to the tail buffer. If the buffer is full, it overwrites the oldest line.
func (b *tailBuffer) Add(line string) {
	b.mu.Lock()
	defer b.mu.Unlock()

	if b.limit == 0 {
		return
	}

	b.lines[b.next] = line
	b.next = (b.next + 1) % b.limit
	if b.next == 0 {
		b.full = true
	}
}

func (b *tailBuffer) Lines() []string {
	b.mu.Lock()
	defer b.mu.Unlock()

	if !b.full {
		out := make([]string, b.next)
		copy(out, b.lines[:b.next])
		return out
	}

	out := make([]string, b.limit)
	n := copy(out, b.lines[b.next:])
	copy(out[n:], b.lines[:b.next])
	return out
}
