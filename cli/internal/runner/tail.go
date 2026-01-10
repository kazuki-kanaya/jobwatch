package runner

import "sync"

type TailBuffer struct {
	n     int
	lines []string
	size  int
	head  int
	mu    sync.Mutex
}

func NewTailBuffer(n int) *TailBuffer {
	return &TailBuffer{
		n:     n,
		lines: make([]string, n),
	}
}

// Ring Buffer, O(1) add
func (tb *TailBuffer) Add(line string) {
	tb.mu.Lock()
	defer tb.mu.Unlock()

	if tb.n == 0 {
		return
	}

	idx := (tb.head + tb.size) % tb.n
	tb.lines[idx] = line
	if tb.size < tb.n {
		tb.size++
	} else {
		tb.head = (tb.head + 1) % tb.n
	}
}

// Get all lines in order O(n)
func (tb *TailBuffer) Lines() []string {
	tb.mu.Lock()
	defer tb.mu.Unlock()

	lines := make([]string, tb.size)
	for i := 0; i < tb.size; i++ {
		lines[i] = tb.lines[(tb.head+i)%tb.n]
	}
	return lines
}
