import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../AuthContext';
import { Check, X, Users, MessageSquare, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminScanView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [workerCount, setWorkerCount] = useState(0);
    const [layoutMode, setLayoutMode] = useState('grid'); // grid or list
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('join_scan', { scan_id: id, username: user.username });

        socketRef.current.on('task_received', (newTask) => {
            setTasks(prev => [newTask, ...prev]);
        });

        socketRef.current.on('user_joined', () => {
            setWorkerCount(c => c + 1);
        });

        socketRef.current.on('task_status_updated', (data) => {
            setTasks(prev => prev.map(t => t._id === data.task_id ? { ...t, status: data.status } : t));
        });

        return () => socketRef.current.disconnect();
    }, [id, user.username]);

    const handleAction = (task_id, status) => {
        socketRef.current.emit('update_task_status', { task_id, status, scan_id: id });
    };

    // Dynamic Sizing Logic
    // As tasks increase, we reduce the base width of cards
    const getCardWidth = () => {
        if (tasks.length > 20) return '150px';
        if (tasks.length > 10) return '250px';
        return '350px';
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#0a0f1d]">
            {/* Real-time Status Bar */}
            <header className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center backdrop-blur-md z-10">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            Live Scan: {id.substring(0, 8)}...
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        </h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                            <Users className="w-3 h-3" /> {workerCount} Workers Connected
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setLayoutMode('grid')}
                            className={`p-2 rounded-md ${layoutMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setLayoutMode('list')}
                            className={`p-2 rounded-md ${layoutMode === 'list' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Real-time Streaming Area */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div
                    className={`dynamic-grid ${tasks.length > 12 ? 'grid-dense' : ''}`}
                    style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${getCardWidth()}, 1fr))` }}
                >
                    <AnimatePresence>
                        {tasks.map((task) => (
                            <motion.div
                                key={task._id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className={`task-card glass-card relative group ${task.status !== 'pending' ? 'opacity-60' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                                        {task.author.toUpperCase()}
                                    </span>
                                    <span className={`status-badge status-${task.status}`}>
                                        {task.status}
                                    </span>
                                </div>

                                <p className="text-lg font-medium leading-relaxed mb-6 flex-1">
                                    {task.content}
                                </p>

                                <div className="flex gap-2 mt-auto">
                                    {task.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(task._id, 'validated')}
                                                className="flex-1 enterprise-btn bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white"
                                            >
                                                <Check className="w-4 h-4" /> Validate
                                            </button>
                                            <button
                                                onClick={() => handleAction(task._id, 'refused')}
                                                className="flex-1 enterprise-btn bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                                            >
                                                <X className="w-4 h-4" /> Refuse
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MessageSquare className="w-4 h-4 text-slate-500" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {tasks.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                        <div className="w-20 h-20 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-xl">Waiting for task suggestions...</p>
                        <p className="text-sm opacity-60">Share the link with workers to begin</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminScanView;
