import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

const TrainingRoadmap = ({ student }) => {
    const [companies, setCompanies] = useState([]);
    const [targetCompany, setTargetCompany] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/companies');
            if (response.ok) {
                const data = await response.json();
                setCompanies(data);
            }
        } catch (err) {
            console.error("Failed to fetch companies");
        }
    };

    const handleGetRoadmap = async () => {
        if (!targetCompany) {
            setError("Please select a target company");
            return;
        }

        setLoading(true);
        setError('');
        setRoadmap(null);

        try {
            const response = await fetch('http://localhost:5000/api/recommend/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skills: student.skills || [],
                    target_company: targetCompany
                })
            });

            if (response.ok) {
                const data = await response.json();
                setRoadmap(data);
            } else {
                const err = await response.json();
                setError(err.error || "Failed to generate roadmap");
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                Personalized Training Roadmap
            </h2>

            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Target Dream Company</label>
                <div className="flex gap-4">
                    <select
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Choose Company --</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleGetRoadmap}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Get Roadmap'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {roadmap && (
                <div className="space-y-8 animate-fade-in">
                    {/* Summary Card */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-gradient-to-vr from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Completion Status</h3>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-bold text-blue-600">{roadmap.completion_percentage}%</span>
                                <span className="text-gray-500 mb-1">Aligned with requirements</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${roadmap.completion_percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Skills You Have
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {roadmap.has_skills && roadmap.has_skills.length > 0 ? (
                                    roadmap.has_skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm italic">No matching skills yet. Keep learning!</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Skill Gap Roadmap */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                            Skill Gap Analysis & Training Plan
                        </h3>

                        {roadmap.roadmap && roadmap.roadmap.length > 0 ? (
                            <div className="space-y-4">
                                {roadmap.roadmap.map((item, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                                                ${item.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                                                    item.priority === 'Important' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-blue-100 text-blue-600'}
                                            `}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">{item.skill}</h4>
                                                <span className={`
                                                    inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1
                                                    ${item.priority === 'Critical' ? 'bg-red-50 text-red-600' :
                                                        item.priority === 'Important' ? 'bg-orange-50 text-orange-600' :
                                                            'bg-blue-50 text-blue-600'}
                                                `}>
                                                    {item.priority} Priority
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-4 py-2 rounded-lg whitespace-nowrap">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Est. Time: {item.estimated_weeks} Weeks
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-green-50 rounded-xl border border-green-200">
                                <p className="text-green-800 font-semibold mb-2">🎉 Outstanding!</p>
                                <p className="text-green-600">You have all the required skills for {roadmap.company}. You are ready to apply!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingRoadmap;
