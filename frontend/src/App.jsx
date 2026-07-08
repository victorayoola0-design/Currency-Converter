import { useState } from 'react';

export default function App() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = [
    { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
    { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
    { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' },
    { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar' },
    { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar' },
    { code: 'NGN', flag: '🇳🇬', name: 'Nigerian Naira'},
    { code: 'QAR', flag: '🇶🇦', name: 'Qatar Riyal'}
  ];

  const handleConvert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8080/api/currency/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, amount: parseFloat(amount) })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error processing conversion.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-950 to-slate-900 flex items-center justify-center font-sans px-4">
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800 relative overflow-hidden">

          {/* Visual Glow Accent */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>

          <header className="text-center mb-8">
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Currency Converter
            </h1>
            <p className="text-xs text-slate-500 mt-1">Powered by Spring Boot + React</p>
          </header>

          <form onSubmit={handleConvert} className="space-y-5">
            {/* Amount Box */}
            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl focus-within:border-blue-500 transition">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Amount</label>
              <input
                  type="number"
                  step="any"
                  className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-xl">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From</label>
                <select
                    className="w-full bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                >
                  {currencies.map(c => <option key={c.code} value={c.code} className="bg-slate-800">{c.flag} {c.code}</option>)}
                </select>
              </div>

              <div className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-xl">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To</label>
                <select
                    className="w-full bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                >
                  {currencies.map(c => <option key={c.code} value={c.code} className="bg-slate-800">{c.flag} {c.code}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/10">
              {loading ? 'Fetching live rates...' : 'Convert Currency'}
            </button>
          </form>

          {/* Dynamic Result Banner */}
          {result && (
              <div className="mt-6 p-5 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 text-white rounded-2xl border border-blue-500/20 text-center animate-fade-in">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Converted Value</p>
                <p className="text-3xl font-black">{result.convertedAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {result.to}</p>
                <p className="text-xs text-slate-400 mt-2 bg-slate-950/40 inline-block px-3 py-1 rounded-full">1 {result.from} = {result.exchangeRate} {result.to}</p>
              </div>
          )}

          {error && (
              <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl text-xs text-center font-medium">
                ⚠️ {error}
              </div>
          )}
        </div>
      </div>
  );
}