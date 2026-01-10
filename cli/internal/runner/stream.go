package runner

import (
	"bufio"
	"fmt"
	"io"
)

func stream(r io.Reader, w io.Writer, tail *TailBuffer) {
	sc := bufio.NewScanner(r)

	for sc.Scan() {
		line := sc.Text()
		fmt.Fprintln(w, line)
		tail.Add(line)
	}
}
