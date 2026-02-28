import React, { useState, useEffect } from 'react';
import { AlertCircle, ShoppingCart } from 'lucide-react';

// ✅ INR formatter
const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

export default function TransactionFeed({ transactions = [], anomalies = [] }) {
  const [displayTransactions, setDisplayTransactions] = useState([]);

  useEffect(() => {
    const combined = [...transactions].reverse().slice(0, 10);
    setDisplayTransactions(combined);
  }, [transactions]);

  if (!displayTransactions || displayTransactions.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-slate-50">Live Transaction Feed</h2>
        </div>
        <p className="text-slate-500">Waiting for transactions...</p>
      </div>
    );
  }

  const isAnomaly = (txn) => anomalies.some(a => a.id === txn.id);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-slate-50">Live Transaction Feed</h2>
        </div>
        <div className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400">
          {displayTransactions.length} recent
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayTransactions.map((txn, index) => {
          const isAnom = isAnomaly(txn);
          return (
            <div
              key={txn.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isAnom
                  ? 'bg-red-950 border-red-700 animate-shake'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-50">{txn.product_name}</h3>
                    {isAnom && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-red-900 rounded-full">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span className="text-xs font-bold text-red-300">ANOMALY</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{txn.sku}</span>
                    <span>•</span>
                    <span>{new Date(txn.timestamp).toLocaleTimeString()}</span>
                    {isAnom && (
                      <>
                        <span>•</span>
                        <span className="text-red-400">Z-score: {txn.z_score}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-50">{txn.quantity} units</div>

                  {/* ✅ INR */}
                  <div className="text-xs text-slate-400">
                    {formatINR(txn.total_amount)}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {anomalies.length > 0 && (
        <div className="mt-4 p-3 bg-orange-950 border border-orange-700 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <p className="text-xs text-orange-200">
              <span className="font-bold">{anomalies.length} anomalies detected</span> — Bulk purchases or unusual patterns flagged
            </p>
          </div>
        </div>
      )}
    </div>
  );
}