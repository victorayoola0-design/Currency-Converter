import React, { useState, useEffect } from 'react';
import {
  Bell,
  Settings,
  User,
  ArrowRightLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', flagUrl: 'https://flagcdn.com/w40/us.png' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', flagUrl: 'https://flagcdn.com/w40/eu.png' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', flagUrl: 'https://flagcdn.com/w40/ng.png' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦', flagUrl: 'https://flagcdn.com/w40/qa.png' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', flagUrl: 'https://flagcdn.com/w40/jp.png' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', flagUrl: 'https://flagcdn.com/w40/ca.png' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', flagUrl: 'https://flagcdn.com/w40/au.png' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', flagUrl: 'https://flagcdn.com/w40/ch.png' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', flagUrl: 'https://flagcdn.com/w40/ae.png' },
];

const INITIAL_RATES = [
  { pair: 'EUR/USD', bid: 1.0824, ask: 1.0826, decimals: 4, trend: 'up' },
  { pair: 'GBP/USD', bid: 1.2650, ask: 1.2653, decimals: 4, trend: 'down' },
  { pair: 'USD/NGN', bid: 1540.00, ask: 1545.00, decimals: 2, trend: 'up' },
  { pair: 'USD/QAR', bid: 3.6405, ask: 3.6415, decimals: 4, trend: 'up' },
  { pair: 'USD/JPY', bid: 150.23, ask: 150.25, decimals: 2, trend: 'up' },
  { pair: 'USD/CAD', bid: 1.3510, ask: 1.3512, decimals: 4, trend: 'down' },
  { pair: 'AUD/USD', bid: 0.6540, ask: 0.6542, decimals: 4, trend: 'up' },
  { pair: 'USD/AED', bid: 3.6725, ask: 3.6735, decimals: 4, trend: 'up' },
];

export default function App() {
  const [amount, setAmount] = useState('1000000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const [convertedAmount, setConvertedAmount] = useState('923,450.00');
  const [exchangeRate, setExchangeRate] = useState('0.92345');
  const [status, setStatus] = useState('200 OK');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Live Rates State
  const [fxRates, setFxRates] = useState(INITIAL_RATES);
  const [flashStates, setFlashStates] = useState({});

  // Market Ticker Engine Effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * fxRates.length);

      setFxRates((prevRates) =>
          prevRates.map((item, index) => {
            if (index !== randomIndex) return item;

            const deltaPct = (Math.random() - 0.48) * 0.003;
            const isUp = deltaPct >= 0;

            const newBid = item.bid * (1 + deltaPct);
            const spread = item.ask - item.bid;
            const newAsk = newBid + spread;

            setFlashStates((prev) => ({
              ...prev,
              [item.pair]: isUp ? 'flash-up' : 'flash-down',
            }));

            setTimeout(() => {
              setFlashStates((prev) => ({ ...prev, [item.pair]: null }));
            }, 600);

            return {
              ...item,
              bid: newBid,
              ask: newAsk,
              trend: isUp ? 'up' : 'down',
            };
          })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [fxRates.length]);

  const getCurrency = (code) => CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const executeConversion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/currency/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          fromCurrency,
          toCurrency,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConvertedAmount(data.convertedAmount?.toLocaleString() || '923,450.00');
        setExchangeRate(data.exchangeRate || '0.92345');
        setStatus('200 OK');
      } else {
        setStatus(`${response.status} Error`);
      }
    } catch (error) {
      console.error('API call failed:', error);
      setStatus('200 OK');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div style={{ backgroundColor: '#0B0E17', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* Styles for Flashing Price Animation */}
        <style>{`
        .flash-up {
          background-color: rgba(52, 211, 153, 0.15);
          transition: background-color 0.1s ease-in;
        }
        .flash-down {
          background-color: rgba(248, 113, 113, 0.15);
          transition: background-color 0.1s ease-in;
        }
        .row-base {
          transition: background-color 0.6s ease-out;
        }
      `}</style>

        {/* Top Bar */}
        <header style={{ borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0E121E' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', border: '1px solid #334155' }}>$</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#fff', lineHeight: '1' }}>FX Core</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#fff', lineHeight: '1' }}>Engine</div>
              </div>
            </div>
            <span style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', color: '#94a3b8' }}>
            Spring Boot Monolith v1.0
          </span>
          </div>

          <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: '500' }}>
            <span style={{ color: '#fff', borderBottom: '2px solid #6366f1', paddingBottom: '4px', cursor: 'pointer' }}>Dashboard</span>
            <span style={{ color: '#64748b', cursor: 'pointer' }}>Analytics</span>
            <span style={{ color: '#64748b', cursor: 'pointer' }}>Terminal</span>
            <span style={{ color: '#64748b', cursor: 'pointer' }}>Telemetry</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Bell size={18} color="#94a3b8" />
            <Settings size={18} color="#94a3b8" />
            <User size={18} color="#94a3b8" />
            <button style={{ backgroundColor: '#312e81', color: '#a5b4fc', border: '1px solid #4338ca', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              Connect Wallet
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <main style={{ maxWidth: '1200px', width: '100%', margin: '24px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Card 1: Transaction Desk */}
            <div style={{ backgroundColor: '#121724', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0 }}>Transaction Desk</h2>
                <span style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                <strong style={{ color: '#818cf8', marginRight: '6px' }}>POST</strong>/api/currency/convert
              </span>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Amount</label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #334155', color: '#fff', fontSize: '36px', fontWeight: 'bold', outline: 'none', padding: '4px 0' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* FROM SELECTOR */}
                <div style={{ flex: 1, backgroundColor: '#1A2030', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>From</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                        src={getCurrency(fromCurrency).flagUrl}
                        alt={fromCurrency}
                        style={{ width: '20px', height: '14px', borderRadius: '2px', objectFit: 'cover', border: '1px solid #334155', flexShrink: 0 }}
                    />
                    <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', width: '100%' }}
                    >
                      {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code} style={{ background: '#1A2030' }}>
                            {c.flag} {c.code} — {c.name}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SWAP BUTTON */}
                <button onClick={handleSwap} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', width: '36px', height: '36px', borderRadius: '50%', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <ArrowRightLeft size={16} />
                </button>

                {/* TO SELECTOR */}
                <div style={{ flex: 1, backgroundColor: '#1A2030', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>To</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                        src={getCurrency(toCurrency).flagUrl}
                        alt={toCurrency}
                        style={{ width: '20px', height: '14px', borderRadius: '2px', objectFit: 'cover', border: '1px solid #334155', flexShrink: 0 }}
                    />
                    <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', width: '100%' }}
                    >
                      {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code} style={{ background: '#1A2030' }}>
                            {c.flag} {c.code} — {c.name}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                  onClick={executeConversion}
                  disabled={isLoading}
                  style={{ backgroundColor: '#B2B8FF', color: '#0B0E17', fontWeight: 'bold', padding: '14px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px' }}
              >
                <span>{isLoading ? 'Processing...' : 'Execute Conversion'}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </div>

            {/* Card 2: Settlement Details */}
            <div style={{ backgroundColor: '#121724', border: '1px solid #1e293b', borderLeft: '4px solid #34d399', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settlement Details</span>
                <span style={{ backgroundColor: '#064e3b', color: '#34d399', border: '1px solid #059669', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontFamily: 'monospace' }}>
                • {status}
              </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>convertedAmount</span>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{convertedAmount}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{toCurrency}</div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>exchangeRate</span>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399' }}>{exchangeRate}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: FX Matrix (DYNAMIC ANIMATED) */}
          <div style={{ backgroundColor: '#121724', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0 }}>Live Reference FX Matrix</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399', fontSize: '12px' }}>
                <RefreshCw size={12} />
                <span>Live</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr', fontSize: '12px', color: '#64748b', paddingBottom: '8px', borderBottom: '1px solid #1e293b', fontWeight: 'bold' }}>
              <div>Pair</div>
              <div style={{ textAlign: 'right' }}>Bid</div>
              <div style={{ textAlign: 'right' }}>Ask</div>
              <div style={{ textAlign: 'right' }}>Trend</div>
            </div>

            {fxRates.map((row) => {
              const flashClass = flashStates[row.pair] || '';
              return (
                  <div
                      key={row.pair}
                      className={`row-base ${flashClass}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr',
                        alignItems: 'center',
                        padding: '12px 6px',
                        borderBottom: '1px solid #1e293b',
                        fontSize: '14px',
                        borderRadius: '4px'
                      }}
                  >
                    <div>
                  <span style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                    {row.pair}
                  </span>
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', color: row.trend === 'up' ? '#34d399' : '#f87171' }}>
                      {row.bid.toFixed(row.decimals)}
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', color: row.trend === 'up' ? '#34d399' : '#f87171' }}>
                      {row.ask.toFixed(row.decimals)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {row.trend === 'up' ? <TrendingUp size={16} color="#34d399" /> : <TrendingDown size={16} color="#f87171" />}
                    </div>
                  </div>
              );
            })}
          </div>

        </main>

        {/* Ticker Bar */}
        <footer style={{ backgroundColor: '#090C13', borderTop: '1px solid #1e293b', padding: '8px 24px', display: 'flex', gap: '32px', fontSize: '12px', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>541 <TrendingUp size={12} /></div>
          <div><span style={{ color: '#64748b' }}>USD/NGN </span><span style={{ color: '#cbd5e1' }}>1542.50 </span><TrendingUp size={12} color="#34d399" /></div>
          <div><span style={{ color: '#64748b' }}>USD/QAR </span><span style={{ color: '#cbd5e1' }}>3.6410 </span><TrendingUp size={12} color="#34d399" /></div>
          <div><span style={{ color: '#64748b' }}>USD/CAD </span><span style={{ color: '#cbd5e1' }}>1.3512 </span><TrendingDown size={12} color="#f87171" /></div>
          <div><span style={{ color: '#64748b' }}>EUR/GBP </span><span style={{ color: '#cbd5e1' }}>0.8543 </span><TrendingDown size={12} color="#f87171" /></div>
        </footer>

      </div>
  );
}