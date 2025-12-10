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
  Bell,
  Play,
  ChevronDown
} from 'lucide-react'; // <--- Aquí terminan los iconos, sin repetirse
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import BudgetDetail from './BudgetDetail';
import KPIView from './KPIView';
import SimulationView from './SimulationView';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

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

// USERS DATABASE
const USERS_DB = [
  {
    name: "Marcela Illanes",
    email: "marcela@codelco.com",
    pass: "ICG2025",
    role: "Administrador"
  },
  {
    name: "Camilo Alegría",
    email: "camilo@codelco.com",
    pass: "codelco123",
    role: "Administrador"
  },
  {
    name: "Equipo 6",
    email: "equipo6@codelco.com",
    pass: "codelco123",
    role: "Administrador"
  }
];

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

    const foundUser = USERS_DB.find(u => u.email === email && u.pass === password);

    if (foundUser) {
      setLoading(true);
      setMessage('Autenticando con Servidores LDAP...');
      setTimeout(() => {
        onLogin(foundUser);
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
function DashboardLayout({ user, onLogout, onNavigate }) {
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
              onClick={() => onNavigate('budget')}
              className="bg-codelco-orange text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm animate-pulse"
            >
              Ver Desglose Presupuestario
            </button>
            <button
              onClick={() => onNavigate('kpi')}
              className="bg-white/50 backdrop-blur-sm border border-white/40 text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-white/80 transition-colors shadow-sm flexible-glass"
            >
              Ver KPIs Estratégicos
            </button>
            <button
              onClick={() => onNavigate('simulation')}
              className="bg-slate-800 text-white border border-slate-700 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Play size={12} fill="white" />
              Galería de Simulación
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Status: ONLINE
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

              <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 group">
                <div className="w-9 h-9 bg-[#D97828] rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-sm">
                  <span className="font-bold text-xs tracking-wider">{user ? getInitials(user.name) : 'US'}</span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-slate-700 leading-tight group-hover:text-codelco-orange transition-colors">
                    {user ? user.name : 'Usuario'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    {user ? user.role : 'Invitado'}
                  </p>
                </div>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8" ref={dashboardRef}>
          <div className="max-w-7xl mx-auto space-y-12">

            {/* HERO SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6 py-12"
            >
              <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-codelco-orange/20 to-orange-100 mb-2 shadow-inner">
                <div className="bg-codelco-orange rounded-xl w-12 h-12 flex items-center justify-center text-white shadow-lg">
                  <Activity size={24} />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                Modernización IoT: <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-codelco-orange to-orange-600">
                  Molienda SAG & Seguridad Subterránea
                </span>
              </h1>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium">
                Transición Estratégica: De Mantenimiento Reactivo a Predictivo Basado en Condición (CBM)
              </p>

              <GlassCard className="max-w-4xl mx-auto mt-8 border-l-4 border-l-codelco-orange bg-white/60">
                <p className="text-lg text-gray-700 italic font-medium">
                  "Nuestro objetivo es digitalizar los activos críticos para garantizar la continuidad operacional y el cumplimiento del Decreto Supremo N° 28, optimizando el OPEX divisional."
                </p>
              </GlassCard>
            </motion.div>

            {/* STRATEGIC PILLARS */}
            <section>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Pilares de Valor</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <GlassCard delay={0.2} className="hover:shadow-xl transition-all duration-300 group">
                  <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <ShieldCheck className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Seguridad & Normativa</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Reducción de exposición al riesgo y cumplimiento estricto del DS N°28 mediante monitoreo ambiental continuo.
                  </p>
                </GlassCard>

                {/* Card 2 */}
                <GlassCard delay={0.3} className="hover:shadow-xl transition-all duration-300 group">
                  <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                    <Activity className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Continuidad Operacional</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Maximización del OEE y disponibilidad de activos críticos (&gt;99%) a través de detección temprana de fallas.
                  </p>
                </GlassCard>

                {/* Card 3 */}
                <GlassCard delay={0.4} className="hover:shadow-xl transition-all duration-300 group">
                  <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                    <TrendingUp className="text-codelco-orange" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Eficiencia del Gasto</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Reasignación inteligente de recursos: Del gasto correctivo de emergencia a la inversión tecnológica planificada.
                  </p>
                </GlassCard>
              </div>
            </section>

            {/* TEAM SECTION */}
            <section className="pb-12">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Equipo de Innovación & Desarrollo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Bryan Hernández", initials: "BH", role: "Ingeniero Comercial UDP" },
                  { name: "Camilo Alegría", initials: "CA", role: "Ingeniero Comercial UDP" },
                  { name: "Osmán Elgueta", initials: "OE", role: "Ingeniero Comercial UDP" }
                ].map((member, idx) => (
                  <GlassCard key={idx} delay={0.5 + (idx * 0.1)} className="flex items-center gap-4 hover:bg-white/90 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

// --- ROOT APP ---
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'budget'

  const handleNavigation = (targetView) => {
    setView(targetView);
  };

  return (
    <>
      <AnimatePresence mode='wait'>
        {!currentUser ? (
          <motion.div
            key="login"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-50"
          >
            <LoginScreen onLogin={(user) => setCurrentUser(user)} />
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
            <DashboardLayout user={currentUser} onLogout={() => setCurrentUser(null)} onNavigate={handleNavigation} />
          </motion.div>
        ) : view === 'budget' ? (
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
        ) : view === 'kpi' ? (
          <motion.div
            key="kpi"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-40"
          >
            <KPIView onBack={() => setView('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="simulation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-40"
          >
            <SimulationView onBack={() => setView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
