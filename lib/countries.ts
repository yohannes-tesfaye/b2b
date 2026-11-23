/**
 * ISO-3166-1 alpha-2 country helpers (client-safe, no dependencies).
 *
 * Names come from `Intl.DisplayNames`, so there is no list to keep in sync and
 * no locale files to update. Flags are derived from the regional indicator
 * symbols (works in every modern browser, no image assets needed).
 */

const CODES =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW";

export type CountryOption = { value: string; label: string };

/** Common non-ISO values that show up in free-text data. */
const ALIASES: Record<string, string> = {
  UK: "GB",
  "U.K.": "GB",
  ENGLAND: "GB",
  USA: "US",
  "U.S.": "US",
  "U.S.A.": "US",
  UAE: "AE",
  "SOUTH KOREA": "KR",
  "NORTH KOREA": "KP",
  RUSSIA: "RU",
  VIETNAM: "VN",
  "IVORY COAST": "CI",
};

const ALL_CODES = CODES.split(" ");

let displayNames: Intl.DisplayNames | null = null;

function getDisplayNames(): Intl.DisplayNames | null {
  if (displayNames) return displayNames;
  try {
    displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames;
  } catch {
    return null;
  }
}

function isValidCode(code: string): boolean {
  return /^[A-Z]{2}$/.test(code) && ALL_CODES.includes(code);
}

/** Resolve free text ("uk", "USA", "Germany") or a code to an ISO alpha-2 code. */
export function normalizeCountryCode(value: string | null | undefined): string | null {
  if (!value) return null;
  const raw = value.trim().toUpperCase();
  if (!raw) return null;

  if (ALIASES[raw]) return ALIASES[raw];
  if (isValidCode(raw)) return raw;

  const names = getDisplayNames();
  if (names) {
    for (const code of ALL_CODES) {
      const name = names.of(code);
      if (name && name.toUpperCase() === raw) return code;
    }
  }

  return null;
}

export function countryName(code: string | null | undefined): string {
  if (!code) return "—";
  const normalized = normalizeCountryCode(code) ?? code.toUpperCase();
  const names = getDisplayNames();
  return names?.of(normalized) ?? normalized;
}

/** Turns "US" into the 🇺🇸 emoji. Returns "" for unknown codes. */
export function countryFlag(code: string | null | undefined): string {
  const normalized = normalizeCountryCode(code);
  if (!normalized) return "";
  return normalized.replace(/./g, (char) =>
    String.fromCodePoint(127397 + char.charCodeAt(0))
  );
}

let cachedOptions: CountryOption[] | null = null;

/** Alphabetical, memoised country options for selects and filters. */
export function getCountryOptions(): CountryOption[] {
  if (cachedOptions) return cachedOptions;
  cachedOptions = ALL_CODES.map((code) => ({
    value: code,
    label: countryName(code),
  })).sort((a, b) => a.label.localeCompare(b.label));
  return cachedOptions;
}
