/** Supported international carrier jurisdictions */
export type CountryCode = 'US' | 'DE' | 'GB';

/**
 * An available telephone number in the inventory.
 */
export interface PhoneNumberItem {
  id: string;
  number: string; // E.164 formatted number (+49 30 555 0192)
  country: CountryCode;
  monthlyPrice: number; // recurring monthly rental price in USD
  capabilities: ('Voice' | 'SMS')[];
}

/**
 * WHY: International telecom laws (e.g. German BNetzA or US 10DLC) mandate specific
 *      regulatory compliance proofs before numbers can be activated.
 */
export interface CountryRegulation {
  country: CountryCode;
  countryName: string;
  flag: string;

  /** WHY: Germany requires physical local office proof in the area code */
  requiresLocalAddress: boolean;

  /** Dynamic form fields required for this jurisdiction */
  requiredFields: { key: string; label: string; placeholder: string }[];

  /** Whether number activates instantly or requires carrier document audit */
  approvalType: 'Instant Activation' | 'Manual 24h Regulatory Review';
}
