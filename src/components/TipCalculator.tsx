'use client';

import { useMemo, useState } from 'react';



const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [people, setPeople] = useState('');
  const [tipPct, setTipPct] = useState<number | null>(null);
  const [custom, setCustom] = useState('');

  const b = Number(bill) || 0;
  const p = Number(people) || 0;
  const pct = custom ? Number(custom) / 100 : tipPct ?? 0;

  const { tipPer, totalPer, invalid } = useMemo(() => {
    if (!p) return { tipPer: 0, totalPer: 0, invalid: true };
    const tipTotal = b * pct;
    return { tipPer: tipTotal / p, totalPer: (b + tipTotal) / p, invalid: false };
  }, [b, p, pct]);

  const reset = () => {
    setBill('');
    setPeople('');
    setTipPct(null);
    setCustom('');
  };

  return (
    <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
      {/* LEFT: form */}
      <section className="rounded-2xl bg-white p-6 shadow">
        <Label htmlFor="bill">Bill</Label>
        <Input
          id="bill"
          placeholder="0"
          inputMode="decimal"
          value={bill}
          onChange={(e) => setBill(e.target.value.replace(/[^\d.]/g, ''))}
        />

        <fieldset className="mt-6">
          <legend className="mb-2 text-sm text-slate-500">Select Tip %</legend>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15, 25, 50].map((n) => (
              <TipButton
                key={n}
                active={tipPct === n / 100 && !custom}
                onClick={() => {
                  setTipPct(n / 100);
                  setCustom('');
                }}
              >
                {n}%
              </TipButton>
            ))}
            <Input
              placeholder="Custom"
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ''))}
            />
          </div>
        </fieldset>

        <div className="mt-6">
          <Label htmlFor="people">
            Number of People{' '}
            {!p && <span className="ml-2 text-xs text-rose-500">Can’t be zero</span>}
          </Label>
          <Input
            id="people"
            placeholder="1"
            inputMode="numeric"
            value={people}
            onChange={(e) => setPeople(e.target.value.replace(/[^\d.]/g, ''))}
            className={!p ? 'outline outline-2 outline-rose-500' : undefined}
            aria-invalid={!p}
            aria-describedby={!p ? 'people-error' : undefined}
          />
          {!p && (
            <p id="people-error" className="mt-1 text-xs text-rose-600">
              Please enter at least 1 person.
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={!(bill || people || tipPct || custom)}
          onClick={reset}
          className="mt-6 w-full rounded-lg bg-cyan-300 p-3 font-bold text-slate-900
                     disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-sky-400"
        >
          RESET
        </button>
      </section>

      {/* RIGHT: results */}
      <section className="rounded-2xl bg-slate-900 p-6 text-slate-100 shadow">
        {/* screen-reader friendly live updates */}
        <div className="sr-only" aria-live="polite">
          Tip per person {money(invalid ? 0 : tipPer)}. Total per person {money(invalid ? 0 : totalPer)}.
        </div>

        <Row label="Tip Amount" value={money(invalid ? 0 : tipPer)} />
        <Row label="Total" value={money(invalid ? 0 : totalPer)} />
      </section>
    </div>
  );
}

/* ---------- small UI helpers ---------- */

function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { className = '', ...rest } = props;
  return <label className={`mb-2 block text-sm text-slate-500 ${className}`} {...rest} />;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      className={`w-full rounded-lg border border-slate-300 p-3 text-slate-900 placeholder-slate-400
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${className}`}
      {...rest}
    />
  );
}

function TipButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg p-3 text-white bg-teal-800
                  hover:outline hover:outline-2 hover:outline-sky-300
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
                  ${active ? 'outline outline-2 outline-sky-400' : ''}`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-slate-400">/ person</div>
      </div>
      <div className="text-3xl font-extrabold">{value}</div>
    </div>
  );
}

