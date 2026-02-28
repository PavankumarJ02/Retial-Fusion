import React from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from 'lucide-react';

export default function WeatherWidget({ weather }) {
  if (!weather) {
    return null;
  }

  // Map weather conditions to icons
  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="w-12 h-12 text-slate-400" />;
    
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle')) {
      return <CloudRain className="w-12 h-12 text-blue-400" />;
    }
    if (lower.includes('snow')) {
      return <CloudSnow className="w-12 h-12 text-blue-200" />;
    }
    if (lower.includes('clear') || lower.includes('sunny')) {
      return <Sun className="w-12 h-12 text-yellow-400" />;
    }
    if (lower.includes('cloud')) {
      return <Cloud className="w-12 h-12 text-slate-400" />;
    }
    return <Cloud className="w-12 h-12 text-slate-400" />;
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <h3 className="text-lg font-bold text-slate-50 mb-4">Local Weather</h3>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-4xl font-bold text-slate-50">{weather.temp}°C</p>
          <p className="text-sm text-slate-400 mt-1">{weather.condition}</p>
        </div>
        <div className="opacity-70">
          {getWeatherIcon(weather.condition)}
        </div>
      </div>

      {/* Demand Signal */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-700 rounded-lg p-4">
        <p className="text-xs text-blue-300 font-semibold mb-2">DEMAND SIGNAL</p>
        <p className="text-sm text-slate-50">
          {weather.temp > 28 
            ? '🔥 High temp may increase demand for cooling products'
            : weather.temp < 10
            ? '❄️ Cold weather may affect foot traffic'
            : '🌤️ Moderate conditions - normal demand expected'
          }
        </p>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-slate-500 mt-4">
        Updated: {weather.timestamp ? new Date(weather.timestamp).toLocaleTimeString() : 'Just now'}
      </p>
    </div>
  );
}