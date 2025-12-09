import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
  Cell
} from 'recharts';
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  PieChart as PieChartIcon,
  Download,
  Cpu,
  Wifi,
  Wind,
  Lock,
  User,
  LogOut,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import BudgetDetail from './BudgetDetail';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// DATASET (HARDCODED)
const financialData = {
  kpis: {
    capex: "M$ 70.210",
    netSavings: "M$ 348.515",
    totalBudgetReduction: "3.5%",
    roi: "> 15%"
  },
  scenarios: [
    {
      category: "1. Dotación Propia",
      current: 1564731,
      future: 1564731,
      variation: 0,
      note: "Estructura fija se mantiene"
    },
    {
      category: "2. Servicios de Terceros",
      current: 6257442,
      future: 5944570,
      variation: -312872,
      note: "Impacto por mejor planificación (-5%)"
    },
    {
      category: "3. Materiales y Repuestos",
      current: 1808100,
      future: 1771938,
      variation: -36162,
      note: "Menor daño colateral (-2%)"
    },
    {
      category: "4. Tecnología IoT (Nuevo)",
      current: 0,
      future: 35047,
      variation: 35047,
      note: "Costo de la Innovación (Licencias + Depreciación)"
    },
    {
      category: "5. Contingencias y Logística",
      current: 194227,
      future: 159699,
      variation: -34528,
      note: "Reducción drástica urgencias (-17.8%)"
    }
  ]
};

// --- SHARED COMPONENTS ---
const GlassCard = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden",
      className
    )}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-codelco-orange/50 to-transparent opacity-50" />
    {children}
  </motion.div>
);

const Badge = ({ children, type = 'neutral' }) => {
  const styles = {
    success: 'bg-green-100/80 text-green-700 border-green-200',
    warning: 'bg-yellow-100/80 text-yellow-700 border-yellow-200',
    danger: 'bg-red-100/80 text-red-700 border-red-200',
    neutral: 'bg-gray-100/80 text-gray-700 border-gray-200',
    orange: 'bg-orange-100/80 text-orange-800 border-orange-200'
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm", styles[type])}>
      {children}
    </span>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, trend, delay, isOptimized }) => (
  <GlassCard delay={delay} className="flex flex-col justify-between h-full relative group hover:shadow-2xl transition-all duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <AnimatePresence mode='wait'>
          <motion.h3
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-3xl font-bold text-codelco-slate mb-1 tracking-tight"
          >
            {value}
          </motion.h3>
        </AnimatePresence>
      </div>
      <div className={cn(
        "p-3 rounded-xl transition-colors",
        trend === 'positive' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
      )}>
        <Icon size={24} />
      </div>
    </div>
    {subtext && (
      <div className="mt-4 flex items-center gap-2">
        <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", trend === 'positive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
          {trend === 'positive' ? '▲' : '▬'}
        </span>
        <p className="text-xs font-medium text-gray-500">{subtext}</p>
      </div>
    )}
  </GlassCard>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-codelco-slate/95 backdrop-blur-md text-white p-3 rounded-lg shadow-2xl border border-gray-700">
        <p className="text-sm font-bold mb-1 border-b border-gray-600 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs py-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="opacity-80">{entry.name}:</span>
            <span className="font-mono font-bold">M$ {entry.value.toLocaleString('es-CL')}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- LOGIN SCREEN COMPONENT ---
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(false);

    if (email === 'marcela@codelco.com' && password === 'ICG2025') {
      setLoading(true);
      setMessage('Autenticando con Servidores LDAP...');
      setTimeout(() => {
        onLogin();
      }, 1500);
    } else {
      setError(true);
      setMessage('Credenciales Inválidas. Intente nuevamente.');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-codelco-slate flex items-center justify-center p-4 relative overflow-hidden">
      {/* Industrial Background Elements */}
      <div className="absolute opacity-10 w-full h-full bg-[repeating-linear-gradient(45deg,#000_25px,#000_50px,#111_50px,#111_75px)]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-codelco-orange to-red-500"></div>

          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-codelco-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-bold text-3xl">C</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-1">Acceso Restringido</h2>
          <p className="text-gray-400 text-center text-sm mb-8">Sistema de Monitoreo IoT Industrial</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 block">Usuario Corporativo</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-codelco-slate/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-codelco-orange focus:ring-1 focus:ring-codelco-orange transition-all"
                  placeholder="nombre@codelco.com"
                />
              </div>
            </motion.div>

            <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-codelco-slate/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-codelco-orange focus:ring-1 focus:ring-codelco-orange transition-all"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full bg-gradient-to-r from-codelco-orange to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2",
                  loading ? "opacity-80 cursor-wait" : "hover:scale-[1.02]"
                )}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Ingresar al Sistema</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {(error || loading) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("mt-4 p-3 rounded-lg text-xs text-center font-medium", error ? "bg-red-500/20 text-red-200" : "bg-blue-500/20 text-blue-200")}
            >
              {message}
            </motion.div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] text-gray-500 max-w-[280px] mx-auto leading-relaxed">
              Este sistema es para uso exclusivo de personal autorizado de División San Lorenzo. El acceso es monitoreado y auditado.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- DASHBOARD LAYOUT COMPONENT ---
function DashboardLayout({ onLogout, onNavigate }) {
  const [isOptimized, setIsOptimized] = useState(false);
  const [sensorData, setSensorData] = useState({
    vibration: 2.4,
    co2: 12
  });
  const [eventLog, setEventLog] = useState([
    { time: new Date().toLocaleTimeString(), msg: "Sistema Iniciado - Conexión Segura" }
  ]);
  const dashboardRef = useRef(null);
  const logEndRef = useRef(null);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Update Sensors
      const newVib = Number((Math.max(2.1, Math.min(4.9, sensorData.vibration + (Math.random() - 0.5) * 0.8))).toFixed(1));
      const newCo2 = Math.floor(Math.max(10, Math.min(50, sensorData.co2 + (Math.random() - 0.5) * 10)));

      setSensorData({ vibration: newVib, co2: newCo2 });

      // Push Random Events
      if (Math.random() > 0.7) {
        const events = [
          `Sensor S-402: Vibración Normal (${newVib}mm/s)`,
          `Túnel N2: Calidad Aire Estable`,
          `Gateway IoT: Paquete recibido (12ms)`,
          `Alerta: Temperatura Túnel B subiendo`,
          `Sync: Datos financieros actualizados`,
          `Molino SAG: Potencia nominal`
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setEventLog(prev => [...prev.slice(-6), { time: new Date().toLocaleTimeString(), msg: randomEvent }]);
      }

    }, 2000);
    return () => clearInterval(interval);
  }, [sensorData]);

  // Auto-scroll Logs
  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [eventLog]);


  const downloadPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Reporte_Confidencial_IoT.pdf');
  };

  const totalCurrent = financialData.scenarios.reduce((acc, curr) => acc + curr.current, 0);
  const totalFuture = financialData.scenarios.reduce((acc, curr) => acc + curr.future, 0);
  const totalSavings = totalCurrent - totalFuture;

  const displayBudget = isOptimized ? totalFuture : totalCurrent;

  // Data for Charts
  const comparisonData = financialData.scenarios
    .filter(item => item.current > 0 || item.future > 0)
    .map(item => ({
      name: item.category.split('.')[1].trim(),
      Actual: item.current,
      Proyectado: item.future,
    }));

  const formatMoney = (val) => `M$ ${Math.round(val).toLocaleString('es-CL')}`;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-codelco-slate flex overflow-hidden">

      {/* SIDEBAR - Live Sensors & Logs */}
      <aside className="w-72 bg-codelco-slate text-white flex-shrink-0 relative overflow-hidden z-20 shadow-2xl hidden lg:flex flex-col">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-5 mix-blend-overlay"></div>

        {/* Sidebar Content */}
        <div className="p-6 relative z-10 flex flex-col h-full">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-codelco-orange rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">C</div>
            <div>
              <span className="font-bold text-lg tracking-wide block leading-none">CODELCO</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Div. San Lorenzo</span>
            </div>
          </div>

          <div className="space-y-6">

            {/* Sensors Widget */}
            <div>
              <h4 className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-3 flex items-center gap-2">
                <Activity size={12} className="text-codelco-orange" />
                Monitoreo Activo
              </h4>

              <div className="space-y-3">
                <div className="bg-white/5 backdrop-blur rounded border border-white/10 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-300">Molino SAG (Vib)</span>
                    <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", sensorData.vibration > 4 ? "bg-red-500" : "bg-green-500")}></span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-mono font-bold">{sensorData.vibration}</span>
                    <span className="text-[10px] text-gray-500 mb-1">mm/s</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1 mt-1 rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full", sensorData.vibration > 4 ? "bg-red-500" : "bg-codelco-orange")}
                      animate={{ width: `${(sensorData.vibration / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur rounded border border-white/10 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-300">Túnel N2 (CO2)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-mono font-bold">{sensorData.co2}</span>
                    <span className="text-[10px] text-gray-500 mb-1">ppm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Log Widget */}
            <div className="flex-1 min-h-[200px] flex flex-col">
              <h4 className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-2 flex items-center gap-2">
                <Bell size={12} className="text-blue-400" />
                Live Event Log
              </h4>
              <div className="bg-black/20 rounded-lg p-3 font-mono text-[10px] text-gray-300 overflow-y-auto max-h-[250px] space-y-2 border border-white/5 shadow-inner">
                {eventLog.map((log, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx}
                    className="border-l-2 border-gray-600 pl-2 py-0.5"
                  >
                    <span className="text-gray-500">[{log.time}]</span> <span className={log.msg.includes('Alerta') ? 'text-red-400 font-bold' : 'text-gray-300'}>{log.msg}</span>
                  </motion.div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

          </div>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button onClick={onLogout} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-full p-2 hover:bg-white/5 rounded">
              <LogOut size={14} />
              <span>Cerrar Sesión Segura</span>
            </button>
          </div>
        </div>
      </aside>

      {/* DASHBOARD BODY */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* ADMIN TOP BAR */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 bg-codelco-orange rounded text-white flex items-center justify-center font-bold">C</div>
            <h2 className="font-bold text-gray-700 hidden sm:block">Centro de Control Operacional</h2>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onNavigate}
              className="bg-codelco-orange text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm animate-pulse"
            >
              Ver Desglose Presupuestario
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Status: ONLINE
            </div>

            <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">Marcela Illanes</p>
                <p className="text-[10px] text-gray-500 font-medium">Perfil: Administrador</p>
              </div>
              <div className="w-10 h-10 bg-codelco-slate rounded-full flex items-center justify-center text-white border-2 border-gray-200 shadow-sm">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8" ref={dashboardRef}>
          <div className="max-w-7xl mx-auto space-y-8">

            {/* PAGE HEADER & CONTROLS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-codelco-slate to-gray-600">
                  Vista Ejecutiva: Rentabilidad IoT
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-600" />
                  Datos Confidenciales - Actualizado: {new Date().toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* TOGGLE */}
                <div className="bg-white rounded-lg p-1 border border-gray-200 shadow-sm flex items-center h-10">
                  <button
                    onClick={() => setIsOptimized(false)}
                    className={cn("px-4 h-full text-xs font-bold rounded-md transition-all", !isOptimized ? "bg-codelco-slate text-white shadow" : "text-gray-500 hover:bg-gray-50")}
                  >
                    Escenario Actual
                  </button>
                  <button
                    onClick={() => setIsOptimized(true)}
                    className={cn("px-4 h-full text-xs font-bold rounded-md transition-all", isOptimized ? "bg-codelco-orange text-white shadow" : "text-gray-500 hover:bg-gray-50")}
                  >
                    Optimizado IoT
                  </button>
                </div>

                <button
                  onClick={downloadPDF}
                  className="bg-white border border-gray-200 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors"
                  title="Exportar PDF"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* KPIS */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Presupuesto Anual"
                value={formatMoney(displayBudget)}
                icon={AlertTriangle}
                subtext="Opex Proyectado"
                delay={0.1}
                isOptimized={isOptimized}
              />
              <StatCard
                title="Ahorro Potencial"
                value={formatMoney(isOptimized ? totalSavings : 0)}
                icon={TrendingDown}
                subtext={isOptimized ? "Capturado" : "Latente"}
                trend="positive"
                delay={0.2}
              />
              <StatCard
                title="ROI Estimado"
                value={financialData.kpis.roi}
                icon={DollarSign}
                subtext="Payback < 12 Meses"
                trend="positive"
                delay={0.3}
              />
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <GlassCard delay={0.4} className="h-full bg-gradient-to-br from-codelco-orange/90 to-orange-600 text-white border-none p-4 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <p className="text-xs font-medium text-white/80 mb-1">Dictamen Financiero</p>
                  <p className="text-xl font-bold mb-2">Proyecto Aprobado</p>
                  <div className="inline-flex items-center gap-1 bg-white/20 self-start px-2 py-1 rounded text-[10px] font-bold">
                    <CheckCircle2 size={10} /> VIABLE
                  </div>
                </GlassCard>
              </div>
            </section>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CHART 1 */}
              <GlassCard className="lg:col-span-2 min-h-[380px]" delay={0.5}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Análisis de Variación de Costos</h3>
                    <p className="text-xs text-gray-500">Impacto en Servicios y Mantenimiento</p>
                  </div>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={comparisonData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }} layout="vertical">
                      <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#D97828" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="#D97828" stopOpacity={0.9} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Actual" barSize={8} radius={[0, 4, 4, 0]} fill="#cbd5e1" stackId="a" />
                      <Bar dataKey="Proyectado" barSize={8} radius={[0, 4, 4, 0]} fill="url(#colorBar)" stackId="b">
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'Tecnología IoT' ? '#ef4444' : '#D97828'} />
                        ))}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* CHART 2: STRATEGY */}
              <GlassCard delay={0.6} className="bg-codelco-slate text-white border-gray-700 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="text-yellow-400" size={20} />
                  <h3 className="text-base font-bold">Smart Strategy</h3>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <TrendingDown size={16} className="text-green-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-200">Reducción Reactiva</p>
                      <p className="text-[10px] text-gray-400 leading-snug mt-1">
                        Menos gastos en urgencias y logística aérea no planificada.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <Cpu size={16} className="text-codelco-orange mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-200">Inversión Inteligente</p>
                      <p className="text-[10px] text-gray-400 leading-snug mt-1">
                        El costo de licencias IoT es marginal comparado con el ahorro estructural.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Confianza del Modelo</span>
                    <span className="text-green-400">98.5%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[98.5%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* TABLE */}
            <GlassCard delay={0.7} className="overflow-hidden p-0">
              <div className="px-6 py-4 border-b border-gray-100/50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800">Desglose Financiero Oficial</h3>
                <Badge type="neutral">Confidencial</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-gray-500 font-semibold bg-gray-50/30 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3">Categoría</th>
                      <th className="px-6 py-3 text-right">Escenario Actual</th>
                      <th className="px-6 py-3 text-right">Escenario IoT</th>
                      <th className="px-6 py-3 text-right">Delta</th>
                      <th className="px-6 py-3 text-right">Impacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {financialData.scenarios.map((row, index) => {
                      const isNegative = row.variation < 0;
                      const percent = row.current ? ((row.variation / row.current) * 100).toFixed(1) : (row.variation > 0 ? '+100' : '0');
                      return (
                        <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-3.5 font-medium text-gray-700">{row.category}</td>
                          <td className="px-6 py-3.5 text-right tabular-nums text-gray-500">{row.current.toLocaleString('es-CL')}</td>
                          <td className="px-6 py-3.5 text-right tabular-nums font-bold text-gray-800">{row.future.toLocaleString('es-CL')}</td>
                          <td className={cn("px-6 py-3.5 text-right tabular-nums font-bold", isNegative ? "text-green-600 bg-green-50/30 rounded" : row.variation > 0 ? "text-red-500 bg-red-50/30 rounded" : "text-gray-400")}>
                            {row.variation > 0 ? "+" : ""}{row.variation.toLocaleString('es-CL')}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", isNegative ? "bg-green-100 text-green-700" : row.variation > 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500")}>
                              {percent}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>

          </div>
        </main>
      </div>
    </div>
  );
}

// --- ROOT APP ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'budget'

  const handleNavigation = () => {
    setView('budget');
  };

  return (
    <>
      <AnimatePresence mode='wait'>
        {!isAuthenticated ? (
          <motion.div
            key="login"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-50"
          >
            <LoginScreen onLogin={() => setIsAuthenticated(true)} />
          </motion.div>
        ) : view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <DashboardLayout onLogout={() => setIsAuthenticated(false)} onNavigate={handleNavigation} />
          </motion.div>
        ) : (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-40"
          >
            <BudgetDetail onBack={() => setView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
