"""CLI entry-point for AGS device backend."""
from __future__ import annotations

import argparse
from pathlib import Path

import uvicorn

from . import create_app

# Default location of the frontend relative to this file.
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"


def build_parser() -> argparse.ArgumentParser:  # noqa: D401
    """Create CLI argument parser."""
    parser = argparse.ArgumentParser(
        prog="ags-device",
        description="Autonomous Gardening System – device backend server",
    )
    parser.add_argument("--host", default="0.0.0.0", help="Bind address (default: 0.0.0.0)")
    parser.add_argument("--port", default=8000, type=int, help="Port to listen on (default: 8000)")
    return parser


def main() -> None:  # noqa: D401
    """Run Uvicorn ASGI server."""
    args = build_parser().parse_args()

    app = create_app(static_dir=STATIC_DIR)
    uvicorn.run(app, host=args.host, port=args.port, factory=False)


if __name__ == "__main__":  # pragma: no cover
    main()
