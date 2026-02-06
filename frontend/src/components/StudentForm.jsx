import React, { useState } from 'react';
import { predictPlacement } from '../services/api';
import PRSMeter from './PRSMeter';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';

const StudentForm = () => {
    const [formData, setFormData] = useState({
        Branch: 'CSE',
        CGPA: '',
        '10th_Marks': '',
        '12th_Marks': '',
        Skills: '',
        Internships: 0,
        Projects: 0,
        TargetCompany: ''
    });

    const [result, setResult] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const companies = ['Google', 'Microsoft', 'TCS', 'Infosys', 'Accenture', 'StartupX'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        setRoadmap(null);

        try {
            const payload = {
                ...formData,
                CGPA: parseFloat(formData.CGPA),
                '10th_Marks': parseFloat(formData['10th_Marks']),
                '12th_Marks': parseFloat(formData['12th_Marks']),
                Internships: parseInt(formData.Internships),
                Projects: parseInt(formData.Projects),
                Skills: formData.Skills.split(',').map(s => s.trim())
            };

            const response = await predictPlacement(payload);
            setResult(response);

            // Fetch company roadmap if target company selected
            if (formData.TargetCompany) {
                try {
                    const roadmapResponse = await fetch('http://localhost:5000/api/recommend/roadmap', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            skills: payload.Skills,
                            target_company: formData.TargetCompany
                        })
                    });
                    const roadmapData = await roadmapResponse.json();
                    if (roadmapResponse.ok) {
                        setRoadmap(roadmapData);
                    }
                } catch (err) {
                    console.error('Roadmap fetch failed', err);
                }
            }
        } catch (err) {
            console.error("Prediction failed", err);
            setError("Analysis failed. Please ensure Backend is running on port 5000. Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Placement Predictor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Branch</label>
                        <select
                            value={formData.Branch}
                            onChange={(e) => setFormData({ ...formData, Branch: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        >
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                            <option value="MECH">Mechanical</option>
                            <option value="CIVIL">Civil</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CGPA (0-10)</label>
                        <input
                            type="number" step="0.1" min="0" max="10"
                            value={formData.CGPA}
                            onChange={(e) => setFormData({ ...formData, CGPA: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">10th Marks (%)</label>
                        <input
                            type="number" step="1" min="0" max="100"
                            value={formData['10th_Marks']}
                            onChange={(e) => setFormData({ ...formData, '10th_Marks': e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">12th Marks (%)</label>
                        <input
                            type="number" step="1" min="0" max="100"
                            value={formData['12th_Marks']}
                            onChange={(e) => setFormData({ ...formData, '12th_Marks': e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Skills (comma separated, e.g. Python, Java, React)</label>
                    <input
                        type="text"
                        value={formData.Skills}
                        onChange={(e) => setFormData({ ...formData, Skills: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="Python, SQL, React"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Internships (Count)</label>
                        <input
                            type="number" min="0"
                            value={formData.Internships}
                            onChange={(e) => setFormData({ ...formData, Internships: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Projects (Count)</label>
                        <input
                            type="number" min="0"
                            value={formData.Projects}
                            onChange={(e) => setFormData({ ...formData, Projects: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Target Company (Optional - for personalized roadmap)
                    </label>
                    <select
                        value={formData.TargetCompany}
                        onChange={(e) => setFormData({ ...formData, TargetCompany: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    >
                        <option value="">-- Select Company --</option>
                        {companies.map(company => (
                            <option key={company} value={company}>{company}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Analyzing...' : 'Analyze Profile'}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="mt-8 space-y-6">
                    {/* PRS Meter */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
                        <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Placement Readiness Score</h3>
                        <div className="flex justify-center">
                            <PRSMeter score={result.prs_score} category={result.prs_category} />
                        </div>
                    </div>

                    {/* Placement Probability */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 mb-1">Placement Probability</p>
                            <p className={`text-3xl font-bold ${result.placement_probability > 70 ? 'text-green-600' : 'text-orange-500'}`}>
                                {result.placement_probability}%
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 mb-1">Predicted Outcome</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {result.predicted_class === 1 ? 'Likely Placed' : 'Needs Improvement'}
                            </p>
                        </div>
                    </div>

                    {/* Company Roadmap */}
                    {roadmap && (
                        <div className="bg-white p-6 rounded-xl shadow-md border border-purple-200">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                Personalized Roadmap for {roadmap.company}
                            </h4>

                            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Skill Match</span>
                                    <span className="text-2xl font-bold text-purple-600">{roadmap.completion_percentage}%</span>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${roadmap.completion_percentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            {roadmap.has_skills.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-green-700 mb-2">✓ Skills You Have:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {roadmap.has_skills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {roadmap.roadmap.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-3">📚 Skills to Learn (Priority Order):</p>
                                    <div className="space-y-3">
                                        {roadmap.roadmap.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                                                    <span className="font-semibold text-gray-800">{item.skill}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                                            item.priority === 'Important' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {item.priority}
                                                    </span>
                                                    <span className="text-sm text-gray-600">~{item.estimated_weeks} weeks</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {roadmap.min_cgpa && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Minimum CGPA Required:</span> {roadmap.min_cgpa}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentForm;
