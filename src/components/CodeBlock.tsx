"use client";

import {
  Children,
  isValidElement,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

function languageOf(node: ReactNode): string | undefined {
  const child = Children.toArray(node).find((item) => isValidElement(item));
  if (!isValidElement<{ className?: string }>(child)) return undefined;
  const match = child.props.className?.match(/language-([a-z0-9+-]+)/i);
  return match?.[1];
}

export function CodeBlock({
  children,
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const language = languageOf(children);
  const source = textOf(children).replace(/\n$/, "");

  async function copy() {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="code-block">
      <div className="code-block-bar">
        <span>{language ? language : "Code"}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Code copied to clipboard." : ""}
      </span>
      <pre tabIndex={0} {...props}>
        {children}
      </pre>
    </div>
  );
}
