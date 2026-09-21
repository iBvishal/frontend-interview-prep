# Problem 5: Dynamic International Phone Number Provisioning & Compliance Wizard

## Background
Expanding telephony internationally means managing complex country-specific regulatory compliance before telephone numbers can be purchased or routed (e.g. German BNetzA local address verification, US 10DLC brand registration, Australian identity proof).

## The Task
Build a multi-step phone number search, provisioning, and regulatory compliance wizard in Vanilla TypeScript.

## Functional Requirements
1. **Search & Filter:**
   - Filter numbers by Country (US, GB, DE, JP, AU).
   - Filter by Capability (`Voice`, `SMS`, `MMS`, `Toll-Free`).
   - Prefix/Area code search.
2. **Dynamic Regulatory Requirements Form:**
   - Selecting a country dynamically updates the required compliance documents and inputs:
     - **Germany (DE):** Requires Local Address Verification (City, Street, Postal Code in matching jurisdiction) + Tax ID.
     - **United States (US):** Requires 10DLC Brand Name, EIN, and Campaign Use Case.
     - **United Kingdom (GB):** Standard business address verification.
3. **Cart & Cost Breakdown:**
   - Shows monthly recurrent cost + compliance verification fee.
4. **Validation & Review:**
   - Real-time form validation with inline error messaging.
   - Confirmation receipt with generated provisioning ID and status (`Pending Verification` vs `Active`).
