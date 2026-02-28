import React from 'react';
import { TrendingUp, AlertTriangle, DollarSign, Zap } from 'lucide-react';
import { formatINR } from '../utils/currency';

export default function StatCards({ metrics }) {
  if (!metrics) return null;

  const statCards = [
    {
      title: 'Total Transactions',
      value: metrics.total_transactions ?? 0,
      change: '+12%',
      icon: TrendingUp,
      color: 'cyan',
    },
    {
      title: 'Anomalies Detected',
      value: metrics.anomalies_detected ?? 0,
      subtitle: 'Bulk orders',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      title: 'Total Revenue',
      value: formatINR(metrics.total_revenue ?? 0),
      change: '+8.2%',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Avg Transaction',
      value: formatINR(metrics.avg_transaction_value ?? 0),
      subtitle: 'Per order',
      icon: Zap,
      color: 'purple',
    },
  ];

  const colorMap = {
    cyan: 'from-cyan-600 to-cyan-700 text-cyan-100',
    red: 'from-red-600 to-red-700 text-red-100',
    green: 'from-emerald-600 to-emerald-700 text-emerald-100',
    purple: 'from-purple-600 to-purple-700 text-purple-100',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const gradient = colorMap[card.color];

        return (
          <div
            key={index}
            className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{card.title}</p>

                <p className="text-2xl font-bold text-slate-50 mt-2">
                  {card.value}
                </p>

                {card.change && (
                  <p className="text-xs text-emerald-400 mt-2">
                    {card.change} vs last period
                  </p>
                )}

                {card.subtitle && (
                  <p className="text-xs text-slate-500 mt-2">
                    {card.subtitle}
                  </p>
                )}
              </div>

              <div className={`bg-gradient-to-br ${gradient} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}