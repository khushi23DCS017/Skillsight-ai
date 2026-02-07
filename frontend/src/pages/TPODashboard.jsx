
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, TrendingUp, Users, Building } from 'lucide-react';

const TPODashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                        <Briefcase className="w-6 h-6" />
                        Placement Cell (TPO)
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            TPO Admin
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-600 transition"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Building className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                        </div>
                        <p className="text-gray-500 text-sm">Active Companies</p>
                        <h3 className="text-2xl font-bold text-gray-800">42</h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">Eligible Students</p>
                        <h3 className="text-2xl font-bold text-gray-800">1,240</h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">Avg. Package</p>
                        <h3 className="text-2xl font-bold text-gray-800">₹8.5 LPA</h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">Upcoming Drives</p>
                        <h3 className="text-2xl font-bold text-gray-800">5</h3>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Placement Drives</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-500 font-bold mr-4">
                                        C{i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">Tech Corporation {i + 1}</h4>
                                        <p className="text-sm text-gray-500">Software Engineer • 12 LPA</p>
                                    </div>
                                    <button className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition">
                                + Schedule New Drive
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition">
                                Broadcast Notification
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition">
                                Manage Company List
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TPODashboard;
