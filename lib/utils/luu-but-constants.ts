export function formatLuuButDate(
  dateStr: string,
  format: "short" | "long" = "short",
) {
  if (format === "long") {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
