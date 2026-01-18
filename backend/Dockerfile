# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install git and build dependencies
RUN apk add --no-cache git

COPY backend/go.mod backend/go.sum ./

RUN go mod download

COPY backend/ .

# 3. Build the binary

RUN go build -o maingame ./cmd/api/main.go


# Run Stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/maingame .
# Copy internal assets (db json files)
COPY --from=builder /app/internal ./internal

EXPOSE 8080

CMD ["./maingame"]