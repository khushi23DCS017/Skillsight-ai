import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, GraduationCap, Briefcase } from 'lucide-react';
const Login = ({ onLogin }) => {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const roleConfig = {
        student: { label: 'Student', icon: <GraduationCap className="w-16 h-16 text-blue-600" />, color: 'blue' },
        faculty: { label: 'Faculty', icon: <User className="w-16 h-16 text-purple-600" />, color: 'purple' },
        tpo: { label: 'TPO', icon: <Briefcase className="w-16 h-16 text-orange-600" />, color: 'orange' },
        admin: { label: 'Admin', icon: <Lock className="w-16 h-16 text-red-600" />, color: 'red' }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Check if the user's actual role matches the selected role
                if (data.user.role !== role) {
                    setError(`Access denied. You are not registered as a ${roleConfig[role].label}.`);
                    setLoading(false);
                    return;
                }

                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (onLogin) onLogin(data.user);

                // Redirect based on role
                switch (data.user.role) {
                    case 'student': navigate('/student'); break;
                    case 'faculty': navigate('/faculty'); break;
                    case 'admin': navigate('/admin'); break;
                    case 'tpo': navigate('/tpo'); break;
                    default: navigate('/student');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const activeColor = roleConfig[role].color;

    return (
        <div className={`min-h-screen bg-gradient-to-br from-${activeColor}-600/90 to-slate-800 flex items-center justify-center p-4 transition-colors duration-500`}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">

                {/* Role Tabs */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-8 overflow-hidden">
                    {Object.keys(roleConfig).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${role === r
                                ? 'bg-white shadow text-gray-800'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {roleConfig[r].label}
                        </button>
                    ))}
                </div>

                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4 transition-transform duration-300 transform hover:scale-110">
                        {roleConfig[role].icon}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Log in to <span className={`text-${activeColor}-600`}>{roleConfig[role].label} Portal</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${activeColor}-500 focus:border-${activeColor}-500 transition-all`}
                                placeholder={`name@college.${role === 'student' ? 'edu' : 'ac'}.in`}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${activeColor}-500 focus:border-${activeColor}-500 transition-all`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                        style={{ backgroundColor: role === 'student' ? '#2563eb' : role === 'faculty' ? '#9333ea' : role === 'tpo' ? '#ea580c' : '#dc2626' }}
                    >
                        {loading ? 'Authenticating...' : `Login as ${roleConfig[role].label}`}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className={`text-${activeColor}-600 hover:text-${activeColor}-700 font-semibold hover:underline`}>
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
