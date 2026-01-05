import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Lock, User, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('worker'); // Default for registration
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isRegister ? '/register' : '/login';
        try {
            const res = await axios.post(`http://localhost:5000${endpoint}`, {
                username, password, role
            });

            if (isRegister) {
                setIsRegister(false);
                alert('Registration successful! Please login.');
            } else {
                login(res.data);
                navigate(res.data.role === 'admin' ? '/admin' : '/admin'); // Simplified for now
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="glass-card p-8 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-indigo-500/20 rounded-full">
                        <ShieldCheck className="w-10 h-10 text-indigo-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-8">
                    {isRegister ? 'Create Enterprise Account' : 'Enterprise Secure Login'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {isRegister && (
                        <select
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 outline-none"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="worker">Worker</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button type="submit" className="enterprise-btn btn-primary w-full justify-center py-3 mt-4">
                        {isRegister ? 'Register' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="ml-2 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
