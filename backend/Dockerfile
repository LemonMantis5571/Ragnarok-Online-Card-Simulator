# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install git and build dependencies
RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the binary
# -o maingame: output name
# ./cmd/api/main.go: entry point
RUN go build -o maingame ./cmd/api/main.go

# Run Stage
FROM alpine:latest

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/maingame .

# Expose port (adjust if your app uses a specific port env)
EXPOSE 8080

# Command to run
CMD ["./maingame"]
