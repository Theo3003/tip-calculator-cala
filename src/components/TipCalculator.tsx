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
  const pct = custom ? Number(custom) / 100 : (tipPct ?? 0);

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
      <section className="rounded-2xl bg-white p-6 shadow">
        <label className="mb-2 block text-sm text-slate-500">Bill</label>
        <input
          className="w-full rounded-lg border border-slate-300 p-3"
          placeholder="0"
          inputMode="decimal"
          value={bill}
          onChange={(e) => setBill(e.target.value.replace(/[^\d.]/g, ''))}
        />

        <fieldset className="mt-6">
          <legend className="mb-2 text-sm text-slate-500">Select Tip %</legend>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15, 25, 50].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => { setTipPct(n / 100); setCustom(''); }}
                className={`rounded-lg p-3 text-white bg-teal-800 hover:outline hover:outline-2 hover:outline-sky-300 ${
                  tipPct === n / 100 && !custom ? 'outline outline-2 outline-sky-400' : ''
                }`}
              >
                {n}%
              </button>
            ))}
            <input
              className="rounded-lg border border-slate-300 p-3"
              placeholder="Custom"
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ''))}
            />
          </div>
        </fieldset>

        <div className="mt-6">
          <label className="mb-2 block text-sm text-slate-500">
            Number of People
            {!p && <span className="ml-2 text-xs text-rose-500">Can’t be zero</span>}
          </label>
          <input
            className={`w-full rounded-lg border border-slate-300 p-3 ${!p ? 'outline outline-2 outline-rose-500' : ''}`}
            placeholder="1"
            inputMode="numeric"
            value={people}
            onChange={(e) => setPeople(e.target.value.replace(/[^\d.]/g, ''))}
          />
        </div>

        <button
          type="button"
          disabled={!(bill || people || tipPct || custom)}
          onClick={reset}
          className="mt-6 w-full rounded-lg bg-cyan-300 p-3 font-bold text-slate-900 disabled:opacity-50"
        >
          RESET
        </button>
      </section>

      <section className="rounded-2xl bg-slate-900 p-6 text-slate-100 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">Tip Amount</div>
            <div className="text-xs text-slate-400">/ person</div>
          </div>
          <div className="text-3xl font-extrabold">{money(invalid ? 0 : tipPer)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Total</div>
            <div className="text-xs text-slate-400">/ person</div>
          </div>
          <div className="text-3xl font-extrabold">{money(invalid ? 0 : totalPer)}</div>
        </div>
      </section>
    </div>
  );
}
