package executor

import (
	"reflect"
	"testing"
)

func TestLineCollectorCollectsCompleteLines(t *testing.T) {
	t.Parallel()

	tail := mustNewTailBuffer(t, 10)
	collector := newLineCollector(tail)

	if _, err := collector.Write([]byte("hello\nworld\n")); err != nil {
		t.Fatalf("Write: %v", err)
	}

	want := []string{"hello", "world"}
	if got := tail.Lines(); !reflect.DeepEqual(got, want) {
		t.Fatalf("unexpected lines: got %v, want %v", got, want)
	}
}

func TestLineCollectorReassemblesSplitLine(t *testing.T) {
	t.Parallel()

	tail := mustNewTailBuffer(t, 10)
	collector := newLineCollector(tail)

	if _, err := collector.Write([]byte("hello\nwor")); err != nil {
		t.Fatalf("first Write: %v", err)
	}
	if got := tail.Lines(); !reflect.DeepEqual(got, []string{"hello"}) {
		t.Fatalf("unexpected lines after first write: got %v", got)
	}

	if _, err := collector.Write([]byte("ld\n")); err != nil {
		t.Fatalf("second Write: %v", err)
	}

	want := []string{"hello", "world"}
	if got := tail.Lines(); !reflect.DeepEqual(got, want) {
		t.Fatalf("unexpected lines: got %v, want %v", got, want)
	}
}

func TestLineCollectorFlushesTrailingFragment(t *testing.T) {
	t.Parallel()

	tail := mustNewTailBuffer(t, 10)
	collector := newLineCollector(tail)

	if _, err := collector.Write([]byte("hello\nworld")); err != nil {
		t.Fatalf("Write: %v", err)
	}

	collector.Flush()

	want := []string{"hello", "world"}
	if got := tail.Lines(); !reflect.DeepEqual(got, want) {
		t.Fatalf("unexpected lines: got %v, want %v", got, want)
	}
}

func TestLineCollectorKeepsOnlyNewlineFinalizedCarriageReturnLine(t *testing.T) {
	t.Parallel()

	tail := mustNewTailBuffer(t, 10)
	collector := newLineCollector(tail)

	if _, err := collector.Write([]byte("progress 10%\rprogress 20%\n")); err != nil {
		t.Fatalf("Write: %v", err)
	}

	want := []string{"progress 20%"}
	if got := tail.Lines(); !reflect.DeepEqual(got, want) {
		t.Fatalf("unexpected lines: got %v, want %v", got, want)
	}
}

func TestLineCollectorDropsTrailingCarriageReturnFragmentOnFlush(t *testing.T) {
	t.Parallel()

	tail := mustNewTailBuffer(t, 10)
	collector := newLineCollector(tail)

	if _, err := collector.Write([]byte("progress 10%\rprogress 20%")); err != nil {
		t.Fatalf("Write: %v", err)
	}

	collector.Flush()

	want := []string{}
	if got := tail.Lines(); !reflect.DeepEqual(got, want) {
		t.Fatalf("unexpected lines: got %v, want %v", got, want)
	}
}
