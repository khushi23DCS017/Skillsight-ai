import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Award, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PasswordGate = ({ onAuthenticate }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await response.json();

            if (response.ok && data.authenticated) {
                onAuthenticate();
            } else {
                setError('Invalid password. Default password is "admin123"');
            }
        } catch (err) {
            setError('Failed to connect to backend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <div className="flex items-center justify-center mb-6">
                    <Lock className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">T&P Dashboard Access</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter dashboard password"
                            required
                        />
                    </div>
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-500 text-center">
                    For faculty and T&P officers only
                </p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/analytics/dashboard');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading analytics...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">Failed to load dashboard data</div>
            </div>
        );
    }

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">T&P Analytics Dashboard</h1>
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Student View
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Placement Rate</p>
                                <p className="text-3xl font-bold text-blue-600">{data.placement_rate}%</p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Avg Salary</p>
                                <p className="text-3xl font-bold text-green-600">₹{(data.avg_salary / 100000).toFixed(1)}L</p>
                            </div>
                            <DollarSign className="w-10 h-10 text-green-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Students</p>
                                <p className="text-3xl font-bold text-purple-600">{data.total_students}</p>
                            </div>
                            <Users className="w-10 h-10 text-purple-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Placed Students</p>
                                <p className="text-3xl font-bold text-orange-600">{data.placed_students}</p>
                            </div>
                            <Award className="w-10 h-10 text-orange-500 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Branch-wise Placement */}
                    {data.branch_wise && data.branch_wise.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Branch-wise Placement Rate</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.branch_wise}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="branch" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="rate" fill="#3B82F6" name="Placement %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Top Skills */}
                    {data.top_skills && data.top_skills.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Skills in Demand</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.top_skills} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="skill" type="category" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#10B981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Salary Distribution */}
                    {data.salary_distribution && data.salary_distribution.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Salary Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data.salary_distribution}
                                        dataKey="count"
                                        nameKey="range"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {data.salary_distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Skill Gap Heatmap Preview */}
                    {data.skill_gaps && data.skill_gaps.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Skill Coverage by Branch</h3>
                            <div className="space-y-3">
                                {data.skill_gaps.slice(0, 6).map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">{item.branch} - {item.skill}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${item.coverage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-600 w-12">{item.coverage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const DashboardWithAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);

    if (!authenticated) {
        return <PasswordGate onAuthenticate={() => setAuthenticated(true)} />;
    }

    return <Dashboard />;
};

export default DashboardWithAuth;
