"""Autonomous Gardening System (AGS) Device package.

This package follows a modular architecture.
Only high-level stubs are implemented for now – detailed functionality will be
added in a test-driven manner as hardware is integrated.
"""

from pathlib import Path

import falcon

__all__ = [
    "create_app",
]


class HealthResource:  # pylint: disable=too-few-public-methods
    """Simple liveness probe."""

    async def on_get(self, req: falcon.Request, resp: falcon.Response) -> None:  # noqa: D401
        """Return OK status for health checks."""
        resp.media = {"status": "ok"}


def create_app(static_dir: Path | None = None) -> falcon.App:  # noqa: D401
    """Build a Falcon ASGI application.

    Parameters
    ----------
    static_dir: Optional[Path]
        Directory that holds the web frontend. If provided, the folder will be
        exposed under the root ("/") so that the SPA can be loaded directly
        from the backend.
    """
    app = falcon.asgi.App()
    app.add_route("/health", HealthResource())

    if static_dir is not None:
        # Expose the compiled SPA / static files under the root path. Falcon
        # will serve them directly without further processing.
        app.add_static_route("/", str(static_dir), downloadable=True)

    return app
