export const basePrompt = `<boltArtifact id="project-import" title="Golang API Starter Project">

<boltAction type="file" filePath="go.mod">
module github.com/example/goserver

go 1.22

require (
	github.com/gin-gonic/gin v1.10.0
)
</boltAction>

<boltAction type="file" filePath="main.go">
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello from Go + Gin Framework! 🚀")
	})

	r.GET("/api/message", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Golang API working perfectly!",
		})
	})

	r.Run(":8080") // listen and serve on port 8080
}
</boltAction>

<boltAction type="file" filePath=".gitignore">
bin/
vendor/
*.exe
*.log
*.out
</boltAction>

<boltAction type="file" filePath="README.md">
# 🦫 Go + Gin Starter API

Simple API built using **Go** and the **Gin** web framework.

## ▶️ Run Instructions

1. Install Go (1.22+)
2. Run:
   \`\`\`bash
   go mod tidy
   go run main.go
   \`\`\`
3. Visit [http://localhost:8080](http://localhost:8080)

## API Endpoints
- **GET /** → Returns a welcome message
- **GET /api/message** → Returns a JSON API message
</boltAction>

</boltArtifact>`;
