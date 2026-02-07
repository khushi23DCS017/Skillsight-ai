import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Domain Validation
        const email = formData.email.toLowerCase();
        if (formData.role === 'student' && !email.endsWith('.edu.in')) {
            setError('Student email must end with .edu.in');
            setLoading(false);
            return;
        }
        if (['faculty', 'admin', 'tpo'].includes(formData.role) && !email.endsWith('.ac.in')) {
            setError(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} email must end with .ac.in`);
            setLoading(false);
            return;
        }

        try {
            // Register user
            const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                setError(registerData.error || 'Registration failed');
                setLoading(false);
                return;
            }

            // Login to get token
            const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                localStorage.setItem('token', loginData.access_token);
                localStorage.setItem('user', JSON.stringify(loginData.user));

                // If student, create profile. Others skip for now (or need separate profile flow)
                if (formData.role === 'student') {
                    const profileResponse = await fetch('http://localhost:5000/api/students', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${loginData.access_token}`
                        },
                        body: JSON.stringify({
                            user_id: loginData.user.id,
                            name: formData.name,
                            branch: 'General',
                            cgpa: 0.0,
                            tenth_marks: 0.0,
                            twelfth_marks: 0.0,
                            internships: 0,
                            projects: 0,
                            skills: []
                        })
                    });

                    if (!profileResponse.ok) {
                        const profileError = await profileResponse.json();
                        setError("Account created but profile failed: " + (profileError.error || "Unknown error"));
                        setLoading(false);
                        return;
                    }
                }

                // Redirect based on role
                switch (formData.role) {
                    case 'student': navigate('/student'); break;
                    case 'faculty': navigate('/faculty'); break;
                    case 'admin': navigate('/admin'); break;
                    case 'tpo': navigate('/tpo'); break;
                    default: navigate('/login');
                }
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
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                        <GraduationCap className="w-12 h-12 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-600 text-sm mt-1">Join SkillSight AI</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="tpo">Training & Placement Officer (TPO)</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={formData.role === 'student' ? "student@college.edu.in" : "staff@college.ac.in"}
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.role === 'student' ? 'Must end with .edu.in' : 'Must end with .ac.in'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
