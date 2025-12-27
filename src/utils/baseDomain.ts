export function baseDomain(hostname: string) {
  const parts = hostname.split(".");
  return parts.slice(-2).join(".");
}
