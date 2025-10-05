# syntax=docker/dockerfile:1

# --- Build stage ---
FROM golang:1.22 AS builder
WORKDIR /app

ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server ./cmd/main.go

# --- Runtime stage ---
FROM gcr.io/distroless/base-debian12:nonroot
WORKDIR /app

COPY --from=builder /app/server /app/server

EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app/server"]

