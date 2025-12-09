import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// FORMATTER
const formatMoney = (val) => `M$ ${Math.round(val).toLocaleString('es-CL')}`;

// DATASETS
const table1Data = [
    { item: "1. Dotación Propia", desc: "13 FTE (Superintendente, Ing., Turnos)", amount: 1564731, share: "15.9%" },
    { item: "2. Servicios de Terceros", desc: "Contrato Base + Adicionales Falla", amount: 6257442, share: "63.7%" },
    { item: "3. Materiales y Repuestos", desc: "Reposición por desgaste acelerado", amount: 1808100, share: "18.4%" },
    { item: "4. Contingencias y Otros", desc: "Logística Urgencia (Hot Shot)", amount: 194227, share: "2.0%" },
    { item: "TOTAL PRESUPUESTO OPEX", desc: "", amount: 9824500, share: "100%", isTotal: true }
];

const table2Data = [
    { item: "1. Dotación Propia", desc: "Estructura fija se mantiene", amount: 1564731, var: "0.0%" },
    { item: "2. Servicios de Terceros", desc: "Impacto por mejor planificación", amount: 5944570, var: "-5.0%" },
    { item: "3. Materiales y Repuestos", desc: "Menor daño colateral", amount: 1771938, var: "-2.0%" },
    { item: "4. Tecnología IoT (Nuevo)", desc: "Costo Innovación (Licencias + Deprec. NIC 16)", amount: 35047, var: "N/A" },
    { item: "5. Contingencias", desc: "Reducción drástica urgencias", amount: 159699, var: "-17.8%" },
    { item: "TOTAL PRESUPUESTO OPEX", desc: "", amount: 9475985, var: "-3.5%", isTotal: true }
];

const table3Data = [
    { item: "1. Dotación Propia", without: 1564731, with: 1564731, delta: 0, pct: "0.0%" },
    { item: "2. Servicios de Terceros", without: 6257442, with: 5944570, delta: -312872, pct: "-5.0%" },
    { item: "3. Materiales y Repuestos", without: 1808100, with: 1771938, delta: -36162, pct: "-2.0%" },
    { item: "4. Tecnología IoT", without: 0, with: 35047, delta: 35047, pct: "N/A" },
    { item: "5. Contingencias", without: 194227, with: 159699, delta: -34528, pct: "-17.8%" },
    { item: "TOTAL PRESUPUESTO", without: 9824500, with: 9475985, delta: -348515, pct: "-3.5%", isTotal: true }
];

// SHARED COMPONENTS
const FinancialGrid = ({ title, columns, children, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        {title && (
            <div className={cn("px-6 py-4 flex items-center gap-2 border-b", `bg-${color}-50 border-${color}-100`)}>
                <FileText size={18} className={`text-${color}-600`} />
                <h3 className={`text-base font-bold text-${color}-800`}>{title}</h3>
            </div>
        )}
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                        {columns.map((col, idx) => (
                            <th key={idx} className={cn("px-6 py-3", col.align === 'right' ? "text-right" : "text-left")}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {children}
                </tbody>
            </table>
        </div>
    </div>
);

const NICCard = ({ title, code, icon: Icon, children }) => (
    <div className="bg-slate-800 text-white rounded-xl p-5 border border-slate-700 shadow-xl flex gap-4">
        <div className="p-3 bg-white/10 rounded-lg shrink-0 h-fit">
            <Icon size={24} className="text-codelco-orange" />
        </div>
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-codelco-orange px-2 py-0.5 rounded text-white">{code}</span>
                <h4 className="font-bold text-lg">{title}</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
                {children}
            </div>
        </div>
    </div>
);

// Simple Icon Components for NIC Cards
const IconA = (props) => (
    <div {...props} className="flex items-center justify-center font-serif font-bold text-2xl text-codelco-orange">A</div>
);
const IconB = (props) => (
    <div {...props} className="flex items-center justify-center font-serif font-bold text-2xl text-codelco-orange">B</div>
);


const BudgetDetail = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-codelco-slate p-8 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
            >
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Desglose Presupuestario</h1>
                        <p className="text-gray-500">División San Lorenzo • Análisis Financiero Detallado</p>
                    </div>
                </div>

                {/* SECTION 1: INTRO */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <BookOpen size={20} className="text-codelco-orange" /> Análisis Presupuestario y Financiero
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Evaluación del impacto financiero en la Superintendencia de Mantenimiento Molienda (División San Lorenzo).
                        Se compara el escenario base (reactivo) vs. innovación tecnológica (predictivo).
                    </p>
                </div>

                {/* SECTION 2: BASE SCENARIO */}
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-l-4 border-gray-400 pl-3">1. Escenario Base (Run-to-Failure)</h3>
                <p className="mb-6 text-gray-600">
                    Refleja la proyección 2025 bajo el modelo actual. La partida de Servicios de Terceros representa el
                    <strong className="text-red-600"> 63,7%</strong> del presupuesto (M$ 6.257.442), evidenciando ineficiencia por urgencias.
                </p>

                <FinancialGrid
                    title="Presupuesto Operativo 2025 - Escenario Sin Propuesta"
                    color="gray"
                    columns={[{ label: "Ítem" }, { label: "Descripción" }, { label: "Monto (M$)", align: "right" }, { label: "% Part.", align: "right" }]}
                >
                    {table1Data.map((row, i) => (
                        <tr key={i} className={cn("hover:bg-gray-50", row.isTotal && "bg-gray-100 font-bold border-t-2 border-gray-300")}>
                            <td className="px-6 py-4">{row.item}</td>
                            <td className="px-6 py-4 text-gray-500 text-xs italic">{row.desc}</td>
                            <td className="px-6 py-4 text-right tabular-nums">{row.amount.toLocaleString('es-CL')}</td>
                            <td className="px-6 py-4 text-right">{row.share}</td>
                        </tr>
                    ))}
                </FinancialGrid>


                {/* SECTION 3: IoT SCENARIO & NIC */}
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-l-4 border-codelco-orange pl-3" id="iot-scenario">2. Escenario Innovador (Con Propuesta)</h3>
                <p className="mb-6 text-gray-600">
                    Incorpora la implementación IoT y estrategia CBM. Se detallan a continuación las nuevas partidas y el tratamiento contable aplicado.
                </p>

                {/* NIC CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <NICCard title="Propiedades, Planta y Equipo" code="NIC 16" icon={IconA}>
                        <p>La inversión en Hardware (Sensores, Gateways) por <span className="text-white font-bold">M$ 57.637</span> se activa como CAPEX.</p>
                        <div className="mt-2 pt-2 border-t border-white/10 text-xs text-gray-400">
                            <span className="text-codelco-orange font-bold uppercase">Impacto:</span> Cargo por Depreciación lineal a 5 años (M$ 11.527 anual).
                        </div>
                    </NICCard>
                    <NICCard title="Activos Intangibles" code="NIC 38" icon={IconB}>
                        <p>Licencias de Software y Soporte Técnico se consideran servicios recurrentes.</p>
                        <div className="mt-2 pt-2 border-t border-white/10 text-xs text-gray-400">
                            <span className="text-codelco-orange font-bold uppercase">Impacto:</span> Imputación directa a Gasto Operacional (OPEX) por M$ 23.520 anual.
                        </div>
                    </NICCard>
                </div>

                <FinancialGrid
                    title="Presupuesto 2025 - Con Propuesta IoT"
                    color="orange"
                    columns={[{ label: "Ítem" }, { label: "Descripción" }, { label: "Monto (M$)", align: "right" }, { label: "Var %", align: "right" }]}
                >
                    {table2Data.map((row, i) => (
                        <tr key={i} className={cn("hover:bg-orange-50/50", row.isTotal && "bg-orange-100 font-bold border-t-2 border-orange-200")}>
                            <td className="px-6 py-4">{row.item}</td>
                            <td className="px-6 py-4 text-gray-500 text-xs italic">{row.desc}</td>
                            <td className="px-6 py-4 text-right tabular-nums">{row.amount.toLocaleString('es-CL')}</td>
                            <td className={cn("px-6 py-4 text-right font-medium", row.var.startsWith("-") ? "text-green-600" : "text-gray-600")}>
                                {row.var}
                            </td>
                        </tr>
                    ))}
                </FinancialGrid>


                {/* SECTION 4: COMPARISON */}
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-l-4 border-green-500 pl-3">3. Análisis Diferencial (Comparison)</h3>
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <CheckCircle2 className="text-green-600 mt-1" size={20} />
                    <p className="text-green-800 text-sm font-medium">
                        <strong>Ahorro Neto Anual: M$ 348.515.</strong><br />
                        El ahorro es líquido y se logra incluso después de absorber los costos del sistema IoT.
                    </p>
                </div>

                <FinancialGrid
                    title="Cuadro Comparativo (Delta)"
                    color="green"
                    columns={[
                        { label: "Ítem / Partida" },
                        { label: "Sin Proyecto", align: "right" },
                        { label: "Con Proyecto", align: "right" },
                        { label: "Delta (M$)", align: "right" },
                        { label: "%", align: "right" }
                    ]}
                >
                    {table3Data.map((row, i) => {
                        const isPositive = row.delta > 0;
                        const isNegative = row.delta < 0;
                        return (
                            <tr key={i} className={cn("hover:bg-green-50/30", row.isTotal && "bg-green-50 font-bold border-t-2 border-green-200 text-lg")}>
                                <td className="px-6 py-4 text-gray-800">{row.item}</td>
                                <td className="px-6 py-4 text-right tabular-nums text-gray-500">{row.without.toLocaleString('es-CL')}</td>
                                <td className="px-6 py-4 text-right tabular-nums text-gray-800 font-medium">{row.with.toLocaleString('es-CL')}</td>
                                <td className={cn("px-6 py-4 text-right tabular-nums font-bold", isNegative ? "text-green-600" : isPositive ? "text-red-500" : "text-gray-400")}>
                                    {row.delta > 0 ? "+" : ""}{row.delta.toLocaleString('es-CL')}
                                </td>
                                <td className="px-6 py-4 text-right text-xs">
                                    <span className={cn("px-2 py-1 rounded", isNegative ? "bg-green-100 text-green-700" : isPositive ? "bg-red-100 text-red-700" : "bg-gray-100")}>
                                        {row.pct}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </FinancialGrid>

                {/* FOOTER */}
                <div className="text-center mt-12 mb-8 text-gray-400 text-xs">
                    <p>Documento Generado Automáticamente por Sistema de Control de Gestión (SCG) • {new Date().toLocaleDateString()}</p>
                </div>

            </motion.div>
        </div>
    );
};

export default BudgetDetail;
