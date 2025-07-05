module elyanalyzer/backend

go 1.20

require (
        elyanalyzer/shared v0.0.0-00010101000000-000000000000
        github.com/gorilla/websocket v1.5.3
        github.com/jung-kurt/gofpdf v1.16.2
        github.com/lib/pq v1.10.9
        github.com/joho/godotenv v1.5.1
)

replace elyanalyzer/shared => ../shared
