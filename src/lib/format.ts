export function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function difficultyDots(
  difficulty: "beginner" | "intermediate" | "advanced" | "expert",
): string {
  const filled = {
    beginner: 1,
    intermediate: 3,
    advanced: 4,
    expert: 5,
  }[difficulty];
  return `${"●".repeat(filled)}${"○".repeat(5 - filled)}`;
}
