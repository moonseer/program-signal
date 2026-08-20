"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  event: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean>;
};

export function TrackedLink({ event, eventProps, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        trackEvent(event, eventProps);
        onClick?.(clickEvent);
      }}
    />
  );
}

type ExternalProps = ComponentProps<"a"> & {
  event: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean>;
};

export function TrackedExternalLink({
  event,
  eventProps,
  onClick,
  ...props
}: ExternalProps) {
  return (
    <a
      {...props}
      onClick={(clickEvent) => {
        trackEvent(event, eventProps);
        onClick?.(clickEvent);
      }}
    />
  );
}
