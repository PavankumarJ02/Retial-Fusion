import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function DashboardHeader({ data }) {
  if (!data) return null;

  const lastUpdate = new Date(data.timestamp);
  const timeStr = lastUpdate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-text">Retail Fusion Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time inventory management & ML-powered forecasting</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Last updated: {timeStr}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm mt-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Backend Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}