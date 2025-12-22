# Build stage
FROM cgr.dev/chainguard/wolfi-base:latest AS builder
RUN apk add --no-cache go git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# Runtime stage
FROM cgr.dev/chainguard/glibc-dynamic:latest
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/templates ./templates
EXPOSE 8000
CMD ["./main"]
