import assert from "node:assert/strict";
import { test } from "node:test";
import { absoluteUrl, resolveSiteUrl } from "./site";

test("resolveSiteUrl defaults to platformsignal.dev without Vercel overrides", () => {
  const prev = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  };
  try {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_ENV;
    delete process.env.VERCEL_URL;
    assert.equal(resolveSiteUrl(), "https://platformsignal.dev");
  } finally {
    for (const [key, value] of Object.entries(prev)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("resolveSiteUrl strips trailing slash on explicit override", () => {
  const prev = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test/";
    assert.equal(resolveSiteUrl(), "https://example.test");
  } finally {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = prev;
  }
});

test("resolveSiteUrl uses production domain even when VERCEL_URL is a vercel.app host", () => {
  const prev = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  };
  try {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_URL = "program-signal-abc.vercel.app";
    assert.equal(resolveSiteUrl(), "https://platformsignal.dev");
  } finally {
    for (const [key, value] of Object.entries(prev)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("absoluteUrl joins the resolved origin", () => {
  assert.equal(
    absoluteUrl("/articles/observability-for-ai-agents"),
    `${resolveSiteUrl()}/articles/observability-for-ai-agents`,
  );
});
