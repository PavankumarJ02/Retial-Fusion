import React from 'react';
import { BarChart3, Package, TrendingUp, Settings, Zap } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'reorder', label: 'Reorder', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-cyan flex items-center justify-center">
            <Zap className="w-5 h-5 text-slate-950" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-text">Retail Fusion</h1>
        </div>
        <p className="text-xs text-slate-500">Inventory Intelligence Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-600 text-slate-50 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-2">
        <p>🟢 Backend: Connected</p>
        <p>🔄 Auto-refresh: 3s</p>
        <p className="pt-2">v1.0 - MVP Demo</p>
      </div>
    </div>
  );
}