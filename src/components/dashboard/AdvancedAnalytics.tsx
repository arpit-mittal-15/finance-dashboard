import React from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Bar
} from "recharts";
import { TrendingUp, LineChart as LineChartIcon, Activity } from "lucide-react";
import { getCategoryColor } from "../../data/categories";

export default function AdvancedAnalytics() {
  const getCategoryTrends = useFinanceStore((s) => s.getCategoryTrends);
  const getForecast = useFinanceStore((s) => s.getForecast);
  const getAllCategories = useFinanceStore((s) => s.getAllCategories);
  
  const trendsData = getCategoryTrends();
  const forecastData = getForecast();
  const categories = getAllCategories();

  return (
    <div className="space-y-6">
      {/* Trends Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Spending Trends by Category
          </h3>
        </div>
        
        <div className="h-[300px] w-full">
          {trendsData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">
              Not enough data for trends
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  {categories.map((cat) => (
                    <linearGradient key={cat} id={`color-${cat.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getCategoryColor(cat)} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={getCategoryColor(cat)} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#64748b" }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#64748b" }} 
                  tickFormatter={(val) => `₹${val}`}
                  width={55}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  labelStyle={{ fontWeight: "bold", color: "#334155", marginBottom: "4px" }}
                  itemStyle={{ fontSize: "13px" }}
                />
                {categories.map((cat) => (
                  <Area 
                    key={cat}
                    type="monotone" 
                    dataKey={cat} 
                    stackId="1"
                    stroke={getCategoryColor(cat)} 
                    fill={`url(#color-${cat.replace(/\s+/g, '')})`} 
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Expense Forecast
          </h3>
        </div>
        
        <div className="h-[300px] w-full">
           {forecastData.length < 3 ? (
             <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">
               Need at least 3 months of data to generate a forecast.
             </div>
           ) : (
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
                 <XAxis 
                   dataKey="month" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 12, fill: "#64748b" }} 
                   dy={10} 
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 12, fill: "#64748b" }} 
                   tickFormatter={(val) => `₹${val}`}
                   width={55}
                 />
                 <Tooltip 
                   cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                   contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", color: "#1e293b" }}
                 />
                 <Bar dataKey="actual" name="Actual Spending" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
                 <Line 
                   type="monotone" 
                   dataKey="forecast" 
                   name="Projected" 
                   stroke="#10b981" 
                   strokeWidth={3} 
                   strokeDasharray="5 5" 
                   dot={{ r: 4, strokeWidth: 2 }} 
                   activeDot={{ r: 6 }} 
                 />
               </ComposedChart>
             </ResponsiveContainer>
           )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
          * Forecast is calculated using a 3-month moving average of past expenses.
        </p>
      </div>
    </div>
  );
}
