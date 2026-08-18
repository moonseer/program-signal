"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    function update() {
      const article = document.querySelector("article");
      if (!article) {
        setPercent(0);
        return;
      }
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = window.scrollY - article.offsetTop;
      if (total <= 0) {
        setPercent(window.scrollY > 0 ? 100 : 0);
        return;
      }
      setPercent(Math.min(100, Math.max(0, (scrolled / total) * 100)));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
    >
      <div style={{ width: `${percent}%` }} />
    </div>
  );
}
