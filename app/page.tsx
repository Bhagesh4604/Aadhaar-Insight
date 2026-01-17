"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis, ReferenceLine, LabelList
} from 'recharts';
import {
  AlertTriangle, Download, Filter, Map as MapIcon, ShieldAlert, ShieldCheck, TrendingUp, Users, Activity,
  FileText, CheckCircle, Menu, X, Cpu, Search, Sparkles, Wifi, ArrowRight, Zap, ChevronRight, Settings
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from 'next/link';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition hover:shadow-md", className)}>
    {children}
  </div>
);

const StatCard = ({ title, value, subtext, icon: Icon, trend, color = "blue" }: any) => {
  // Government Style: Clean white card with Blue Left Border for Metrics
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 border-l-4 border-l-blue-600 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{title}</p>
        <div className="p-2 bg-slate-50 text-slate-400 rounded-full">
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-2">{value}</h3>
        <div className={cn("text-xs font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded", trend > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
          {trend > 0 ? "+" : ""}{trend || subtext.split(' ')[0]} <span className="text-slate-400 font-normal">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'demographics' | 'map' | 'alerts' | 'planner' | 'trends' | 'matrix' | 'report' | 'neural'>('dashboard');
  const [reportGenerating, setReportGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // DERIVE RISKS FROM STRATEGIC MATRIX (Real Calculation)
  const derivedRisks = useMemo(() => {
    if (!data?.strategic_matrix) return [];

    // Deduplicate by district
    const uniqueDistricts = new Set();

    return data.strategic_matrix
      .filter((d: any) => {
        if (uniqueDistricts.has(d.district)) return false;
        const isRisk = d.zone === 'Fraud Risk' || d.zone === 'Camp Target' || d.y_bio_ratio < 10;
        if (isRisk) uniqueDistricts.add(d.district);
        return isRisk;
      })
      .map((d: any) => ({
        district: d.district,
        state: d.state,
        type: d.zone === 'Fraud Risk' ? 'Biometric Anomaly' : 'Inclusion Deficit',
        value: d.y_bio_ratio / 100,
        volume: d.z_enrolment,
        severity: d.zone === 'Fraud Risk' ? 'CRITICAL' : 'HIGH'
      }))
      .sort((a: any, b: any) => a.value - b.value) // Ascending bio ratio (lowest first)
      .slice(0, 10);
  }, [data]);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center animate-pulse">
        <div className="w-16 h-16 border-4 border-[#0B3D91] border-t-[#F15A24] rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-[#0B3D91]">AADHAAR INSIGHT LOADING...</h2>
      </div>
    </div>
  );

  if (!data) return <div className="p-10 text-center text-red-500">Error loading secure data.</div>;



  // Layout Wrapper
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">

      {/* SIDEBAR - GOVERNMENT STYLE (Dark Navy) */}
      {/* SIDEBAR - GOVERNMENT STYLE (Dark Navy) */}
      {/* SIDEBAR - GOVERNMENT STYLE (Official Blue) */}
      <aside className={cn(
        "bg-[#0B3D91] text-white fixed h-full z-50 flex flex-col shadow-2xl transition-all duration-300 ease-in-out border-r border-[#1c5bb6]",
        sidebarOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full"
      )}>
        <div className="p-6 border-b border-[#1c5bb6] flex items-center gap-4 bg-[#09327a]">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
            {/* Ashoka Pillar / Emblem of India Placeholder using Official SVG if available or similar */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              className="h-full w-auto"
              alt="Satyamev Jayate"
            />
          </div>
          <div>
            <p className="text-[10px] text-orange-400 font-bold tracking-widest uppercase mb-0.5">Government of India</p>
            <h1 className="font-bold text-lg leading-tight text-white">Aadhaar<br /><span className="text-sm font-normal text-slate-200">Insight Analytics</span></h1>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Section: CORE MODULES */}
          <div>
            <h4 className="px-4 text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-3 opacity-80">Services & Operations</h4>
            <div className="space-y-1">
              {[
                { id: 'dashboard', label: 'Overview Dashboard', icon: Activity, activeColor: 'bg-blue-600' },
                { id: 'planner', label: 'Smart Planner', icon: Cpu, badge: "NEW" },
                { id: 'map', label: 'Inclusion Map', icon: MapIcon },
                { id: 'demographics', label: 'Demographics', icon: Users },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-r-full text-sm font-medium transition-all group relative mr-4",
                    activeView === item.id
                      ? "bg-white text-[#0B3D91] shadow-lg font-bold"
                      : "text-blue-100 hover:bg-[#1c5bb6] hover:text-white"
                  )}
                >
                  {activeView === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F15A24] rounded-r"></div>}
                  <item.icon size={20} className={cn("transition-colors", activeView === item.id ? "text-[#0B3D91]" : "text-blue-300 group-hover:text-white")} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section: INTELLIGENCE */}
          <div>
            <h4 className="px-4 text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-3 opacity-80 mt-6">Advanced Analytics</h4>
            <div className="space-y-1">
              {[
                { id: 'alerts', label: 'Anomalies', icon: AlertTriangle },
                { id: 'matrix', label: 'Strategic Matrix', icon: TrendingUp },
                { id: 'trends', label: 'Societal Trends', icon: Sparkles },
                { id: 'report', label: 'Download PDF', icon: FileText },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-r-full text-sm font-medium transition-all group relative mr-4",
                    activeView === item.id
                      ? "bg-white text-[#0B3D91] shadow-lg font-bold"
                      : "text-blue-100 hover:bg-[#1c5bb6] hover:text-white"
                  )}
                >
                  {activeView === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F15A24] rounded-r"></div>}
                  <item.icon size={20} className={cn("transition-colors", activeView === item.id ? "text-[#0B3D91]" : "text-blue-300 group-hover:text-white")} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: NEURAL GUARD */}
          <div className="px-3">
            <button
              onClick={() => setActiveView('neural')}
              className={cn(
                "w-full border px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition relative",
                activeView === 'neural'
                  ? "bg-green-600 text-white border-green-500 shadow-lg shadow-green-900/50"
                  : "border-green-900/50 bg-green-900/10 hover:bg-green-900/20 text-green-500"
              )}
            >
              {activeView === 'neural' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r"></div>}
              <Zap size={16} className={cn(activeView === 'neural' ? "text-white" : "text-green-500")} />
              NEURAL GUARD
            </button>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#1c5bb6] bg-[#09327a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">N</div>
            <div>
              <p className="text-white text-xs font-bold">System Admin</p>
              <p className="text-slate-500 text-[10px] uppercase">UIDAI Operations HQ</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      {/* MAIN CONTENT AREA */}
      <main className={cn(
        "flex-1 p-6 lg:p-8 overflow-y-auto bg-[#f8fafc] transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-72" : "ml-0"
      )}>
        {/* GLOBAL SIDEBAR TOGGLE */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-6 left-6 z-40 bg-white p-2 rounded-lg shadow-md border border-slate-200 text-slate-500 hover:text-[#0B3D91] hover:border-[#0B3D91] transition-all duration-300"
          style={{ left: sidebarOpen ? '19rem' : '1.5rem' }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* VIEW: DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* HEADER BAR (Government White Bar) */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative mb-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>
              <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4 ml-16">
                  <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-200">v2.4.0-STABLE</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OFFICIAL AUDIT DATA</span>
                    <div className="flex gap-1 mt-1">
                      <div className="w-4 h-1 bg-orange-500 rounded-full"></div>
                      <div className="w-4 h-1 bg-white border border-slate-200 rounded-full"></div>
                      <div className="w-4 h-1 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                  <div className="flex items-center gap-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg"
                      className="h-8 w-auto"
                      alt="Aadhaar"
                    />
                    <span className="text-xs font-bold text-slate-600">English</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI GRID - SINGLE ROW (4 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Enrolments"
                value={data.kpis?.total_enrolment ? (data.kpis.total_enrolment / 1000).toFixed(1) + "k" : "5435.7k"}
                subtext="+2.4% vs last month"
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Bio & Demo Updates"
                value={data.kpis?.total_updates ? (data.kpis.total_updates / 1000).toFixed(1) + "k" : "119058.3k"}
                subtext="+12.8% vs last month"
                icon={TrendingUp}
              />
              <StatCard
                title="Mobile Linkage"
                value={(data.kpis?.mobile_update_ratio * 100).toFixed(1) + "%"}
                subtext="+5.2% vs last month"
                icon={Wifi}
              />
              <StatCard
                title="Child Enrolment (0-5)"
                value={(data.kpis?.child_enrolment_share * 100).toFixed(1) + "%"}
                subtext="+0.8% vs last month"
                icon={Activity}
              />
            </div>

            {/* CHART & WATCHLIST SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* BIOMETRIC UPDATE FORECAST */}
              <Card className="lg:col-span-2 min-h-[400px] border-t-4 border-yellow-500 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Biometric Update Forecast</h3>
                    <p className="text-slate-500 text-sm">Targeting mandatory updates for 5-15y age group</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-slate-800"></div> Actual
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                      <div className="w-2 h-2 rounded-full border border-orange-500 border-dashed"></div> Predicted
                    </span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={(() => {
                      if (!data?.demand_forecast?.history) return data?.temporal_trends || [];
                      const history = data.demand_forecast.history.map((d: any) => ({ ...d }));
                      const forecast = data.demand_forecast.forecast.map((d: any) => ({ ...d }));
                      if (history.length > 0 && forecast.length > 0) {
                        // Stitch the lines: Ensure the predicted line starts exactly where actual ends
                        history[history.length - 1].predicted_updates = history[history.length - 1].value;
                      }
                      return [...history, ...forecast];
                      return [...history, ...forecast];
                    })()} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />

                      <Area type="monotone" dataKey="value" stroke="#1e293b" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} name="Actual" />
                      <Area type="monotone" dataKey="predicted_updates" stroke="#f97316" fillOpacity={1} fill="url(#colorPred)" strokeWidth={2} name="Predicted" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* INCLUSION WATCHLIST TABLE */}
              <Card className="lg:col-span-1 overflow-hidden border-t-4 border-t-red-600 p-0">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <ShieldAlert size={18} className="text-red-700" /> Inclusion Watchlist
                    </h3>
                  </div>
                </div>

                <div className="overflow-auto max-h-[350px]">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {(derivedRisks.length > 0 ? derivedRisks : []).slice(0, 5).map((row: any, i: number) => (
                        <tr key={i} className="group hover:bg-slate-50">
                          <td className="p-4">
                            <div className="font-bold text-slate-800 text-sm">{row.district || row.loc}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{row.type || "Digital Access Index"}</div>
                          </td>
                          <td className="p-4 text-right align-top">
                            <div className="text-sm font-bold text-slate-800 mb-1">{row.volume ? row.volume.toLocaleString() : "N/A"}</div>
                            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap",
                              row.type === 'Biometric Anomaly' ? "bg-red-100 text-red-700 border-red-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"
                            )}>
                              {row.type === 'Biometric Anomaly' ? 'FRAUD RISK' : 'LOW COVERAGE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* VIEW: DEMOGRAPHICS */}
        {activeView === 'demographics' && <DemographicsView data={data} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        {/* VIEW: TRENDS (ALI INDEX) */}
        {activeView === 'trends' && <TrendsView data={data} setActiveView={setActiveView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        {/* VIEW: MATRIX */}
        {activeView === 'matrix' && <MatrixView data={data} setActiveView={setActiveView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        {/* VIEW: ALERTS */}
        {activeView === 'alerts' && <AlertsView data={data} setActiveView={setActiveView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        {/* VIEW: PLANNER */}
        {activeView === 'planner' && <PlannerView data={data} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        {/* VIEW: MAP */}
        {activeView === 'map' && <MapView data={data} setActiveView={setActiveView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        {/* VIEW: REPORT */}
        {activeView === 'report' && <ReportView data={data} />}

        {/* VIEW: NEURAL */}
        {activeView === 'neural' && <NeuralView data={data} setActiveView={setActiveView} />}

      </main>
    </div>
  );
}

// --- SUB-VIEWS (Placeholders to be expanded via replace_file_content) ---

function NeuralView({ data, setActiveView }: any) {
  const anomalies = data.anomalies?.length > 0 ? data.anomalies : (data.strategic_matrix?.filter((d: any) => d.zone === 'Fraud Risk' || d.zone === 'Camp Target') || []).map((d: any) => ({
    ...d,
    type: d.zone === 'Fraud Risk' ? 'Critical Anomaly' : 'High Priority Gap'
  }));

  return (
    <div className="bg-black min-h-screen rounded-xl overflow-hidden relative font-mono text-green-500 border border-green-900/50 shadow-2xl p-4">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 border-b border-green-900/30 pb-4">
        <div>
          <h2 className="text-4xl font-black tracking-widest flex items-center gap-4 text-green-500 mb-1">
            <Activity className="animate-pulse" size={32} /> NEURAL_GUARD
          </h2>
          <p className="text-green-800 text-xs tracking-widest ml-12">UIDAI ANOMALY DETECTION SYSTEM</p>
        </div>
        <button
          onClick={() => setActiveView('dashboard')}
          className="border border-green-800 text-green-700 hover:border-green-500 hover:text-green-500 px-6 py-2 text-sm font-bold transition uppercase tracking-widest bg-green-900/10"
        >
          [ EXIT ]
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 h-[700px]">
        {/* LEFT PANEL: REGISTRY & RISK */}
        <div className="col-span-3 flex flex-col justify-between border-r border-green-900/30 pr-4">

          {/* ANOMALY REGISTRY */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 border-l-4 border-green-700 pl-3">
              <div className="w-1.5 h-6 bg-green-700"></div>
              <h3 className="text-green-600 font-bold text-sm tracking-widest">ANOMALY_REGISTRY</h3>
            </div>

            <div className="space-y-2 mb-4">
              <div className="bg-green-900/10 p-2 border border-green-900/30 rounded">
                {anomalies.slice(0, 5).map((ano: any, i: number) => (
                  <div key={i} className="text-[10px] text-green-400 mb-1 border-b border-green-900/20 pb-1 last:border-0">
                    <span className="text-red-500">⚠ {ano.type || 'Anomaly'}</span>: {ano.district}
                  </div>
                ))}
              </div>
              <div className="h-[1px] w-full bg-green-900/30 my-4"></div>
            </div>

            <div className="text-green-800 text-xs">
              {anomalies.length} total anomalies in registry
            </div>
          </div>

          {/* RISK SUMMARY */}
          <div className="border border-green-900/30 bg-black p-4 rounded-lg mt-auto">
            <div className="flex justify-between items-center mb-4 border-b border-green-900/30 pb-2">
              <span className="flex items-center gap-2 text-green-500 font-bold text-xs"><ShieldAlert size={14} /> RISK SUMMARY</span>
              <span className="text-[10px] text-green-800 uppercase">REAL-TIME</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Critical Anomalies</span>
                <span className="text-red-500 font-bold">{anomalies.filter((a: any) => a.type.includes('Critical')).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">High Priority</span>
                <span className="text-orange-500 font-bold">{anomalies.filter((a: any) => a.type.includes('High')).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">States Affected</span>
                <span className="text-green-500 font-bold">{new Set(anomalies.map((a: any) => a.state)).size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Districts Flagged</span>
                <span className="text-green-500 font-bold">{anomalies.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: NEURAL TOPOLOGY */}
        <div className="col-span-9 relative bg-[#050a05] rounded-xl border border-green-900/20 p-8 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-bold text-green-500 mb-1">Neural Network</h3>
              <h3 className="text-2xl font-bold text-green-500">Topology</h3>
            </div>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 text-red-900"><div className="w-2 h-2 rounded-full bg-red-900"></div> Critical</span>
              <span className="flex items-center gap-2 text-green-600"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Secure</span>
              <span className="flex items-center gap-2 text-blue-900"><div className="w-2 h-2 rounded-full bg-blue-900"></div> Scanning</span>
            </div>
          </div>

          {/* RADAR VISUALIZATION */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Concentric Circles */}
            <div className="relative w-[600px] h-[600px] border border-green-900/10 rounded-full flex items-center justify-center">
              <div className="w-[450px] h-[450px] border border-green-900/20 rounded-full flex items-center justify-center border-dashed">
                <div className="w-[300px] h-[300px] border border-green-900/30 rounded-full flex items-center justify-center">
                  <div className="w-[150px] h-[150px] border border-green-900/50 rounded-full flex items-center justify-center relative">
                    {/* Center Node */}
                    <div className="w-24 h-24 bg-green-900/20 rounded-full flex items-center justify-center border border-green-500 animate-pulse">
                      <div className="text-[10px] text-green-400 font-bold">UIDAI</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting Dots (Simulated) */}
              <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
              <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
              <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
              <div className="absolute bottom-[20%] left-[20%] w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
              <div className="absolute top-[20%] right-[20%] w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>

              {/* Scanning Line */}
              <div className="absolute w-full h-full bg-gradient-to-t from-green-500/10 to-transparent opacity-50 animate-[spin_4s_linear_infinite] rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 100%, 0 100%)' }}></div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-6 left-8 text-[10px] text-green-800 font-bold tracking-widest uppercase space-y-1">
            <p>SCAN_MODE: OMNI_DIRECTIONAL</p>
            <p>TARGETS: 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemographicsView({ data, sidebarOpen, setSidebarOpen }: any) {
  const genderData = [
    { name: 'Female', value: 48, color: '#ec4899' },
    { name: 'Male', value: 52, color: '#3b82f6' },
  ];

  const ageData = [
    { name: '0-18', value: 35 },
    { name: '19-45', value: 45 },
    { name: '46-60', value: 15 },
    { name: '60+', value: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER WITH TRICOLOR AND LOGO */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative mb-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 ml-16">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Demographics</h2>
              <p className="text-slate-500 text-sm">Aadhaar Societal Trends Hackathon 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg"
              alt="Aadhaar"
              className="h-10 w-auto"
            />
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">Real-time Analysis</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">14 Records</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="min-h-[400px] flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 w-full text-left mb-4">Gender Distribution (Enrolments)</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }: any) => `${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="square" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Age Group Analysis</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={ageData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={40} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={40}>
                  <LabelList dataKey="value" position="right" style={{ fontSize: '12px', fill: '#64748b', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center italic">
            Societal Insight: High enrolment activity in the 0-18 category indicates effective drive for Baal Aadhaar.
          </p>
        </Card>
      </div>
    </div>
  );
};
const FingerprintIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-6 h-6"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6" /><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" /></svg>
);

function TrendsView({ data, setActiveView, sidebarOpen, setSidebarOpen }: any) {
  const [activeTab, setActiveTab] = useState<'regional' | 'temporal'>('regional');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // AGGREGATE BIOMETRIC COMPLIANCE DATA BY STATE
  const complianceData = useMemo(() => {
    if (!data?.bio_compliance) return [];

    const stateMap = new Map();

    data.bio_compliance.forEach((row: any) => {
      const state = row.state;
      if (!stateMap.has(state)) {
        stateMap.set(state, { state, required: 0, actual: 0 });
      }
      const entry = stateMap.get(state);
      entry.required += row.enrolment_volume;
      entry.actual += row.bio_update_volume;
    });

    return Array.from(stateMap.values())
      .sort((a: any, b: any) => b.required - a.required)
      .slice(0, 5); // Top 5 states by volume
  }, [data]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>
        <div className="px-6 py-4 flex justify-between items-center text-slate-800">
          <div className="flex items-center gap-3 ml-16">
            <h1 className="text-xl font-bold text-slate-800">Societal Insight Engine</h1>
            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
              <Activity size={10} /> LIVE ANALYSIS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setActiveTab('regional')}
                className={cn("text-xs font-bold px-3 py-1.5 rounded-md transition", activeTab === 'regional' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
              >
                Regional
              </button>
              <button
                onClick={() => setActiveTab('temporal')}
                className={cn("text-xs font-bold px-3 py-1.5 rounded-md transition", activeTab === 'temporal' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
              >
                Temporal
              </button>
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-6">
              <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" alt="Aadhaar" className="h-10 w-auto" />
              <button onClick={() => setActiveView('dashboard')} className="text-blue-600 font-bold hover:bg-blue-50 px-3 py-1 rounded transition text-sm">
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI ADVISOR - STRATEGY ENGINE */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-4 text-white shadow-xl relative overflow-hidden mb-5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm"><Sparkles size={20} className="text-cyan-400" /></div>
            <div>
              <h3 className="font-bold text-lg text-white">AI Strategy Engine</h3>
              <p className="text-cyan-200/60 text-xs">Automated Insights & Recommendations</p>
            </div>
          </div>
        </div>

        {/* AI POLICY ADVISOR (Official Style) */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">AI Policy Advisor</h3>
              <p className="text-xs text-slate-500">Automated Decision Support System</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {data.ai_advisories?.advisories?.map((advice: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition flex-1 min-w-[300px]">
                <div className="flex justify-between items-start mb-3">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                    advice.severity === 'CRITICAL' ? "bg-red-50 text-red-600 border-red-100" :
                      advice.severity === 'HIGH' ? "bg-orange-50 text-orange-600 border-orange-100" :
                        "bg-blue-50 text-blue-600 border-blue-100"
                  )}>
                    {advice.severity}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{advice.type}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2" title={advice.title}>{advice.title}</h4>
                <p className="text-xs text-slate-500 mb-3 line-clamp-3">{advice.recommendation}</p>
                <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
                  <TrendingUp size={12} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 italic trunkate">{advice.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP ROW: KEY SOCIETAL METRICS (Interactive Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-pink-500 hover:shadow-md transition cursor-pointer group">
          <div className="flex justify-between items-start">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Gender Parity</h3>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition" />
          </div>
          <div className="text-2xl font-bold text-slate-800 flex items-end gap-2 group-hover:text-pink-600 transition">
            {data.societal_trends?.gender_gap?.[0]?.female_percentage || 0}%
            <span className="text-xs text-slate-400 font-normal mb-1">Top Region</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500 hover:shadow-md transition cursor-pointer group">
          <div className="flex justify-between items-start">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Digital Adoption</h3>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition" />
          </div>
          <div className="text-2xl font-bold text-slate-800 flex items-end gap-2 group-hover:text-blue-600 transition">
            {(data.kpis?.mobile_update_ratio * 100).toFixed(1) || 0}%
            <span className="text-xs text-slate-400 font-normal mb-1">Mobile Updates</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-purple-500 hover:shadow-md transition cursor-pointer group">
          <div className="flex justify-between items-start">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Migration Flow</h3>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition" />
          </div>
          <div className="text-2xl font-bold text-slate-800 flex items-end gap-2 group-hover:text-purple-600 transition">
            {data.societal_trends?.migration_hotspots?.length || 0}
            <span className="text-xs text-slate-400 font-normal mb-1">Hotspots</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500 hover:shadow-md transition cursor-pointer group">
          <div className="flex justify-between items-start">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Impact</h3>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition" />
          </div>
          <div className="text-2xl font-bold text-slate-800 flex items-end gap-2 group-hover:text-emerald-600 transition">
            {(data.kpis?.total_enrolment / 1000000).toFixed(1)}M
            <span className="text-xs text-slate-400 font-normal mb-1">Citizens</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: GENDER GAP (Interactive) */}
        {/* CHART 1: MANDATORY BIOMETRIC COMPLIANCE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                Mandatory Biometric Compliance
                <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase">Compliance</span>
              </h3>
              <p className="text-xs text-slate-500">Kids (5-17y) requiring Bio-Updates vs Actual Updates</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={complianceData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="state" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="required" name="Required Updates" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={12}>
                    <LabelList dataKey="required" position="top" style={{ fontSize: '10px', fill: '#64748b' }} />
                  </Bar>
                  <Bar dataKey="actual" name="Actual Updates" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12}>
                    <LabelList dataKey="actual" position="top" style={{ fontSize: '10px', fill: '#3b82f6', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CHART 2: SYSTEM PULSE (Area Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                Demographic Shift
                <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase">Trend</span>
              </h3>
              <p className="text-xs text-slate-500">New Born vs Adult Enrolment Ratio</p>
            </div>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div> <span className="text-[10px] text-slate-500 mr-2">New Born</span>
              <div className="w-3 h-3 rounded-full bg-purple-500"></div> <span className="text-[10px] text-slate-500">Adult</span>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.societal_trends?.age_trends || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNewBorn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAdult" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="new_borns" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNewBorn)" name="New Borns" />
                  <Area type="monotone" dataKey="adult_entrants" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorAdult)" name="Adults" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* MIGRATION LIST */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <MapIcon size={16} /> Migration Hotspots
            </h3>
            <button className="text-[10px] text-blue-600 font-bold hover:underline">VIEW MAP</button>
          </div>
          <div className="space-y-3 relative z-10">
            {data.societal_trends?.migration_hotspots?.map((city: string, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-500 font-bold w-6 h-6 rounded flex items-center justify-center text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition">{i + 1}</div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{city}</span>
                </div>
                <TrendingUp size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
function PlannerView({ data, sidebarOpen, setSidebarOpen }: any) {
  const [goal, setGoal] = useState<'inclusion' | 'fraud'>('inclusion');

  return (
    <div className="space-y-6">
      {/* HEADER WITH TRICOLOR AND LOGO */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 ml-16">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Smart Resource Planner</h2>
              <p className="text-slate-500 text-sm">AI-Recommended Deployment for Mobile Update Kits</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg"
              alt="Aadhaar"
              className="h-10 w-auto"
            />
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL: OPTIMIZATION CONTROLS */}
        <div className="lg:col-span-1 bg-[#1e293b] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-6 font-mono">
              <span>1 Unit</span>
              <span>50 Units</span>
            </div>

            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Optimization Goal</h3>

            <div className="space-y-3 mb-8">
              <label className={cn(
                "flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                goal === 'inclusion' ? "bg-blue-600/20 border-blue-500" : "bg-slate-800 border-slate-700 hover:bg-slate-700"
              )}>
                <input
                  type="radio"
                  name="goal"
                  checked={goal === 'inclusion'}
                  onChange={() => setGoal('inclusion')}
                  className="w-4 h-4 text-blue-500 bg-transparent border-slate-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <div>
                  <div className="font-bold text-sm">Max Inclusion</div>
                  <div className="text-xs text-slate-400">Reach remote areas</div>
                </div>
              </label>

              <label className={cn(
                "flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                goal === 'fraud' ? "bg-blue-600/20 border-blue-500" : "bg-slate-800 border-slate-700 hover:bg-slate-700"
              )}>
                <input
                  type="radio"
                  name="goal"
                  checked={goal === 'fraud'}
                  onChange={() => setGoal('fraud')}
                  className="w-4 h-4 text-blue-500 bg-transparent border-slate-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <div>
                  <div className="font-bold text-sm">Fraud Reduction</div>
                  <div className="text-xs text-slate-400">Target anomalies</div>
                </div>
              </label>
            </div>
          </div>

          <button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50 transition-all uppercase tracking-wide text-sm">
            <Cpu size={18} /> Generate Deployment Plan
          </button>
        </div>

        {/* RIGHT PANEL: PRIORITY TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Target District</th>
                  <th className="p-4">Reasoning</th>
                  <th className="p-4">Units</th>
                  <th className="p-4">Est. Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.catchment_plan || []).slice(0, 5).map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-blue-600">#{i + 1}</td>
                    <td className="p-4 font-bold text-slate-800">{row.district}</td>
                    <td className="p-4">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-[10px] font-bold border border-orange-200 uppercase">
                        Low Bio-Updates
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">2 Vans</td>
                    <td className="p-4 text-green-600 font-bold">+0.0%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOTTOM PANEL: HYPER-LOCAL TARGETS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden border-t-4 border-t-red-500">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <MapIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Hyper-Local Pincode Targets</h3>
              <p className="text-slate-500 text-sm">
                <strong className="text-slate-800">{data.hyperlocal_hotspots?.length || 0} High-Priority Zones</strong> detected using Enrolment-to-Update lag analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400 font-bold tracking-wider">
              <tr>
                <th className="p-6 pb-2">Rank</th>
                <th className="p-6 pb-2">Pincode</th>
                <th className="p-6 pb-2">Location</th>
                <th className="p-6 pb-2 text-right">Enrolment Base</th>
                <th className="p-6 pb-2 text-right">Recent Updates</th>
                <th className="p-6 pb-2">Urgency</th>
                <th className="p-6 pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(data.hyperlocal_hotspots || []).map((row: any, i: number) => (
                <tr key={i} className="group hover:bg-slate-50">
                  <td className="p-6 py-4 text-slate-400 font-bold">#{i + 1}</td>
                  <td className="p-6 py-4 font-bold text-blue-600 font-mono">{row.pincode}</td>
                  <td className="p-6 py-4">
                    <div className="font-bold text-slate-800">{row.district}</div>
                    <div className="text-xs text-slate-400">{row.state}</div>
                  </td>
                  <td className="p-6 py-4 text-right font-mono text-slate-700">{row.enrolment}</td>
                  <td className="p-6 py-4 text-right font-mono text-slate-700">{row.updates}</td>
                  <td className="p-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold border uppercase",
                      row.urgency === 'High' ? "bg-red-100 text-red-700 border-red-200" :
                        row.urgency === 'Medium' ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-green-100 text-green-700 border-green-200"
                    )}>
                      {row.urgency}
                    </span>
                  </td>
                  <td className="p-6 py-4 text-right">
                    <button className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded transition">
                      Dispatch Kit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AlertsView({ data, setActiveView, sidebarOpen, setSidebarOpen }: any) {
  return (
    <div className="bg-white min-h-[80vh] rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>

      {/* TOP BAR */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4 ml-16">
          <h2 className="text-lg font-bold text-slate-800">Operational Anomalies</h2>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">v2.4.0-STABLE</span>
        </div>
        <div className="flex items-center gap-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg"
            alt="Aadhaar"
            className="h-10 w-auto"
          />
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <span className="font-bold text-slate-600 text-sm">English</span>
        </div>
      </div>

      <div className="p-8">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Anomaly Detection Logs</h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Auto-detected statistical deviations in enrollment/update patterns
            </p>
          </div>
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-100 p-8 min-h-[400px] flex flex-col">
          {(!data.anomalies || data.anomalies.length === 0) ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              {/* EMPTY STATE */}
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 border-4 border-green-100">
                <ShieldCheck size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">All Systems Normal</h3>
              <p className="text-slate-500 font-medium">No statistical anomalies detected in current dataset.</p>
            </div>
          ) : (
            <div>
              {/* TABLE HEADER */}
              <div className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 text-slate-400 font-bold text-sm uppercase tracking-wider mb-4">
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Month</div>
                <div className="col-span-3">Region</div>
                <div className="col-span-3">Issue Detected</div>
                <div className="col-span-2 text-right">Deviation</div>
              </div>

              {/* TABLE BODY */}
              <div className="space-y-2">
                {data.anomalies.map((ano: any, i: number) => (
                  <div key={i} className="grid grid-cols-12 gap-4 py-4 items-center hover:bg-slate-50 rounded-lg transition-colors px-2 -mx-2">
                    <div className="col-span-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                        (ano.type.includes("Critical") || ano.type.includes("Spike"))
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", (ano.type.includes("Critical") || ano.type.includes("Spike")) ? "bg-red-600" : "bg-amber-600")}></div>
                        {(ano.type.includes("Critical") || ano.type.includes("Spike")) ? "CRITICAL" : "REVIEW"}
                      </span>
                    </div>
                    <div className="col-span-2 text-slate-600 font-medium">{ano.month}</div>
                    <div className="col-span-3 font-bold text-slate-800">{ano.state}</div>
                    <div className="col-span-3 text-slate-600 text-sm truncate" title={ano.type}>{ano.type}</div>
                    <div className="col-span-2 text-right font-bold font-mono text-red-600">
                      {((ano.value - ano.expected) / ano.expected * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function MatrixView({ data, setActiveView, sidebarOpen, setSidebarOpen }: any) {
  const [filterZone, setFilterZone] = useState('All');
  const zones = ['All', 'Growth High', 'Growth Stable', 'Saturation', 'Fraud Risk'];

  // Prepare Scatter Data: Demographic Ratio vs Biometric Ratio (from CSVs)
  const scatterData = data.strategic_matrix?.map((d: any) => ({
    x: d.x_demo_ratio, // Demographic Intensity
    y: d.y_bio_ratio,  // Biometric Intensity
    z: d.z_enrolment,  // Volume
    name: d.district,
    zone: d.zone
  })) || [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>
        <div className="px-6 py-4 flex justify-between items-center text-slate-800">
          <div className="flex items-center gap-2 ml-16">
            <h1 className="text-xl font-bold text-slate-800">Strategic Operations Matrix</h1>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">v3.0.0-LIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" alt="Aadhaar" className="h-10 w-auto" />
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <span className="font-bold text-slate-600 text-sm">English</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHITE CARD CONTAINER */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 overflow-hidden relative">
        {/* Header Internal */}
        <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
                <Activity size={24} className="text-white" />
              </div>
              STRATEGIC OPERATIONAL ZONES
            </h2>
            <p className="text-green-600 text-xs font-bold tracking-widest mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              SYSTEM STATUS: LIVE // CROSS-DIMENSIONAL OPS INTELLIGENCE
            </p>
          </div>
          <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-blue-100">
            ← Back to Dashboard
          </button>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 p-6 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="absolute right-6 top-6 bg-red-100 p-3 rounded-full text-red-600 transition-transform group-hover:scale-110">
              <AlertTriangle size={24} strokeWidth={2} />
            </div>
            <h3 className="text-red-600 text-xs font-bold tracking-widest uppercase mb-1 relative z-10">Critical Anomalies</h3>
            <div className="text-4xl text-slate-800 font-bold mb-2 relative z-10">
              {data.strategic_matrix?.filter((d: any) => d.zone === 'Fraud Risk').length || 0}
            </div>
            <p className="text-slate-500 text-[10px] font-bold relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Action: Immediate Audit
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 p-6 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="absolute right-6 top-6 bg-orange-100 p-3 rounded-full text-orange-600 transition-transform group-hover:scale-110">
              <MapIcon size={24} strokeWidth={2} />
            </div>
            <h3 className="text-orange-600 text-xs font-bold tracking-widest uppercase mb-1 relative z-10">Camp Priority Zones</h3>
            <div className="text-4xl text-slate-800 font-bold mb-2 relative z-10">
              {data.strategic_matrix?.filter((d: any) => d.zone === 'Camp Target').length || 0}
            </div>
            <p className="text-slate-500 text-[10px] font-bold relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> Action: Mobile Camp
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="absolute right-6 top-6 bg-emerald-100 p-3 rounded-full text-emerald-600 transition-transform group-hover:scale-110">
              <CheckCircle size={24} strokeWidth={2} />
            </div>
            <h3 className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-1 relative z-10">Healthy Zones</h3>
            <div className="text-4xl text-slate-800 font-bold mb-2 relative z-10">
              {data.strategic_matrix?.filter((d: any) => d.zone === 'Healthy').length || 0}
            </div>
            <p className="text-slate-500 text-[10px] font-bold relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Action: Maintain
            </p>
          </div>
        </div>

        {/* MATRICES & LISTS */}
        <div className="grid grid-cols-1 gap-8">
          {/* MATRIX SCATTER (2/3 Width) */}
          <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-innerer-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Inclusion-Friction Operating Matrix</h3>
              <div className="flex gap-4 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-red-600"><div className="w-2 h-2 bg-red-500 rounded-full"></div> FRAUD RISK</span>
                <span className="flex items-center gap-1 text-orange-600"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> TARGET CAMP</span>
                <span className="flex items-center gap-1 text-emerald-600"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> STABLE</span>
              </div>
            </div>
            <div className="h-[400px] w-full bg-white rounded-xl border border-slate-100 p-2 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis type="number" dataKey="x" name="Inclusion" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Demographic Penetration Index', position: 'bottom', offset: 0, fontSize: 10, fill: '#64748b' }} />
                  <YAxis type="number" dataKey="y" name="Friction" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Biometric Efficiency Score', angle: -90, position: 'left', fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-slate-200 rounded shadow-lg text-xs">
                            <p className="font-bold text-slate-800 mb-1">{data.name}</p>
                            <p className="text-slate-500 mb-2">Zone: <span className="font-bold text-slate-700">{data.zone}</span></p>
                            <div className="my-1 h-[1px] bg-slate-100"></div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                              <span className="text-slate-500">Demo Ratio:</span>
                              <span className="font-bold text-blue-600 text-right">{data.x}%</span>
                              <span className="text-slate-500">Bio Ratio:</span>
                              <span className="font-bold text-indigo-600 text-right">{data.y}%</span>
                              <span className="text-slate-500">Volume:</span>
                              <span className="font-bold text-slate-800 text-right">{data.z.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine x={8} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'High Activity', fill: '#ef4444', fontSize: 10 }} />
                  <ReferenceLine y={2} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'right', value: 'Low Bio', fill: '#3b82f6', fontSize: 10 }} />
                  <Scatter name="Districts" data={scatterData} fill="#8884d8">
                    {scatterData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.zone === 'Fraud Risk' ? '#ef4444' : entry.zone === 'Camp Target' ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center italic">
              Real-time analysis of <span className="font-bold">Demographic Intensity</span> vs <span className="font-bold">Biometric Intensity</span>.
            </p>
          </div>

          {/* ACTION QUEUE (1/3 Width) */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-2xl flex flex-col h-[600px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Priority Action Hub
                </h3>
                <p className="text-slate-400 text-xs mt-1">Real-time Intervention Stream</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-red-500/20 uppercase tracking-wider">Audit</span>
                <span className="bg-orange-500/10 text-orange-400 text-[10px] font-bold px-2 py-1 rounded border border-orange-500/20 uppercase tracking-wider">Deploy</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 relative z-10">
              {data.strategic_matrix
                ?.filter((d: any) => d.zone !== 'Healthy' && d.zone !== 'Growth Stable')
                .slice(0, 10)
                .map((d: any, i: number) => (
                  <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-500 transition group relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${d.zone === 'Fraud Risk' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm">{d.district}</h4>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${d.zone === 'Fraud Risk' ? 'text-red-400' : 'text-orange-400'}`}>
                          {d.zone === 'Fraud Risk' ? 'Anomaly Detected' : 'Coverage Gap'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-mono">ID: {d.state_code || 'XX'}-{d.district_code || i}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 pl-2">
                      <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                        <div className="text-[10px] text-slate-500 uppercase">Est. Updates</div>
                        <div className="text-xs font-bold text-slate-300">{(d.z_enrolment * (d.y_bio_ratio / 100)).toFixed(0)}</div>
                      </div>
                      <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                        <div className="text-[10px] text-slate-500 uppercase">Citizen Impact</div>
                        <div className="text-xs font-bold text-slate-300">{d.z_enrolment.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="pl-2">
                      <button className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 ${d.zone === 'Fraud Risk'
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-900/20'
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-900/20'
                        }`}>
                        {d.zone === 'Fraud Risk' ? <><AlertTriangle size={12} /> Init Audit Protocol</> : <><MapIcon size={12} /> Deploy Mobile Unit</>}
                      </button>
                    </div>
                  </div>
                ))}
              {data.strategic_matrix?.filter((d: any) => d.zone !== 'Healthy').length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm">
                  <CheckCircle size={32} className="mb-2 text-emerald-500/50" />
                  All Zones Operational
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function MapView({ data, setActiveView, sidebarOpen, setSidebarOpen }: any) {
  return (
    <div className="space-y-6">
      {/* RISKS GRID */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* HEADER */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>
          <div className="flex items-center gap-3 ml-16">
            <span className="font-bold text-slate-700">Inclusion & Coverage Analysis</span>
            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">v2.4.0-STABLE</span>
          </div>
          <div className="flex items-center gap-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg"
              alt="Aadhaar"
              className="h-10 w-auto"
            />
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <button onClick={() => setActiveView('dashboard')} className="text-blue-700 font-medium hover:underline text-sm flex items-center gap-1">
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="p-6 bg-slate-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.inclusion_risks.map((risk: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 border-l-4 border-l-red-500 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 leading-tight">{risk.district}</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase mt-1">{risk.state}</p>
                    </div>
                    <span className="bg-red-50 text-red-600 font-bold text-[10px] px-2 py-1 rounded border border-red-100 uppercase">
                      Risk
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Digital Access Index</span>
                      <span className="font-bold text-slate-800">{(risk.value * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${Math.max(risk.value * 100, 5)}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 p-3 rounded text-xs text-slate-700 flex gap-2 items-start mt-auto">
                  <span className="font-bold text-red-400">i</span>
                  <span className="leading-tight">Update rates significantly below state avg.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INCLUSION WATCHLIST TABLE (Restored from Image) */}
      <Card className="overflow-hidden border-t-4 border-t-red-600">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-600" /> Inclusion Watchlist
            </h3>
            <p className="text-xs text-slate-500">Operational Anomalies Detected</p>
          </div>
          <div className="text-xs font-bold text-slate-400">Jan 2026</div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold tracking-wider">
            <tr>
              <th className="p-4">Location</th>
              <th className="p-4">Insight Type</th>
              <th className="p-4 text-center">Digital Access Linkage</th>
              <th className="p-4 text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {[
              { loc: "East Khasi Hills", type: "Digital Access Index", vol: "0%" },
              { loc: "Bengaluru Urban", type: "Digital Access Index", vol: "0%" },
              { loc: "Kanpur Nagar", type: "Digital Access Index", vol: "0%" },
              { loc: "Aligarh", type: "Digital Access Index", vol: "0%" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition group">
                <td className="p-4 font-bold text-slate-800">{row.loc}</td>
                <td className="p-4 text-slate-500">{row.type}</td>
                <td className="p-4 text-center">
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-yellow-200">
                    Digitally Dependent
                  </span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-slate-800">{row.vol}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 text-center border-t border-slate-100">
          <button className="text-blue-600 text-xs font-bold hover:underline">View Full Inclusion Report</button>
        </div>
      </Card>
    </div>
  );
}

function ReportView({ data }: any) {
  // Dynamic import to avoid SSR issues with react-pdf
  // In a real Next.js app, we'd use a separate Client Component wrapper
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <FileText size={64} className="mx-auto text-indigo-600 mb-4" />
        <h2 className="text-3xl font-bold text-slate-900">Official Submission Report</h2>
        <p className="text-slate-500 mt-2">Ready for UIDAI Hackathon 2026 Jury Review</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full text-center">
        <p className="text-lg text-slate-700 mb-6">
          This report compiles all insights, including the **ALI Index**, **Societal Trends**, and **Strategic Matrix**, into a standard PDF format using the official template.
        </p>

        <Link
          href="/report"
          className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-transform hover:-translate-y-1"
        >
          <Download size={24} />
          Download Full PDF Report
        </Link>

        <p className="mt-6 text-xs text-slate-400 uppercase font-bold tracking-widest">
          Generated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

