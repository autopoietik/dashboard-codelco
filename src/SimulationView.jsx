import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, X, Maximize2, Activity, Wifi, Wind, Server } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// IMPORT REAL MEDIA
import sensorVid from './assets/simulation/instalacion_sensor_sag.mp4';
import airImg from './assets/simulation/gateway.png';
import gatewayVid from './assets/simulation/chancado.mp4';
import controlVid from './assets/simulation/operadores.mp4';

// HARDCODED MEDIA DATASET
const mediaItems = [
    {
        id: 1,
        title: "Instalación Sensor Vibración - Molino SAG",
        desc: "Visualización del sensor IP67 montado en la carcasa del estator, transmitiendo telemetría de vibración en tiempo real.",
        type: "video",
        media: sensorVid,
        icon: Activity,
        badge: "LIVE"
    },
    {
        id: 2,
        title: "Monitoreo Calidad de Aire - Túnel Nivel 2",
        desc: "Simulación de dispersión de gases (NOx) y activación de ventilación automática según Decreto Supremo 28.",
        type: "image",
        media: airImg,
        icon: Wind,
        badge: "REC"
    },
    {
        id: 3,
        title: "Gateway LoRaWAN - Zona Chancado",
        desc: "Nodo de comunicación industrial con redundancia LTE operando en condiciones de alta polución.",
        type: "video",
        media: gatewayVid,
        icon: Wifi,
        badge: "LIVE"
    },
    {
        id: 4,
        title: "Centro de Control Integrado",
        desc: "Operadores analizando alertas predictivas en el Dashboard Corporativo.",
        type: "video",
        media: controlVid,
        icon: Server,
        badge: "REC"
    }
];

const SimulationView = ({ onBack }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 md:p-8 overflow-y-auto relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-codelco-orange/10 via-slate-900 to-slate-950 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors border border-white/10"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Galería de Simulación
                            </h1>
                            <p className="text-xs text-gray-400 tracking-wider uppercase font-medium">Gemelo Digital &bull; División San Lorenzo</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 bg-codelco-orange/20 text-codelco-orange px-3 py-1.5 rounded-full text-xs font-bold border border-codelco-orange/30">
                        <Play size={14} fill="currentColor" />
                        <span>Renderizado en Tiempo Real</span>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                    {mediaItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            layoutId={`card-${item.id}`}
                            onClick={() => setSelectedItem(item)}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl cursor-pointer border border-white/10 shadow-2xl bg-slate-800/50",
                                idx === 0 || idx === 3 ? "md:col-span-2" : ""
                            )}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            {/* Media Content */}
                            {item.type === 'video' ? (
                                <video
                                    src={item.media}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={item.media}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                                />
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold tracking-widest border",
                                        item.badge === 'LIVE'
                                            ? "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse"
                                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                    )}>
                                        {item.badge}
                                    </span>
                                    <item.icon size={14} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-codelco-orange transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                                    <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Play Button */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 border border-white/20">
                                {item.type === 'video' ? <Play size={32} className="text-white ml-1" fill="white" /> : <Maximize2 size={28} className="text-white" />}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modal Overlay */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl"
                            onClick={() => setSelectedItem(null)} // Close on backdrop click
                        >
                            <motion.div
                                layoutId={`card-${selectedItem.id}`}
                                className="bg-slate-900 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
                                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                            >
                                {/* Media Section */}
                                <div className="md:w-3/4 relative bg-black flex items-center justify-center group">
                                    {selectedItem.type === 'video' ? (
                                        <video
                                            src={selectedItem.media}
                                            className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
                                            autoPlay
                                            loop
                                            controls
                                        />
                                    ) : (
                                        <img
                                            src={selectedItem.media}
                                            alt={selectedItem.title}
                                            className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
                                        />
                                    )}
                                    {/* Fake Play Controls for Video */}
                                    {selectedItem.type === 'video' && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Play size={20} fill="white" />
                                            <div className="w-64 h-1 bg-white/30 rounded-full">
                                                <div className="w-1/3 h-full bg-codelco-orange rounded-full"></div>
                                            </div>
                                            <span className="text-xs font-mono">00:34 / 02:15</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors md:hidden"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Details Section */}
                                <div className="md:w-1/4 p-8 border-l border-white/5 bg-slate-800/50 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded text-xs font-bold tracking-widest border",
                                            selectedItem.badge === 'LIVE'
                                                ? "bg-red-500/20 text-red-500 border-red-500/30"
                                                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                        )}>
                                            {selectedItem.badge}
                                        </span>
                                        <button
                                            onClick={() => setSelectedItem(null)}
                                            className="text-gray-400 hover:text-white transition-colors hidden md:block"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{selectedItem.title}</h2>

                                    <div className="w-10 h-1 bg-codelco-orange rounded-full mb-6"></div>

                                    <p className="text-gray-300 text-sm leading-relaxed mb-8">
                                        {selectedItem.desc}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                            <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Fuente de Datos</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Server size={14} className="text-codelco-orange" />
                                                <span>IoT Hub Primary Node</span>
                                            </div>
                                        </div>

                                        <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <Maximize2 size={16} />
                                            <span>Ver Logs Técnicos</span>
                                        </button>
                                    </div>
                                </div>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default SimulationView;
