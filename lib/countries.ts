const COUNTRY_CODES: Record<string, string> = {
  ethiopia: "ET",
  kenya: "KE",
  djibouti: "DJ",
  uganda: "UG",
  germany: "DE",
  france: "FR",
  "united kingdom": "GB",
  uk: "GB",
  brazil: "BR",
  india: "IN",
  china: "CN",
  "united states": "US",
  usa: "US",
  japan: "JP",
  "south korea": "KR",
  turkey: "TR",
  "united arab emirates": "AE",
  uae: "AE",
  italy: "IT",
  netherlands: "NL",
  spain: "ES",
  canada: "CA",
  "saudi arabia": "SA",
};

/** Best-effort country name/ISO lookup for card flags. */
export function countryCodeFromName(name: string | null | undefined) {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  if (!normalized) return undefined;
  return (
    COUNTRY_CODES[normalized] ??
    (normalized.length === 2 ? normalized.toUpperCase() : undefined)
  );
}
