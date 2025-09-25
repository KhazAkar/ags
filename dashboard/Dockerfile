FROM alpine:latest
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
RUN uv python install 3.13.7
COPY . /app
RUN uv sync
CMD ["uv", "run", "main.py"]
