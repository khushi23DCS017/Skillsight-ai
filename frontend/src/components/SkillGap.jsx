
import React, { useState, useEffect } from 'react';
import { Target, Users, BookOpen, CheckCircle, AlertCircle, Briefcase, TrendingUp } from 'lucide-react';

const SkillGap = () => {
    const [mode, setMode] = useState('role'); // 'role' or 'peer'
    const [role, setRole] = useState('Software Engineer');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const roles = [
        'Software Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Data Scientist',
        'Full Stack Developer',
        'App Developer'
    ];

    useEffect(() => {
        fetchAnalysis();
    }, [mode, role]);

    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/analytics/skill-gap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mode: mode,
                    target_role: role
                })
            });

            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                const err = await response.json();
                setError(err.error || 'Failed to fetch analysis');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Skill Gap Analysis</h2>
                    <p className="text-gray-600">Identify missing skills for your dream role or compare with placed peers.</p>
                </div>

                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                    <button
                        onClick={() => setMode('role')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === 'role' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Industry Roles
                    </button>
                    <button
                        onClick={() => setMode('peer')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === 'peer' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <Users className="w-4 h-4 inline mr-2" />
                        Placed Peers
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Analyzing your profile...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
                    <AlertCircle className="w-10 h-10 mx-auto mb-2" />
                    <p className="font-bold">Analysis Failed</p>
                    <p>{error}</p>
                </div>
            ) : data ? (
                mode === 'role' ? (
                    // ROLE MODE UI
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Control Panel */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Match Score</h3>
                                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="10" fill="transparent" />
                                        <circle
                                            cx="80" cy="80" r="70"
                                            stroke={data.match_percentage >= 70 ? '#16a34a' : data.match_percentage >= 40 ? '#f97316' : '#ef4444'}
                                            strokeWidth="10"
                                            fill="transparent"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * data.match_percentage / 100)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-3xl font-bold text-gray-800">{data.match_percentage}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Lists */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Missing Skills */}
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <Target className="w-5 h-5 mr-2 text-red-500" />
                                    Missing Critical Skills
                                </h3>
                                {data.missing_skills.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {data.missing_skills.map((skill, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                                <span className="font-medium text-gray-700 capitalize">{skill}</span>
                                                <button className="text-xs bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50">
                                                    Learn
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-green-600 flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        You have all the required skills for this role!
                                    </p>
                                )}
                            </div>

                            {/* Present Skills */}
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                    Skills You Have
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.present_skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                                            {skill}
                                        </span>
                                    ))}
                                    {data.present_skills.length === 0 && <span className="text-gray-500">No matching skills found yet.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // PEER MODE UI
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* CGPA Card */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-gray-500 text-sm font-medium mb-2">Academic Consistency (CGPA)</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-bold text-gray-800">{data.metrics?.cgpa?.you}</span>
                                    <span className="text-gray-400 mb-1">/ {data.metrics?.cgpa?.peer_avg} (Peer Avg)</span>
                                </div>
                                <div className={`text-sm ${data.metrics?.cgpa?.gap >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {data.metrics?.cgpa?.gap >= 0 ? '+' : ''}{data.metrics?.cgpa?.gap} vs Average Placed Student
                                </div>
                            </div>

                            {/* Projects Card */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-gray-500 text-sm font-medium mb-2">Projects Completed</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-bold text-gray-800">{data.metrics?.projects?.you}</span>
                                    <span className="text-gray-400 mb-1">/ {data.metrics?.projects?.peer_avg} (Peer Avg)</span>
                                </div>
                                <div className={`text-sm ${data.metrics?.projects?.gap >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                    {data.metrics?.projects?.gap >= 0 ? 'On Track' : 'Needs Improvemenet'}
                                </div>
                            </div>

                            {/* Internships Card */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-gray-500 text-sm font-medium mb-2">Internships</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-bold text-gray-800">{data.metrics?.internships?.you}</span>
                                    <span className="text-gray-400 mb-1">/ {data.metrics?.internships?.peer_avg} (Peer Avg)</span>
                                </div>
                            </div>
                        </div>

                        {/* Peer Common Missing Skills */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                                Top Skills Held by Placed Students (That You Miss)
                            </h3>
                            {data.missing_common_skills?.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {data.missing_common_skills.map((skill, idx) => (
                                        <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                                            <BookOpen className="w-4 h-4" />
                                            <span className="capitalize font-medium">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-green-600 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    You have all the common skills found in placed profiles!
                                </p>
                            )}
                        </div>
                    </div>
                )
            ) : null}
        </div>
    );
};

export default SkillGap;
