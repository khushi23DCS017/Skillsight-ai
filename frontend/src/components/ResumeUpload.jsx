
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
            setResult(null);
        } else {
            setError('Please select a PDF file');
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/analyze/resume', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || 'Analysis failed');
            }
        } catch (err) {
            setError('Failed to connect to backend. Ensure it is running.');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBagde = (score) => {
        if (score >= 80) return "bg-green-100 text-green-800";
        if (score >= 50) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-indigo-600" />
                    Resume Intelligence Engine
                </h2>
                <p className="text-gray-600">Upload your resume to get an instant ATS score and actionable feedback.</p>
            </div>

            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-300 hover:border-indigo-400'}`}>
                <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {!file ? (
                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <span className="text-indigo-600 font-bold hover:underline">Click to upload</span>
                            <span className="text-gray-500"> or drag and drop PDF here</span>
                        </div>
                        <p className="text-xs text-gray-400">Supported Format: PDF (Max 5MB)</p>
                    </label>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <FileText className="w-12 h-12 text-indigo-600" />
                        <div>
                            <p className="font-semibold text-gray-800">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {loading ? 'Analyzing...' : 'Analyze Resume'}
                            </button>
                            <button
                                onClick={() => { setFile(null); setResult(null); setError(null); }}
                                className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Analysis Results */}
            {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
                    {/* Score Card */}
                    <div className="md:col-span-1 bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                        <h3 className="text-gray-500 font-medium mb-4 uppercase tracking-wide text-sm">ATS Score</h3>
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {/* Simple circular progress visualization */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="15" fill="transparent" className="text-gray-100" />
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke="currentColor" strokeWidth="15" fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * result.resume_score) / 100}
                                    className={`${getScoreColor(result.resume_score)} transition-all duration-1000 ease-out`}
                                />
                            </svg>
                            <span className={`absolute text-4xl font-bold ${getScoreColor(result.resume_score)}`}>{result.resume_score}</span>
                        </div>
                        <div className={`mt-4 px-3 py-1 rounded-full text-sm font-bold ${getScoreBagde(result.resume_score)}`}>
                            {result.resume_score >= 80 ? 'Excellent' : result.resume_score >= 50 ? 'Good Start' : 'Needs Improvement'}
                        </div>
                    </div>

                    {/* Insights */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Found Skills */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Detected Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.found_skills.length > 0 ? (
                                    result.found_skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic text-sm">No specific technical keywords detected.</p>
                                )}
                            </div>
                        </div>

                        {/* Missing Skills */}
                        {result.missing_skills && result.missing_skills.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                                <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                    Missing High-Impact Keywords
                                </h4>
                                <p className="text-sm text-gray-600 mb-3">Adding these can boost your ATS visibility:</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.missing_skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        {result.suggestions && result.suggestions.length > 0 && (
                            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                                <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-3">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    Analysis & Improvements
                                </h4>
                                <ul className="space-y-2">
                                    {result.suggestions.map((sug, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-blue-900">
                                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                                            {sug}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
