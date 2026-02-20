package runner

import (
	"bytes"
	"io"
)

func stream(r io.Reader, w io.Writer, tail *TailBuffer) error {
	lineWriter := newTailLineWriter(tail)
	_, err := io.Copy(io.MultiWriter(w, lineWriter), r)
	lineWriter.Flush()
	return err
}

type tailLineWriter struct {
	tail    *TailBuffer
	pending []byte
}

func newTailLineWriter(tail *TailBuffer) *tailLineWriter {
	return &tailLineWriter{tail: tail}
}

func (tw *tailLineWriter) Write(p []byte) (int, error) {
	tw.pending = append(tw.pending, p...)
	for {
		idx := bytes.IndexByte(tw.pending, '\n')
		if idx < 0 {
			break
		}
		line := tw.pending[:idx]
		tw.tail.Add(trimCR(line))
		tw.pending = tw.pending[idx+1:]
	}
	return len(p), nil
}

func (tw *tailLineWriter) Flush() {
	if len(tw.pending) == 0 {
		return
	}
	tw.tail.Add(trimCR(tw.pending))
	tw.pending = tw.pending[:0]
}

func trimCR(line []byte) string {
	if len(line) > 0 && line[len(line)-1] == '\r' {
		line = line[:len(line)-1]
	}
	return string(line)
}
