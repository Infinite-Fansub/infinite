package main

import (
	"encoding/json"
	"log"

	"github.com/go-redis/redis"
)

type data map[string]any

func JsonSet(rdb *redis.Client, key string, path string, data *data) interface{} {
	jn, err := json.Marshal(data)
	if err != nil {
		log.Fatal(err)
	}

	cmd := rdb.Do("JSON.SET", key, path, jn)

	return cmd.Val()
}

func JsonGet(rdb *redis.Client, key string) interface{} {
	cmd := rdb.Do("JSON.GET", key)

	return cmd.Val()
}

func CreateIndex(rdb *redis.Client, index string, dataType string, data ...string) interface{} {
	cmd := rdb.Do("FT.CREATE", index, "ON", dataType, "SCHEMA", data)

	return cmd.Val()
}
