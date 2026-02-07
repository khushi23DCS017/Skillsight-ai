
import React, { useState, useEffect } from 'react';
import { Target, BookOpen, CheckCircle, AlertCircle, Calendar, ExternalLink, Briefcase } from 'lucide-react';

const CompanyRoadmap = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/analytics/roadmap/companies', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCompanies(data.sort());
            }
        } catch (err) {
            console.error("Failed to fetch companies", err);
        }
    };

    const fetchRoadmap = async (company) => {
        setLoading(true);
        setError(null);
        setRoadmap(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/analytics/roadmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ company })
            });

            if (response.ok) {
                const data = await response.json();
                setRoadmap(data);
            } else {
                const err = await response.json();
                setError(err.error || "Failed to generate roadmap");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompanyChange = (e) => {
        const company = e.target.value;
        setSelectedCompany(company);
        if (company) {
            fetchRoadmap(company);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        Company-Specific Roadmaps
                    </h2>
                    <p className="text-gray-600">Tailored preparation plans for top tier companies.</p>
                </div>

                <div className="w-full md:w-64">
                    <select
                        value={selectedCompany}
                        onChange={handleCompanyChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Select Target Company</option>
                        {companies.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Generating personalized roadmap for {selectedCompany}...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" />
                    <p>{error}</p>
                </div>
            )}

            {!loading && roadmap && (
                <div className="space-y-6 animate-fadeIn">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-3xl font-bold mb-2">{roadmap.company}</h3>
                                <div className="flex gap-3">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                                        {roadmap.tier}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1 ${roadmap.eligibility_status === 'Eligible' ? 'bg-green-500/30 text-green-50' : 'bg-yellow-500/30 text-yellow-50'}`}>
                                        {roadmap.eligibility_status === 'Eligible' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                        {roadmap.eligibility_status}
                                    </span>
                                </div>
                            </div>
                            <Briefcase className="w-12 h-12 text-white/20" />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Preparation Timeline
                        </h4>

                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {roadmap.timeline.map((phase, idx) => (
                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-200">
                                        <span className="font-bold text-xs text-blue-600">{idx + 1}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md hover:border-blue-200">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900">{phase.phase}</div>
                                            <time className="font-caveat font-medium text-indigo-500 text-sm">{phase.weeks}</time>
                                        </div>
                                        <div className="text-slate-500 text-sm mb-3">
                                            <ul className="list-disc list-inside space-y-1">
                                                {phase.tasks.map((task, tIdx) => (
                                                    <li key={tIdx}>{task}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        {phase.resources && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Recommended Resources</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {phase.resources.map((res, rIdx) => (
                                                        <span key={rIdx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                                                            <BookOpen className="w-3 h-3" />
                                                            {res}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!selectedCompany && !loading && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Select a Company</h3>
                    <p className="text-gray-500 mt-1">Choose a target company from the dropdown to generate your roadmap.</p>
                </div>
            )}
        </div>
    );
};

export default CompanyRoadmap;
