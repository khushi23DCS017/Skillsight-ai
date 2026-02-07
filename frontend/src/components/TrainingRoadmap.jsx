
import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Circle, PlayCircle, FileText, Code, ChevronRight, ChevronDown } from 'lucide-react';

const TrainingRoadmap = () => {
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [learningPath, setLearningPath] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedWeek, setExpandedWeek] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/recommend/learning-path/skills', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSkills(data);
            }
        } catch (err) {
            console.error("Failed to fetch skills", err);
        }
    };

    const fetchPath = async (skill) => {
        setLoading(true);
        setError(null);
        setLearningPath(null);
        setExpandedWeek(1); // Auto-expand first week
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/recommend/learning-path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ skill })
            });

            if (response.ok) {
                const data = await response.json();
                setLearningPath(data);
            } else {
                const err = await response.json();
                setError(err.error || "Failed to generate learning path");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSkillChange = (e) => {
        const skill = e.target.value;
        setSelectedSkill(skill);
        if (skill) {
            fetchPath(skill);
        }
    };

    const toggleWeek = (week) => {
        setExpandedWeek(expandedWeek === week ? null : week);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        Micro-Learning Paths
                    </h2>
                    <p className="text-gray-600">Master a new skill with a week-by-week plan.</p>
                </div>

                <div className="w-full md:w-64">
                    <select
                        value={selectedSkill}
                        onChange={handleSkillChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                        <option value="">Select Skill to Learn</option>
                        {skills.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Generating your learning path...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {!loading && learningPath && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="text-3xl font-bold mb-2">{learningPath.title}</h3>
                        <p className="text-indigo-100">{learningPath.description}</p>
                    </div>

                    <div className="space-y-4">
                        {learningPath.modules.map((module) => (
                            <div key={module.week} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => toggleWeek(module.week)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${expandedWeek === module.week ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            W{module.week}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{module.topic}</h4>
                                            <p className="text-sm text-gray-500">{module.tasks.length} Tasks</p>
                                        </div>
                                    </div>
                                    {expandedWeek === module.week ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                </button>

                                {expandedWeek === module.week && (
                                    <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50">
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Objectives</h5>
                                                <ul className="space-y-2">
                                                    {module.tasks.map((task, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                            <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-green-500" /></div>
                                                            {task}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Resources</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {module.resources.map((res, idx) => (
                                                        <a key={idx} href="#" className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-sm group">
                                                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded group-hover:bg-indigo-100">
                                                                {idx % 2 === 0 ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                            </div>
                                                            <span className="text-gray-700 group-hover:text-indigo-700 font-medium">{res}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!selectedSkill && !loading && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Choose a Skill Path</h3>
                    <p className="text-gray-500 mt-1">Select a skill from the dropdown to start your learning journey.</p>
                </div>
            )}
        </div>
    );
};

export default TrainingRoadmap;
