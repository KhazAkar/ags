"""CLI entry-point for AGS device backend."""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

import uvicorn

from . import create_app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)

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
    logger = logging.getLogger(__name__)

    # Resolve and verify static directory
    static_dir = STATIC_DIR.resolve()
    if not static_dir.exists():
        logger.warning("Static directory not found at: %s", static_dir)
        static_dir = None
    else:
        logger.info("Serving static files from: %s", static_dir)

    app = create_app(static_dir=static_dir)
    logger.info("Starting server on %s:%s", args.host, args.port)
    uvicorn.run(app, host=args.host, port=args.port, factory=False)


if __name__ == "__main__":  # pragma: no cover
    main()
