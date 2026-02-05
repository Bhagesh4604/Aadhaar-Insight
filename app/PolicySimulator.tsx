import React, { useState, useMemo } from 'react';
import { Play, TrendingUp, AlertTriangle, Users, Server, DollarSign, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine, LabelList } from 'recharts';

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
        {children}
    </div>
);
// --- COMPONENT ---
export const PolicySimulator = ({ data }: { data: any[] }) => {
    // --- STATE ---
    const [params, setParams] = useState({
        minAge: 18,        // Mandatory update for everyone above this age
        graceMonths: 6,    // Time to complete updates
        surgeCapacity: 1.0 // 1.0 = Normal, 1.5 = +50% Overtime
    });

    // --- CALCULATION ENGINE ---
    const simulation = useMemo(() => {
        // 1. Calculate Target Population Volume
        // Logic: Sum of enrolments for age > minAge
        // Since we only have aggregate buckets (0-5, 5-18, 18+), we estimate:
        // If minAge < 5: include all.
        // If minAge < 18: include 18+ and proportional 5-18. 
        // If minAge >= 18: include proportional 18+.

        // Total 18+ pool approx 900M. 5-18 approx 300M.
        let targetVol = 0;

        const adultPool = data.reduce((acc, curr) => acc + (curr.enrolment?.age_18_plus || 0), 0);
        const youthPool = data.reduce((acc, curr) => acc + (curr.enrolment?.age_5_17 || 0), 0);
        const childPool = data.reduce((acc, curr) => acc + (curr.enrolment?.age_0_5 || 0), 0);

        if (params.minAge < 5) {
            targetVol = childPool + youthPool + adultPool;
        } else if (params.minAge < 18) {
            targetVol = youthPool + adultPool;
        } else {
            // Linear decay assumption for adults 18 to 80
            // If minAge is 50, we take roughly half of adults? 
            // Let's use a simple heuristic: Enrolment reduces with age.
            const ratio = Math.max(0, (80 - params.minAge) / (80 - 18));
            targetVol = adultPool * ratio;
        }

        // 2. Server Load Calculation
        // Daily Capacity (Global) approx 1M updates/day
        const SYSTEM_CAPACITY_DAILY = 1000000 * params.surgeCapacity;
        const requiredDailyThroughput = targetVol / (params.graceMonths * 30);
        const loadPercentage = (requiredDailyThroughput / SYSTEM_CAPACITY_DAILY) * 100;

        // 3. Cost Projector
        // Approx cost per update transaction = ₹50
        const costInCrores = (targetVol * 50) / 10000000;

        return {
            targetVol,
            dailyLoad: requiredDailyThroughput,
            loadPercentage,
            costInCrores,
            isCritical: loadPercentage > 100
        };
    }, [data, params]);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-200">
                            <RefreshCw className="text-white h-6 w-6 animate-spin-slow" />
                        </div>
                        Digital Twin: Policy Simulator
                    </h2>
                    <p className="text-slate-500 font-medium ml-14">"What-If" Scenario Sandbox</p>
                </div>
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl border border-purple-100 font-bold text-sm hidden md:block">
                    Analyzed {data?.length || 0} Records
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT: CONTROLS */}
                <div className="col-span-4 space-y-4">
                    <Card className="p-6 bg-white/80 backdrop-blur border-slate-200 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Simulation Parameters</h3>

                        {/* PARAM 1: AGE */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700">Mandatory Update Age</label>
                                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{params.minAge}+ Years</span>
                            </div>
                            <input
                                type="range" min="0" max="80" step="5"
                                value={params.minAge}
                                onChange={(e) => setParams({ ...params, minAge: Number(e.target.value) })}
                                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-slate-400">Target population age threshold</p>
                        </div>

                        {/* PARAM 2: TIMELINE */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700">Rollout Timeline</label>
                                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{params.graceMonths} Months</span>
                            </div>
                            <input
                                type="range" min="1" max="24" step="1"
                                value={params.graceMonths}
                                onChange={(e) => setParams({ ...params, graceMonths: Number(e.target.value) })}
                                className="w-full accent-blue-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-slate-400">Duration allowed for compliance</p>
                        </div>

                        {/* PARAM 3: CAPACITY */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700">Operator Surplus</label>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${params.surgeCapacity > 1 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {params.surgeCapacity === 1 ? 'Standard' : '+50% Surge'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setParams({ ...params, surgeCapacity: 1.0 })}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${params.surgeCapacity === 1.0 ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                >Standard</button>
                                <button
                                    onClick={() => setParams({ ...params, surgeCapacity: 1.5 })}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${params.surgeCapacity === 1.5 ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                >Surge Mode</button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: OUTPUTS */}
                <div className="col-span-8 grid grid-cols-2 gap-6">

                    {/* KPI 1: POPULATION */}
                    <Card className="p-6 col-span-1 bg-white border-slate-200 shadow-md flex flex-col justify-between group hover:border-purple-200 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase">Target Population</h4>
                                <div className="text-3xl font-black text-slate-800 mt-2">
                                    {(simulation.targetVol / 1000000).toFixed(1)}M
                                </div>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <Users size={20} />
                            </div>
                        </div>
                        <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (simulation.targetVol / 1400000000) * 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Citizens requiring updates</p>
                    </Card>

                    {/* KPI 2: COST */}
                    <Card className="p-6 col-span-1 bg-white border-slate-200 shadow-md flex flex-col justify-between group hover:border-green-200 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase">Est. Budget Impact</h4>
                                <div className="text-3xl font-black text-slate-800 mt-2">
                                    ₹{simulation.costInCrores.toFixed(0)} Cr
                                </div>
                            </div>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                                <DollarSign size={20} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-auto font-medium">Based on ₹50 operational cost/update</p>
                    </Card>

                    {/* MAIN KPI: SERVER LOAD */}
                    <Card className={`col-span-2 p-6 border shadow-lg transition-all duration-500 ${simulation.isCritical ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    System Load Forecast
                                    {simulation.isCritical && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full uppercase tracking-wide animate-pulse">Critical Overload</span>}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium">Daily transaction volume vs. Server Capacity</p>
                            </div>
                            <div className={`text-4xl font-black ${simulation.isCritical ? 'text-red-600' : 'text-slate-800'}`}>
                                {simulation.loadPercentage.toFixed(0)}%
                            </div>
                        </div>

                        {/* LOAD BAR GRAPHIC */}
                        <div className="relative h-12 bg-slate-100 rounded-xl overflow-hidden mb-2">
                            {/* Capacity Marker */}
                            <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10 border-l border-dashed border-slate-500" style={{ left: '80%' }}></div> {/* Visual 100% anchor if we scale differently? No, let's keep simple */}

                            <div
                                className={`h-full transition-all duration-700 ease-out flex items-center justify-end px-3 ${simulation.isCritical ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, simulation.loadPercentage)}%` }}
                            >
                                <span className="text-white font-bold text-sm tracking-widest">
                                    {(simulation.dailyLoad / 1000).toFixed(0)}K / DAY
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>IDLE</span>
                            <span>OPTIMAL CAPACITY (1M/Day)</span>
                            <span>CRITICAL</span>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};
