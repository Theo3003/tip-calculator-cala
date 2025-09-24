// ---- DOM refs
const billInput = document.querySelector('#bill');
const peopleInput = document.querySelector('#people');
const tipButtons = [...document.querySelectorAll('.tip-btn')];
const customTipInput = document.querySelector('#tip-custom');
const tipPerOut = document.querySelector('#tip-per-person');
const totalPerOut = document.querySelector('#total-per-person');
const resetBtn = document.querySelector('#reset');
const peopleErr = document.querySelector('#people-error');

// ---- state
let bill = 0;
let tipPct = 0; // 0.15 for 15%
let people = 1;

// ---- helpers
const toNumber = (v) => {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return isFinite(n) ? n : 0;
};
const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    isFinite(n) ? Math.round(n * 100) / 100 : 0
  );

function setActiveTip(pct) {
  tipPct = pct;
  tipButtons.forEach((b) => b.classList.toggle('active', toNumber(b.dataset.tip) / 100 === pct));
  if (customTipInput) customTipInput.value = '';
  calc();
}

function validatePeople() {
  const p = toNumber(peopleInput.value || 0);
  people = p;
  const invalid = p === 0;
  peopleErr.hidden = !invalid;
  peopleInput.classList.toggle('invalid', invalid);
  return !invalid;
}

function calc() {
  const ok = validatePeople();
  bill = toNumber(billInput.value || 0);

  if (!ok || people < 1) {
    tipPerOut.value = tipPerOut.textContent = '$0.00';
    totalPerOut.value = totalPerOut.textContent = '$0.00';
    toggleReset();
    return;
  }

  const tipTotal = bill * tipPct;
  const tipPer = tipTotal / people;
  const totalPer = (bill + tipTotal) / people;

  tipPerOut.textContent = money(tipPer);
  totalPerOut.textContent = money(totalPer);
  toggleReset();
}

function toggleReset() {
  const hasAny =
    (billInput.value && toNumber(billInput.value) > 0) ||
    (peopleInput.value && toNumber(peopleInput.value) > 0) ||
    tipPct > 0 ||
    (customTipInput && customTipInput.value);
  resetBtn.disabled = !hasAny;
}

// ---- events
billInput.addEventListener('input', calc);
peopleInput.addEventListener('input', calc);

tipButtons.forEach((btn) =>
  btn.addEventListener('click', () => setActiveTip(toNumber(btn.dataset.tip) / 100))
);

customTipInput.addEventListener('input', () => {
  tipButtons.forEach((b) => b.classList.remove('active'));
  tipPct = toNumber(customTipInput.value) / 100;
  calc();
});

resetBtn.addEventListener('click', () => {
  billInput.value = '';
  peopleInput.value = '';
  customTipInput.value = '';
  tipButtons.forEach((b) => b.classList.remove('active'));
  tipPct = 0;
  calc();
});

// initial
calc();
