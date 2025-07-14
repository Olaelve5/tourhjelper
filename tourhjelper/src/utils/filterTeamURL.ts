export function filterTeamURL(url: string): string {
  if (!url.includes("tourmanager.no") || !url.includes("/dashboard/")) {
    return url;
  }
  const parts = url.split("/");
  return parts[parts.length - 2] || "";
}
