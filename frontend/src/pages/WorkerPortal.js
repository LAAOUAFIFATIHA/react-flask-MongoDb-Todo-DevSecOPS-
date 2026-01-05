import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../AuthContext';
import { Send, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WorkerPortal = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [myTasks, setMyTasks] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('join_scan', { scan_id: id, username: user.username });

        socketRef.current.on('task_status_updated', (data) => {
            setMyTasks(prev => prev.map(t => t._id === data.task_id ? { ...t, status: data.status } : t));
        });

        return () => socketRef.current.disconnect();
    }, [id, user.username]);

    const submitTask = (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const tempId = Math.random().toString(36);
        const newTask = {
            scan_id: id,
            content,
            author: user.username,
            _id: tempId, // Temporary ID for UI tracking until server responds
            status: 'pending'
        };

        socketRef.current.emit('submit_task', newTask);

        // In a real app, the server would confirm. Here we trust the broadcast or wait.
        // For better UX, we'll watch the broadcast.
        socketRef.current.on('task_received', (serverTask) => {
            if (serverTask.author === user.username && !myTasks.find(t => t._id === serverTask._id)) {
                setMyTasks(prev => [serverTask, ...prev]);
            }
        });

        setContent('');
    };

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col gap-8">
            <header className="flex items-center gap-4 py-4 border-b border-slate-800">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                    <ShieldCheck className="text-pink-400 w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Worker Portal</h1>
                    <p className="text-xs text-slate-400 uppercase">Session: {id.substring(0, 8)}</p>
                </div>
            </header>

            <form onSubmit={submitTask} className="glass-card p-6 space-y-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    Submit new task suggestion
                </label>
                <textarea
                    className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-pink-500 transition-all text-lg"
                    placeholder="Describe the task or observation..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit" className="enterprise-btn bg-pink-600 hover:bg-pink-500 w-full justify-center py-4 text-lg">
                    <Send className="w-5 h-5" /> Submit to Analytics
                </button>
            </form>

            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> My Submissions
                </h3>
                <AnimatePresence>
                    {myTasks.map(task => (
                        <motion.div
                            key={task._id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between"
                        >
                            <p className="truncate mr-4 text-slate-300">{task.content}</p>
                            <div className="flex-shrink-0">
                                {task.status === 'pending' && <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />}
                                {task.status === 'validated' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                {task.status === 'refused' && <XCircle className="w-5 h-5 text-red-500" />}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default WorkerPortal;
