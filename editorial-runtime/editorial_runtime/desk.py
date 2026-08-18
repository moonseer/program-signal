"""Local Editor-in-Chief desk. Binds to 127.0.0.1 only. Does not publish."""

from __future__ import annotations

import html
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from editorial_runtime.evidence_gates import draft_word_count
from editorial_runtime.models import WorkflowStage, WorkflowState
from editorial_runtime.store import RunStore
from editorial_runtime.workflow import decide_workflow, revise_workflow

HOST = "127.0.0.1"


def inbox(store: RunStore) -> list[WorkflowState]:
    rows = store.list(stage=WorkflowStage.human_gate.value, limit=50)
    pending = [row for row in rows if row.human_status == "pending"]
    decided = [row for row in rows if row.human_status != "pending"]
    return pending + decided


def _page(title: str, body: str) -> bytes:
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{html.escape(title)}</title>
  <style>
    :root {{ --bg:#161513; --fg:#ece7de; --muted:#a8a196; --border:#2f2c28; --accent:#8fc4b3; --card:#1d1b18; }}
    body {{ margin:0; background:var(--bg); color:var(--fg); font:18px/1.55 ui-serif, Georgia, serif; }}
    header, main {{ max-width: 72rem; margin: 0 auto; padding: 1.25rem 1.5rem; }}
    header {{ border-bottom: 1px solid var(--border); display:flex; justify-content:space-between; gap:1rem; }}
    a {{ color: var(--accent); }}
    .muted {{ color: var(--muted); font-family: ui-monospace, monospace; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }}
    .grid {{ display:grid; grid-template-columns: 16rem minmax(0,1fr) 18rem; gap: 1.5rem; }}
    @media (max-width: 900px) {{ .grid {{ grid-template-columns: 1fr; }} }}
    .card {{ background: var(--card); border: 1px solid var(--border); padding: 1rem; }}
    nav a {{ display:block; padding: .6rem 0; border-bottom: 1px solid var(--border); text-decoration:none; color: var(--fg); }}
    .badge {{ font-family: ui-monospace, monospace; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }}
    pre {{ white-space: pre-wrap; font: 16px/1.6 ui-serif, Georgia, serif; margin:0; }}
    textarea, button {{ font: inherit; }}
    textarea {{ width:100%; min-height: 6rem; background:#241f1b; color:var(--fg); border:1px solid var(--border); padding:.6rem; }}
    button {{ background: transparent; color: var(--accent); border: 1px solid var(--accent); padding: .55rem 1rem; cursor: pointer; }}
    form {{ margin: .75rem 0; }}
    .warn {{ color: #e7b9a8; }}
  </style>
</head>
<body>
  <header>
    <div>
      <p class="muted">Local only · 127.0.0.1 · does not publish</p>
      <strong>Editor-in-Chief desk</strong>
    </div>
    <p class="muted">Accept records a decision. Merge to main still publishes.</p>
  </header>
  <main>{body}</main>
</body>
</html>
""".encode("utf-8")


def render_index(rows: list[WorkflowState]) -> bytes:
    if not rows:
        items = "<p class='muted'>No human-gate runs.</p>"
    else:
        links = []
        for row in rows:
            title = row.brief.working_title if row.brief else row.topic
            links.append(
                f"<a href='/runs/{html.escape(row.workflow_id)}'>"
                f"<span class='badge'>{html.escape(row.human_status)}</span><br>"
                f"{html.escape(title)}</a>"
            )
        items = "".join(links)
    return _page("Editorial desk", f"<h1>Inbox</h1><div class='card'>{items}</div>")


def render_run(state: WorkflowState) -> bytes:
    brief = state.brief
    title = brief.working_title if brief else state.topic
    words = draft_word_count(state.draft_mdx or "")
    target = brief.target_length if brief else 0
    evidence = state.evidence_review
    status = evidence.editor_status.value if evidence else "none"
    claims = ""
    if evidence:
        for claim in evidence.claim_reviews:
            claims += (
                f"<p><span class='badge'>{html.escape(claim.status)}</span> "
                f"{html.escape(claim.claim_id)} — {html.escape(claim.note)}</p>"
            )
    length_class = "warn" if target and words < int(target * 0.6) else ""
    body = f"""
    <p class="muted"><a href="/">Inbox</a> · {html.escape(state.workflow_id)}</p>
    <div class="grid">
      <aside class="card">
        <p class="badge">Queue</p>
        <p>{html.escape(title)}</p>
        <p class="muted">{html.escape(state.assigned_persona.value)} · {html.escape(brief.content_type.value if brief else '')}</p>
        <p class="{length_class}">{words} / {target} words</p>
        <p class="badge">Evidence {html.escape(status)}</p>
      </aside>
      <article class="card">
        <p class="badge">Draft</p>
        <pre>{html.escape(state.draft_mdx or '(empty)')}</pre>
      </article>
      <aside class="card">
        <p class="badge">Brief</p>
        <p>{html.escape(brief.central_thesis if brief else '')}</p>
        <p class="muted">Evidence</p>
        <p>{html.escape(evidence.summary if evidence else 'No review')}</p>
        {claims}
        <p class="muted">This does not publish</p>
        <form method="post" action="/runs/{html.escape(state.workflow_id)}/accept">
          <textarea name="notes" placeholder="Optional note"></textarea>
          <button type="submit">Accept</button>
        </form>
        <form method="post" action="/runs/{html.escape(state.workflow_id)}/reject">
          <textarea name="notes" placeholder="Why reject"></textarea>
          <button type="submit">Reject</button>
        </form>
        <form method="post" action="/runs/{html.escape(state.workflow_id)}/revise">
          <textarea name="notes" required placeholder="Revision notes for Author"></textarea>
          <button type="submit">Send back to Author</button>
        </form>
      </aside>
    </div>
    """
    return _page(title, body)


def make_handler(store: RunStore, runs_dir: Path):
    class DeskHandler(BaseHTTPRequestHandler):
        def log_message(self, format: str, *args) -> None:  # noqa: A002
            return

        def _read_form(self) -> dict[str, str]:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8") if length else ""
            parsed = parse_qs(raw, keep_blank_values=True)
            return {key: values[0] if values else "" for key, values in parsed.items()}

        def do_GET(self) -> None:  # noqa: N802
            path = urlparse(self.path).path
            if path == "/":
                return self._send(200, render_index(inbox(store)))
            if path.startswith("/runs/"):
                workflow_id = path.split("/")[2]
                state = store.get(workflow_id)
                if state is None:
                    return self._send(404, _page("Not found", "<p>No run.</p>"))
                return self._send(200, render_run(state))
            self._send(404, _page("Not found", "<p>Not found.</p>"))

        def do_POST(self) -> None:  # noqa: N802
            path = urlparse(self.path).path
            parts = path.strip("/").split("/")
            if len(parts) != 3 or parts[0] != "runs":
                return self._send(404, _page("Not found", "<p>Not found.</p>"))
            workflow_id, action = parts[1], parts[2]
            notes = self._read_form().get("notes", "")
            try:
                if action == "accept":
                    decide_workflow(
                        workflow_id=workflow_id,
                        decision="approved",
                        runs_dir=runs_dir,
                        notes=notes,
                        store=store,
                    )
                elif action == "reject":
                    decide_workflow(
                        workflow_id=workflow_id,
                        decision="rejected",
                        runs_dir=runs_dir,
                        notes=notes,
                        store=store,
                    )
                elif action == "revise":
                    revise_workflow(
                        workflow_id=workflow_id,
                        runs_dir=runs_dir,
                        notes=notes,
                        store=store,
                    )
                else:
                    return self._send(404, _page("Not found", "<p>Unknown action.</p>"))
            except ValueError as exc:
                return self._send(400, _page("Cannot decide", f"<p>{html.escape(str(exc))}</p>"))
            self.send_response(303)
            self.send_header("Location", f"/runs/{workflow_id}")
            self.end_headers()

        def _send(self, code: int, body: bytes) -> None:
            self.send_response(code)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    return DeskHandler


def serve_desk(*, store: RunStore, runs_dir: Path, port: int = 8787) -> str:
    server = ThreadingHTTPServer((HOST, port), make_handler(store, runs_dir))
    url = f"http://{HOST}:{port}"
    print(json.dumps({"desk": url, "bind": HOST}, indent=2))
    server.serve_forever()
    return url
