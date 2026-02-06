import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

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
            const response = await fetch('http://localhost:5000/api/analyze/resume', {
                method: 'POST',
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

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Resume Intelligence
            </h2>

            <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-semibold">
                            Choose PDF Resume
                        </span>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    {file && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected: {file.name}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="mt-8 space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Resume Score</h3>
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-4xl font-bold text-blue-600">
                            {result.resume_score}/100
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Found Skills ({result.found_skills.length})</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.found_skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {result.missing_skills.length > 0 && (
                        <div className="bg-white p-6 rounded-lg border border-orange-200">
                            <h4 className="font-semibold text-gray-800 mb-3">Recommended Skills to Add</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.suggestions.length > 0 && (
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-gray-800 mb-3">Improvement Suggestions</h4>
                            <ul className="space-y-2">
                                {result.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
