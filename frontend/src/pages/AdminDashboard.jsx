
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, Settings, Database, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, students: 0, faculty: 0 });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Settings className="w-6 h-6 text-blue-400" />
                        Admin Portal
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button className="flex items-center w-full px-4 py-3 text-left bg-slate-800 rounded-lg text-blue-400 font-medium">
                        <Activity className="w-5 h-5 mr-3" />
                        Overview
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-left hover:bg-slate-800 rounded-lg transition text-slate-300">
                        <Users className="w-5 h-5 mr-3" />
                        User Management
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-left hover:bg-slate-800 rounded-lg transition text-slate-300">
                        <Database className="w-5 h-5 mr-3" />
                        System Logs
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 mb-1 font-medium">System Status</p>
                        <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            Operational
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Admin Controls</h3>
                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                        Advanced system configurations and user management tools will be implemented here.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
