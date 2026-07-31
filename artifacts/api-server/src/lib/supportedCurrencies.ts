/**
 * Listing display currencies accepted for feed/detail/SEO money labels.
 *
 * Must stay aligned with mobile `CURRENCY_BY_MARKET` + `EXTRA_CURRENCIES`
 * (artifacts/banco-mobile/constants/listingCreateTaxonomy.ts). A code present
 * at create but missing here is silently rewritten to EGP — pricing corruption
 * at multi-market scale. Prefer showing the seller's code over inventing EGP.
 */
export const SUPPORTED_LISTING_CURRENCIES = [
  "EGP",
  "SAR",
  "AED",
  "KWD",
  "QAR",
  "BHD",
  "IQD",
  "LBP",
  "MAD",
  "TND",
  "SDG",
  "TRY",
  "GBP",
  "USD",
  "EUR",
  "JOD",
  "OMR",
  "LYD",
  "DZD",
  "ILS",
  "SYP",
  "YER",
] as const;

export type SupportedListingCurrency =
  (typeof SUPPORTED_LISTING_CURRENCIES)[number];

export const SUPPORTED_LISTING_CURRENCY_SET = new Set<string>(
  SUPPORTED_LISTING_CURRENCIES,
);

export function normalizeListingCurrency(
  raw: string | null | undefined,
): SupportedListingCurrency {
  const code = String(raw ?? "")
    .trim()
    .toUpperCase();
  return SUPPORTED_LISTING_CURRENCY_SET.has(code)
    ? (code as SupportedListingCurrency)
    : "EGP";
}

/**
 * Write-path enforcement for listing specs.currency (REL-01).
 * - missing/blank → default EGP (legacy rows / requests)
 * - present but unknown → INVALID_DATA (never store garbage codes)
 * - present and known → normalized uppercase ISO code
 */
export function enforceListingCurrencySpec(
  specs: Record<string, unknown>,
): Record<string, unknown> {
  const raw = specs.currency;
  if (raw == null || raw === "") {
    return { ...specs, currency: "EGP" };
  }
  const code = String(raw).trim().toUpperCase();
  if (!SUPPORTED_LISTING_CURRENCY_SET.has(code)) {
    throw Object.assign(
      new Error(
        `Unsupported currency "${code}". Use a BANCO market currency (e.g. EGP, SAR, AED).`,
      ),
      { code: "INVALID_DATA" },
    );
  }
  if (specs.currency === code) return specs;
  return { ...specs, currency: code };
}
