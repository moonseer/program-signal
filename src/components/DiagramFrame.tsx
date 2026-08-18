"use client";

import { useRef, useState } from "react";

export function DiagramFrame({ id, svg }: { id: string; svg: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  function expand() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function collapse() {
    dialogRef.current?.close();
    setOpen(false);
  }

  function download() {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${id}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-4 pb-2 font-mono text-[11px] uppercase tracking-[0.16em]">
        <button
          type="button"
          className="min-h-11 text-[var(--muted)] hover:text-[var(--accent)]"
          onClick={expand}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          Expand
        </button>
        <button
          type="button"
          className="min-h-11 text-[var(--muted)] hover:text-[var(--accent)]"
          onClick={download}
        >
          Download SVG
        </button>
      </div>
      <div
        className="diagram-frame overflow-x-auto border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <dialog
        ref={dialogRef}
        className="diagram-dialog m-0 h-full max-h-none w-full max-w-none border-0 bg-[var(--bg)] p-0 text-[var(--fg)]"
        aria-label={`${id} expanded`}
        onClose={() => setOpen(false)}
      >
        <div className="flex min-h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span className="text-[var(--muted)]">{id}</span>
            <div className="flex gap-4">
              <button
                type="button"
                className="min-h-11 text-[var(--muted)] hover:text-[var(--accent)]"
                onClick={download}
              >
                Download SVG
              </button>
              <button
                type="button"
                className="min-h-11 text-[var(--accent)]"
                onClick={collapse}
              >
                Close
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-4 sm:p-10">
            <div
              className="diagram-frame w-full max-w-5xl"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </dialog>
    </div>
  );
}
