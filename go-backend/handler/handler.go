package handler

import (
	"fmt"
	"io/fs"
	"log"
	"os"
)

type handler struct {
	originalDir string
	oldName     *string
	folder      fs.FS
}

func New(dir string) handler {
	folder := os.DirFS(dir)
	e := handler{dir, nil, folder}
	return e
}

func (h handler) Open(file string) []byte {
	bytes, err := fs.ReadFile(h.folder, file)

	if err != nil {
		log.Fatal(err)
	}
	return bytes
}

type metadata struct {
	isFile    bool
	isDir     bool
	extension string
}

func (h handler) Rename(toChange string, name string, metadata ...metadata) string {
	err := os.Rename(fmt.Sprintf("%v/%v", h.originalDir, toChange), fmt.Sprintf("%v/%v", h.originalDir, name))
	if err != nil {
		log.Fatal(err)
	}

	return fmt.Sprintf("Renamed %v to %v", toChange, name)
}
