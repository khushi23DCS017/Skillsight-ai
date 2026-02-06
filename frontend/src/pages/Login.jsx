import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, GraduationCap } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                // Store token and user info
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (onLogin) onLogin(data.user);

                // Redirect based on role
                if (data.user.role === 'faculty') {
                    navigate('/faculty');
                } else {
                    navigate('/student');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                    <button
                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${role === 'student' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setRole('student')}
                    >
                        Student
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${role === 'faculty' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setRole('faculty')}
                    >
                        Faculty
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        {role === 'student' ? (
                            <GraduationCap className="w-16 h-16 text-blue-600" />
                        ) : (
                            <User className="w-16 h-16 text-purple-600" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">SkillSight AI</h1>
                    <p className="text-gray-600 mt-2">{role === 'student' ? 'Student Portal Login' : 'Faculty Portal Login'}</p>
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={role === 'student' ? "student@college.edu" : "faculty@college.edu"}
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${role === 'student' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        {role === 'student' ? (
                            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                Register as Student
                            </Link>
                        ) : (
                            <Link to="/register-faculty" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                                Register as Faculty
                            </Link>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
