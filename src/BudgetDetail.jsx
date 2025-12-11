import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, CheckCircle2, X } from 'lucide-react';
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

const incomeStatementData = {
    base: {
        title: "Escenario 1: Proyección Sin Proyecto (Status Quo)",
        desc: "Estructura de costos ineficiente. Margen presionado por alza de servicios.",
        rows: [
            { name: "1. INGRESOS DE EXPLOTACIÓN", y1: 16500000, y2: 16995000, y3: 17504850, isTotal: true },
            { name: "Transferencia Interna Base", y1: 16500000, y2: 16995000, y3: 17504850, indent: true },
            { name: "2. COSTOS DE EXPLOTACIÓN", y1: -9176046, y2: -9451327, y3: -9734867, isTotal: true },
            { name: "Dotación Propia", y1: -1564731, y2: -1611673, y3: -1660023, indent: true },
            { name: "Servicios de Terceros", y1: -6257442, y2: -6445165, y3: -6638520, indent: true },
            { name: "Materiales y Repuestos", y1: -1353873, y2: -1394489, y3: -1436324, indent: true },
            { name: "3. MARGEN DE CONTRIBUCIÓN", y1: 7323954, y2: 7543673, y3: 7769983, isTotal: true, highlight: true },
            { name: "4. GASTOS DE ADM. (GAV)", y1: -648454, y2: -667908, y3: -687945, isTotal: true },
            { name: "5. EBITDA", y1: 6675500, y2: 6875765, y3: 7082038, isTotal: true, highlight: true },
            { name: "6. DEPRECIACIÓN", y1: -630000, y2: -630000, y3: -630000, isTotal: true },
            { name: "7. EBIT (Resultado Operacional)", y1: 6045500, y2: 6245765, y3: 6452038, isTotal: true, doubleUnderline: true }
        ]
    },
    optimized: {
        title: "Escenario 2: Proyección Con Proyecto (Innovación)",
        desc: "Incorpora eficiencias operativas (-5% Servicios) e Ingreso Incremental por disponibilidad.",
        rows: [
            { name: "1. INGRESOS DE EXPLOTACIÓN", y1: 16637200, y2: 17136316, y3: 17650405, isTotal: true },
            { name: "Transferencia Base", y1: 16500000, y2: 16995000, y3: 17504850, indent: true },
            { name: "Ingreso Incremental (IoT)", y1: 137200, y2: 141316, y3: 145555, indent: true, isNew: true },
            { name: "2. COSTOS DE EXPLOTACIÓN", y1: -8835457, y2: -9100521, y3: -9373536, isTotal: true },
            { name: "Servicios (Optimizados -5%)", y1: -5944570, y2: -6122907, y3: -6306594, indent: true, isNew: true },
            { name: "3. MARGEN DE CONTRIBUCIÓN", y1: 7801743, y2: 8035795, y3: 8276869, isTotal: true, highlight: true },
            { name: "4. GASTOS ADM. + LICENCIAS", y1: -640528, y2: -659744, y3: -679536, isTotal: true },
            { name: "Licencias Software (Nuevo)", y1: -23520, y2: -24226, y3: -24952, indent: true, isNew: true },
            { name: "5. EBITDA", y1: 7161215, y2: 7376051, y3: 7597333, isTotal: true, highlight: true },
            { name: "6. DEPRECIACIÓN", y1: -641527, y2: -641527, y3: -641527, isTotal: true },
            { name: "Depreciación Sensores IoT", y1: -11527, y2: -11527, y3: -11527, indent: true, isNew: true },
            { name: "7. EBIT (Resultado Operacional)", y1: 6519688, y2: 6734524, y3: 6955806, isTotal: true, doubleUnderline: true }
        ]
    }
};

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

const FinancialStatementModal = ({ onClose }) => {
    const [scenario, setScenario] = useState('base'); // 'base' | 'optimized'
    const data = incomeStatementData[scenario];

    const formatFinancial = (num) => {
        if (num < 0) return `(${Math.abs(num).toLocaleString('es-CL')})`;
        return num.toLocaleString('es-CL');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Estados Financieros Comparativos
                        </h2>
                        <p className="text-sm text-gray-500">Proyección Contable (3 Años)</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Scenarios Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setScenario('base')}
                        className={cn("flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors",
                            scenario === 'base' ? "border-gray-800 text-gray-900 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100")}
                    >
                        Escenario Base <span className="block text-xs font-normal text-gray-400 mt-1">(Sin Proyecto)</span>
                    </button>
                    <button
                        onClick={() => setScenario('optimized')}
                        className={cn("flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors",
                            scenario === 'optimized' ? "border-green-600 text-green-700 bg-green-50/30" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100")}
                    >
                        Escenario Optimizado <span className="block text-xs font-normal text-gray-400 mt-1">(Con Proyecto)</span>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 font-mono text-sm">

                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <h4 className="font-bold text-yellow-800 mb-1">{data.title}</h4>
                        <p className="text-yellow-700 text-xs">{data.desc}</p>
                    </div>

                    <div className="border border-gray-300">
                        <table className="w-full">
                            <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-bold">
                                <tr>
                                    <th className="py-3 px-4 text-left border-b border-r border-gray-300 w-1/3">Concepto (M$)</th>
                                    <th className="py-3 px-4 text-right border-b border-gray-300">Año 1</th>
                                    <th className="py-3 px-4 text-right border-b border-gray-300">Año 2</th>
                                    <th className="py-3 px-4 text-right border-b border-gray-300">Año 3</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.rows.map((row, idx) => (
                                    <tr key={idx} className={cn(
                                        "hover:bg-blue-50/30",
                                        row.highlight && "bg-blue-50/50",
                                        row.isNew && "bg-green-50/50"
                                    )}>
                                        <td className={cn(
                                            "py-2 px-4 border-r border-gray-200 text-gray-800",
                                            row.indent && "pl-8 text-gray-600 text-xs",
                                            row.isTotal ? "font-bold" : "",
                                            row.isNew && "text-green-700 font-medium",
                                            row.doubleUnderline && "border-b-4 border-double border-gray-800 py-3"
                                        )}>
                                            {row.name}
                                            {row.isNew && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">NUEVO</span>}
                                        </td>
                                        <td className={cn("py-2 px-4 text-right tabular-nums", row.isTotal && "font-bold", row.doubleUnderline && "border-b-4 border-double border-gray-800")}>{formatFinancial(row.y1)}</td>
                                        <td className={cn("py-2 px-4 text-right tabular-nums", row.isTotal && "font-bold", row.doubleUnderline && "border-b-4 border-double border-gray-800")}>{formatFinancial(row.y2)}</td>
                                        <td className={cn("py-2 px-4 text-right tabular-nums", row.isTotal && "font-bold", row.doubleUnderline && "border-b-4 border-double border-gray-800")}>{formatFinancial(row.y3)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 border-l-4 border-slate-400 text-slate-700 text-xs font-sans leading-relaxed">
                        <strong>Análisis Diferencial:</strong> La mejora del EBIT en el Año 1 es de <span className="text-green-600 font-bold">+M$ 474.188</span>. Este valor proviene en un 29% de mayores ingresos por disponibilidad y un 71% de eficiencias en costos (ahorro servicios/contingencias).
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


const BudgetDetail = ({ onBack }) => {
    const [showFinancialModal, setShowFinancialModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-codelco-slate p-8 pb-32">
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

                {/* MODAL TRIGGER BUTTON */}
                <div className="flex justify-center mt-12 mb-8">
                    <button
                        onClick={() => setShowFinancialModal(true)}
                        className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-full text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm group"
                    >
                        <FileText size={18} className="text-slate-500 group-hover:text-slate-700" />
                        Ver Detalle EE.RR (3 Años)
                    </button>
                </div>

                {/* FOOTER */}
                <div className="text-center mt-8 text-gray-400 text-xs">
                    <p>Documento Generado Automáticamente por Sistema de Control de Gestión (SCG) • {new Date().toLocaleDateString()}</p>
                </div>

            </motion.div>

            {/* MODAL */}
            <AnimatePresence>
                {showFinancialModal && (
                    <FinancialStatementModal onClose={() => setShowFinancialModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BudgetDetail;
