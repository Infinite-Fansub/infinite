package main

import (
	"api/handler"
	"fmt"
)

func main() {
	hInstance := handler.New("test")

	out := hInstance.Rename("t.json", "imoutofideas.json")

	fmt.Println(out)
}
