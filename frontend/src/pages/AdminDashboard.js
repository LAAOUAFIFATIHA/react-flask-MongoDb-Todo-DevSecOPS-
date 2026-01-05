import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Plus, Play, History, Shield, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const [scans, setScans] = useState([]);
    const [scanName, setScanName] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchScans();
    }, []);

    const fetchScans = async () => {
        try {
            const res = await axios.get('http://localhost:5000/scans', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setScans(res.data);
        } catch (err) {
            console.error("Failed to fetch scans");
        }
    };

    const createScan = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/scans', { name: scanName || 'New Scan' }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setScanName('');
            fetchScans();
            navigate(`/admin/scan/${res.data.scan_id}`);
        } catch (err) {
            alert('Failed to create scan');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <Shield className="text-indigo-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Admin Console</h1>
                        <p className="text-slate-400">Welcome back, {user.username}</p>
                    </div>
                </div>
                <button onClick={logout} className="enterprise-btn bg-slate-800 hover:bg-slate-700 text-slate-300">
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2 glass-card p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-400" /> Recent Scans
                    </h2>
                    <div className="space-y-4">
                        {scans.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No active scans found.</p>
                        ) : (
                            scans.map(scan => (
                                <div key={scan._id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
                                    <div>
                                        <h3 className="font-semibold text-lg">{scan.name}</h3>
                                        <p className="text-sm text-slate-400">{new Date(scan.created_at).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/admin/scan/${scan._id}`)}
                                        className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/40"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-card p-6 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-indigo-400" /> New Scan
                    </h2>
                    <form onSubmit={createScan} className="space-y-4">
                        <input
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Scan Label (e.g. Morning Review)"
                            value={scanName}
                            onChange={(e) => setScanName(e.target.value)}
                        />
                        <button type="submit" className="enterprise-btn btn-primary w-full justify-center">
                            Launch Scan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
