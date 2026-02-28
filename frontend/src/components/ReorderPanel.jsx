import React, { useState } from 'react';
import { Package, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';

export default function ReorderPanel({ suggestions = [] }) {
  const [loadingSku, setLoadingSku] = useState(null);
  const [successSku, setSuccessSku] = useState(null);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const handlePlaceOrder = async (sku, qty) => {
    try {
      setLoadingSku(sku);

      const res = await fetch("http://127.0.0.1:5000/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sku, quantity: qty })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessSku(sku);
        setTimeout(() => setSuccessSku(null), 3000);
      } else {
        alert("❌ Failed to place order");
      }

    } catch (err) {
      alert("❌ Backend error");
    } finally {
      setLoadingSku(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'from-red-600 to-red-700 text-red-100';
      case 'low': return 'from-orange-600 to-orange-700 text-orange-100';
      case 'healthy': return 'from-emerald-600 to-emerald-700 text-emerald-100';
      default: return 'from-slate-600 to-slate-700 text-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'low': return <TrendingDown className="w-5 h-5 text-orange-400" />;
      case 'healthy': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default: return <Package className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-bold uppercase';
    switch (status) {
      case 'critical': return `${base} bg-red-950 text-red-300`;
      case 'low': return `${base} bg-orange-950 text-orange-300`;
      case 'healthy': return `${base} bg-emerald-950 text-emerald-300`;
      default: return `${base} bg-slate-800 text-slate-300`;
    }
  };

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const order = { critical: 0, low: 1, healthy: 2 };
    return (order[a.status] || 3) - (order[b.status] || 3);
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold bg-gradient-text">Smart Reorder Recommendations</h1>
        <p className="text-slate-400 text-sm mt-1">
          AI-driven insights based on forecast, stock, and demand patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSuggestions.map((suggestion) => {
          const gradient = getStatusColor(suggestion.status);
          const isLoading = loadingSku === suggestion.sku;
          const isSuccess = successSku === suggestion.sku;

          return (
            <div key={suggestion.sku} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

              <div className={`bg-gradient-to-r ${gradient} p-4 flex justify-between`}>
                <div>
                  <h3 className="font-bold text-lg">{suggestion.name}</h3>
                  <p className="text-sm opacity-90">{suggestion.sku}</p>
                </div>
                {getStatusIcon(suggestion.status)}
              </div>

              <div className="p-6 space-y-4">

                <span className={getStatusBadge(suggestion.status)}>
                  {suggestion.status}
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-xs text-slate-400">Current Stock</p>
                    <p className="text-xl font-bold text-cyan-400">{suggestion.current_stock}</p>
                  </div>

                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-xs text-slate-400">Days Supply</p>
                    <p className="text-xl font-bold">{suggestion.days_of_stock}</p>
                  </div>
                </div>

                <div className="bg-slate-800 p-3 rounded">
                  <p className="text-xs text-slate-400">7-Day Forecast</p>
                  <p className="font-bold">{suggestion.forecasted_7day_demand} units</p>
                </div>

                {suggestion.suggested_quantity > 0 && (
                  <div className="bg-amber-950 border border-amber-700 p-3 rounded">
                    <p className="text-xs text-amber-300">REORDER</p>
                    <p className="text-2xl font-bold text-amber-100">{suggestion.suggested_quantity}</p>
                  </div>
                )}

                {/* BUTTON */}
                <button
  disabled={isLoading || suggestion.suggested_quantity === 0}
  onClick={() =>
    handlePlaceOrder(suggestion.sku, suggestion.suggested_quantity)
  }
  className={`w-full py-2 rounded font-bold transition
    ${
      suggestion.suggested_quantity === 0
        ? "bg-slate-700 cursor-not-allowed text-slate-400"
        : isSuccess
        ? "bg-emerald-600"
        : "bg-cyan-600 hover:bg-cyan-700"
    }
    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
  `}
>
  {suggestion.suggested_quantity === 0
    ? "Stock Healthy"
    : isLoading
    ? "Placing Order..."
    : isSuccess
    ? "✅ Ordered"
    : "Place Order"}
</button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}