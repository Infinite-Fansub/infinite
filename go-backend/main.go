package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
)

var rdb = redis.NewClient(&redis.Options{})

func main() {
	CreateIndex(rdb, "Album:", "JSON", "$.artist AS artist TEXT", "$.release AS release NUMBER")
	JsonSet(rdb, "Album:1", "$", &data{"artist": "Rand", "release": 328905743})
	JsonSet(rdb, "Album:2", "$", &data{"artist": "Tr", "release": 45456546})
	JsonSet(rdb, "Album:3", "$", &data{"artist": "Pain", "release": 76643})
	// gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.GET("/albums", getAlbums)
	router.GET("/album/:id", getAlbumById)

	router.Run("localhost:8080")
}

func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, JsonGet(rdb, "Album:*"))
}

func getAlbumById(c *gin.Context) {
	id := c.Param("id")

	val := JsonGet(rdb, fmt.Sprintf("Album:%v", id))

	if val != nil {
		c.IndentedJSON(http.StatusOK, val)
	}

	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}
