export function formatLuuButDate(
  dateStr: string,
  format: "short" | "long" = "short",
) {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  if (format === "long") {
    return date.toLocaleString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
