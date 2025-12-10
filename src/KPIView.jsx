import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Heart } from 'lucide-react';
import KPICard from './KPICard';

// HARDCODED DATASET
const kpiData = {
    financiera: [
        {
            title: "ROI del Proyecto",
            desc: "Maximizar retorno sobre la inversión",
            formula: "(Beneficios - Costo Total) / Costo Total * 100",
            target: "> 15% (Anual)",
            current: "18.5%",
            chartType: "growth",
            unit: "%"
        },
        {
            title: "Cost Avoidance",
            desc: "Reducción fallas no programadas",
            formula: "Σ (Hrs Detención × Valor Hr) + Δ Mant.",
            target: "> M$ 11.270 (Mensual)",
            current: "M$ 14.500",
            chartType: "stable-high",
            unit: "M$"
        }
    ],
    cliente: [
        {
            title: "Disponibilidad Red IoT",
            desc: "Asegurar calidad del dato",
            formula: "(Tiempo Operativo / Tiempo Total) * 100",
            target: "> 99% (Diario)",
            current: "99.8%",
            chartType: "consistent",
            unit: "%"
        },
        {
            title: "Lead Time de Alertas",
            desc: "Seguridad en tiempo real",
            formula: "t(acción) - t(alerta)",
            target: "< 10 min",
            current: "4.2 min",
            chartType: "reduction",
            unit: "min"
        }
    ],
    procesos: [
        {
            title: "Ratio Mant. Predictivo",
            desc: "Aumentar estrategia CBM",
            formula: "(OT Predictivas / OT Correctivas) * 100",
            target: "+30% Incr.",
            current: "+45%",
            chartType: "growth",
            unit: "%"
        },
        {
            title: "Precisión de Alarmas",
            desc: "Reducir ruido operacional",
            formula: "(Alertas Reales / Totales) * 100",
            target: "> 85%",
            current: "92%",
            chartType: "growth",
            unit: "%"
        }
    ],
    aprendizaje: [
        {
            title: "Cobertura Capacitación",
            desc: "Fortalecer capacidades digitales",
            formula: "(Personal Certificado / Dotación) * 100",
            target: "> 80%",
            current: "85%",
            chartType: "step",
            unit: "%"
        },
        {
            title: "Nivel de Adopción",
            desc: "Asegurar uso del sistema",
            formula: "(Usuarios Activos / Totales) * 100",
            target: "> 75%",
            current: "78%",
            chartType: "growth",
            unit: "%"
        }
    ]
};

const KPIView = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-sm transition-colors border border-gray-200"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-codelco-slate">Cuadro de Mando Integral (BSC)</h1>
                            <p className="text-sm text-gray-500">Monitoreo Estratégico - División San Lorenzo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                        <Target size={14} />
                        <span>Gestión Basada en Valor</span>
                    </div>
                </div>

                {/* PERSPECTIVES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {Object.entries(kpiData).map(([perspective, kpis], idx) => (
                        <div key={perspective} className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-8 rounded-full ${perspective === 'financiera' ? 'bg-codelco-orange' :
                                    perspective === 'cliente' ? 'bg-blue-500' :
                                        perspective === 'procesos' ? 'bg-green-500' : 'bg-purple-500'
                                    }`}></div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                    Perspectiva {perspective}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {kpis.map((kpi, kpiIdx) => (
                                    <KPICard key={kpiIdx} data={kpi} delay={(idx * 2 + kpiIdx) * 0.1} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* NORTH STAR SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-12 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-amber-400 p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8 overflow-hidden">

                        {/* Visual */}
                        <div className="flex-shrink-0 relative">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center relative z-10">
                                <Heart className="text-red-500 animate-pulse" size={48} fill="currentColor" />
                            </div>
                            <div className="absolute top-0 left-0 w-full h-full bg-red-500 rounded-full animate-ping opacity-20"></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-gray-800">Visión de Largo Plazo (The North Star)</h2>
                                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 mb-1">
                                    META DEFINITIVA
                                </span>
                            </div>

                            <h3 className="text-xl font-mono font-bold text-codelco-slate mb-4">
                                KPI: HALE (Health-Adjusted Life Expectancy)
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                                "Este es el indicador definitivo de éxito para el pilar de Salud Ocupacional. Aunque su medición requiere estudios de más de 20 años para aislar variables multifactoriales, el objetivo final de este proyecto es incrementar la esperanza de vida saludable del trabajador minero, reduciendo su exposición crónica a riesgos ambientales."
                            </p>
                        </div>

                        {/* Stats/Target */}
                        <div className="flex flex-col gap-4 min-w-[150px] border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-8">
                            <div>
                                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Metodología</p>
                                <p className="text-xs font-semibold text-gray-600">Estudios Longitudinales (&gt; 20 años)</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Objetivo</p>
                                <p className="text-lg font-bold text-amber-600">Maximizar Vida Saludable</p>
                            </div>
                        </div>

                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default KPIView;
