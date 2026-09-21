import type { PhoneNumberItem, CountryRegulation, CountryCode } from './types';

export const COUNTRY_REGULATIONS: Record<CountryCode, CountryRegulation> = {
  US: {
    country: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    requiresLocalAddress: false,
    requiredFields: [
      { key: 'brandName', label: '10DLC Brand Legal Name', placeholder: 'Acme Corp Inc.' },
      { key: 'ein', label: 'EIN (Tax ID: XX-XXXXXXX)', placeholder: '12-3456789' },
    ],
    approvalType: 'Instant Activation',
  },
  DE: {
    country: 'DE',
    countryName: 'Germany',
    flag: '🇩🇪',
    requiresLocalAddress: true,
    requiredFields: [
      { key: 'city', label: 'German City (Matching Prefix)', placeholder: 'Berlin' },
      { key: 'postalCode', label: 'German Postal Code (5-digit PLZ)', placeholder: '10115' },
      { key: 'street', label: 'Street Address', placeholder: 'Friedrichstraße 42' },
    ],
    approvalType: 'Manual 24h Regulatory Review',
  },
  GB: {
    country: 'GB',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    requiresLocalAddress: false,
    requiredFields: [
      { key: 'companyNumber', label: 'UK Companies House Number', placeholder: '08123456' },
      { key: 'businessName', label: 'Registered Business Name', placeholder: 'Acme UK Ltd' },
    ],
    approvalType: 'Instant Activation',
  },
};

export const AVAILABLE_NUMBERS: PhoneNumberItem[] = [
  { id: 'num-1', number: '+1 (415) 555-0144', country: 'US', monthlyPrice: 1.50, capabilities: ['Voice', 'SMS'] },
  { id: 'num-2', number: '+1 (212) 555-0182', country: 'US', monthlyPrice: 1.50, capabilities: ['Voice', 'SMS'] },
  { id: 'num-3', number: '+49 30 555 0192', country: 'DE', monthlyPrice: 3.50, capabilities: ['Voice'] },
  { id: 'num-4', number: '+49 89 555 0148', country: 'DE', monthlyPrice: 3.50, capabilities: ['Voice'] },
  { id: 'num-5', number: '+44 20 7946 0912', country: 'GB', monthlyPrice: 2.00, capabilities: ['Voice', 'SMS'] },
];
