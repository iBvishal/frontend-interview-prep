import './style.css';
import type { CountryCode, PhoneNumberItem } from './types';
import { AVAILABLE_NUMBERS, COUNTRY_REGULATIONS } from './mock-data';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Application State
let selectedCountry: CountryCode = 'US';
let selectedNumber: PhoneNumberItem = AVAILABLE_NUMBERS[0];
let formValues: Record<string, string> = {};
let isSubmitted = false;

/**
 * Main render function: builds dynamic 2-column provisioning wizard
 */
function render() {
  const reg = COUNTRY_REGULATIONS[selectedCountry];
  const numbersForCountry = AVAILABLE_NUMBERS.filter((n) => n.country === selectedCountry);

  // HOW: Auto-select first number for newly selected country if current number is from old country
  if (selectedNumber.country !== selectedCountry) {
    selectedNumber = numbersForCountry[0] || AVAILABLE_NUMBERS[0];
  }

  // HOW: Form validity checks that every required regulatory field is filled out
  const isFormValid = reg.requiredFields.every((f) => (formValues[f.key] || '').trim().length > 0);

  // Success Confirmation Receipt View
  if (isSubmitted) {
    app.innerHTML = `
      <div class="header">
        <h1>LiveKit Telephony // Provisioning Confirmation</h1>
      </div>
      <div class="card" style="max-width: 600px; margin: 40px auto; text-align: center; gap: 16px;">
        <div style="font-size: 40px;">🎉</div>
        <h2 style="font-size: 18px; color: #10b981;">Number Successfully Provisioned!</h2>
        <div style="font-family: monospace; font-size: 20px; font-weight: 700; color: #38bdf8;">
          ${selectedNumber.number}
        </div>
        <!-- WHY: Telephony engineers need the provisioned SIP URI to configure incoming call routing -->
        <div style="background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 6px; text-align: left; font-size: 12px; font-family: monospace;">
          <div>Country: ${reg.countryName} ${reg.flag}</div>
          <div>Status: <span style="color: #10b981;">${reg.approvalType}</span></div>
          <div>Monthly Rate: $${selectedNumber.monthlyPrice.toFixed(2)}/mo</div>
          <div>Inbound SIP Dispatch: sip:${selectedNumber.number.replace(/\D/g, '')}@sip.livekit.cloud</div>
        </div>
        <button id="btn-reset" class="btn-primary">Provision Another Number</button>
      </div>
    `;

    document.querySelector('#btn-reset')?.addEventListener('click', () => {
      isSubmitted = false;
      formValues = {};
      render();
    });
    return;
  }

  app.innerHTML = `
    <div class="header">
      <h1>LiveKit Telephony // International Number Provisioning</h1>
    </div>

    <div class="grid-layout">
      <!-- Left Column: Country Jurisdiction & Number Inventory -->
      <div class="card">
        <label class="form-label">1. Select Country Jurisdiction:</label>
        <select id="country-select">
          <option value="US" ${selectedCountry === 'US' ? 'selected' : ''}>🇺🇸 United States (+1)</option>
          <option value="DE" ${selectedCountry === 'DE' ? 'selected' : ''}>🇩🇪 Germany (+49)</option>
          <option value="GB" ${selectedCountry === 'GB' ? 'selected' : ''}>🇬🇧 United Kingdom (+44)</option>
        </select>

        <label class="form-label" style="margin-top: 10px;">2. Available Telephony Numbers:</label>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${numbersForCountry
            .map(
              (n) => `
            <div class="number-item ${selectedNumber.id === n.id ? 'selected' : ''}" data-id="${n.id}">
              <div>
                <div style="font-family: monospace; font-weight: 600;">${n.number}</div>
                <div style="font-size: 11px; color: #94a3b8;">
                  ${n.capabilities.map((c) => `<span class="badge">${c}</span>`).join(' ')}
                </div>
              </div>
              <div style="font-family: monospace; color: #38bdf8; font-weight: 600;">
                $${n.monthlyPrice.toFixed(2)}/mo
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Right Column: Dynamic Compliance Form & Checkout -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label class="form-label">3. Regulatory Compliance Requirements (${reg.countryName} ${reg.flag})</label>
        </div>

        <!-- WHY: Contextual warning informs user about local jurisdiction regulations -->
        <div class="alert">
          📋 <strong>Regulation:</strong> ${reg.requiresLocalAddress ? 'German BNetzA mandates verified local address matching the area code.' : 'Standard carrier business identity registration.'}
        </div>

        <!-- HOW: Dynamically render input fields matching the selected country's laws -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${reg.requiredFields
            .map(
              (f) => `
            <div class="form-group">
              <label class="form-label">${f.label} *</label>
              <input 
                type="text" 
                data-key="${f.key}" 
                class="reg-input" 
                placeholder="${f.placeholder}" 
                value="${formValues[f.key] || ''}" 
              />
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Order Summary -->
        <div style="margin-top: 12px; background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 6px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Selected Number:</span>
            <strong style="font-family: monospace;">${selectedNumber.number}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Regulatory Verification:</span>
            <span style="color: #38bdf8;">${reg.approvalType}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; border-top: 1px solid #334155; padding-top: 6px; margin-top: 6px;">
            <span>Total Due Monthly:</span>
            <span style="color: #10b981; font-family: monospace;">$${selectedNumber.monthlyPrice.toFixed(2)}</span>
          </div>
        </div>

        <!-- Submit Button: Disabled until all regulatory inputs are valid -->
        <button id="btn-submit" class="btn-primary" ${!isFormValid ? 'disabled' : ''}>
          ${isFormValid ? 'Provision Phone Number' : 'Complete All Compliance Fields'}
        </button>
      </div>
    </div>
  `;

  // HOW: Changing country resets form values and re-renders required inputs
  document.querySelector<HTMLSelectElement>('#country-select')!.addEventListener('change', (e) => {
    selectedCountry = (e.target as HTMLSelectElement).value as CountryCode;
    formValues = {};
    render();
  });

  // Select phone number
  document.querySelectorAll<HTMLDivElement>('.number-item').forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.dataset.id!;
      selectedNumber = AVAILABLE_NUMBERS.find((n) => n.id === id)!;
      render();
    });
  });

  // HOW: Update state per keystroke and toggle submit button state in real-time
  document.querySelectorAll<HTMLInputElement>('.reg-input').forEach((input) => {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      formValues[target.dataset.key!] = target.value;
      const submitBtn = document.querySelector<HTMLButtonElement>('#btn-submit')!;
      const valid = reg.requiredFields.every((f) => (formValues[f.key] || '').trim().length > 0);
      submitBtn.disabled = !valid;
      submitBtn.innerText = valid ? 'Provision Phone Number' : 'Complete All Compliance Fields';
    });
  });

  // Submit handler
  document.querySelector('#btn-submit')?.addEventListener('click', () => {
    if (isFormValid) {
      isSubmitted = true;
      render();
    }
  });
}

render();
