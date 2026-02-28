import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import StatCards from './components/StatCards';
import TransactionFeed from './components/TransactionFeed';
import DemandForecastChart from './components/DemandForecastChart';
import ReorderPanel from './components/ReorderPanel';
import WeatherWidget from './components/WeatherWidget';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = () => {
      fetch("https://retail-fusion-backend.onrender.com/api/dashboard")
        .then(res => res.json())
        .then(data => setDashboardData(data))
        .catch(err => console.error("Fetch error:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Header */}
        <DashboardHeader data={dashboardData} />

        <div className="p-6 space-y-6">

          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 'overview' && (
            <>
              <StatCards metrics={dashboardData.metrics} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TransactionFeed
                    transactions={dashboardData.recent_transactions}
                    anomalies={dashboardData.recent_anomalies}
                  />
                </div>

                <div>
                  <WeatherWidget weather={dashboardData.weather} />
                </div>
              </div>

              <DemandForecastChart forecasts={dashboardData.forecasts} />
            </>
          )}

          {/* ===== REORDER TAB ===== */}
          {activeTab === 'reorder' && (
            <ReorderPanel suggestions={dashboardData.reorder_suggestions} />
          )}

          {/* ===== INVENTORY TAB ===== */}
          {activeTab === 'inventory' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-xl font-bold mb-4">Current Inventory</h2>

              <div className="space-y-3">
                {dashboardData.inventory.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.sku}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-cyan-400">
                        {item.stock} units
                      </p>
                      <p className="text-xs text-slate-400">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== ANALYTICS TAB ===== */}
          {activeTab === 'analytics' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-xl font-bold mb-4">Analytics</h2>
              <p className="text-slate-400">
                Advanced analytics coming soon...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;