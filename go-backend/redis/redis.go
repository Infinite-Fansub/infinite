package redis

import (
	"github.com/go-redis/redis"
)

var rdb = redis.NewClient(&redis.Options{})

func main() {
	type T struct {
		A string `json:"a"`
	}
}

func JsonSet[T any](key string, path, string, data T) {

}
