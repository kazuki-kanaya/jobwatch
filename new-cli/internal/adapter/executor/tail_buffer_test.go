package executor

import (
	"reflect"
	"testing"
)

func TestNewTailBufferRejectsNegativeLimit(t *testing.T) {
	t.Parallel()

	buffer, err := newTailBuffer(-1)
	if err == nil {
		t.Fatal("expected error for negative limit")
	}
	if buffer != nil {
		t.Fatal("expected nil buffer for negative limit")
	}
}

func TestTailBufferLimitZero(t *testing.T) {
	t.Parallel()

	buffer := mustNewTailBuffer(t, 0)
	buffer.Add("hello")
	buffer.Add("world")

	if got := buffer.Lines(); len(got) != 0 {
		t.Fatalf("expected no lines, got %v", got)
	}
}

func TestTailBufferKeepsLastLinesInOrder(t *testing.T) {
	t.Parallel()

	buffer := mustNewTailBuffer(t, 3)
	buffer.Add("one")
	buffer.Add("two")
	buffer.Add("three")
	buffer.Add("four")
	buffer.Add("five")

	want := []string{"three", "four", "five"}
	if got := buffer.Lines(); !reflect.DeepEqual(got, want) {
		t.Fatalf("unexpected lines: got %v, want %v", got, want)
	}
}

func mustNewTailBuffer(t *testing.T, limit int) *tailBuffer {
	t.Helper()

	buffer, err := newTailBuffer(limit)
	if err != nil {
		t.Fatalf("newTailBuffer(%d): %v", limit, err)
	}

	return buffer
}
