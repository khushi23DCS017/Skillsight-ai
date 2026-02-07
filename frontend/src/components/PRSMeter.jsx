
import React from 'react';
import { AlertCircle, CheckCircle, TrendingUp, BookOpen, Target } from 'lucide-react';

const PRSMeter = ({ prsData }) => {
    if (!prsData) return null;

    const { score, insights, breakdown } = prsData;

    let colorClass = 'text-red-500';
    let bgColorClass = 'bg-red-50';
    let strokeColor = '#ef4444'; // red-500
    let label = 'At Risk';

    if (score >= 80) {
        colorClass = 'text-green-600';
        bgColorClass = 'bg-green-50';
        strokeColor = '#16a34a'; // green-600
        label = 'Placement Ready';
    } else if (score >= 60) {
        colorClass = 'text-orange-500';
        bgColorClass = 'bg-orange-50';
        strokeColor = '#f97316'; // orange-500
        label = 'Almost Ready';
    }

    // Gauge calculation
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="space-y-8">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Placement Readiness Score</h2>
                    <p className="text-gray-600 mb-6">
                        Your calculated probability of getting placed based on current profile metrics.
                    </p>

                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${bgColorClass} ${colorClass}`}>
                        {score >= 80 ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {label}
                    </div>
                </div>

                {/* Gauge Chart */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r={radius}
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r={radius}
                            stroke={strokeColor}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
                        <span className="text-gray-400 text-sm">/ 100</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Breakdown */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Score Breakdown
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Academic (CGPA)</span>
                                <span className="font-semibold">{breakdown?.academic || 0}/40</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((breakdown?.academic || 0) / 40) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Skills Match</span>
                                <span className="font-semibold">{breakdown?.skills || 0}/30</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${((breakdown?.skills || 0) / 30) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Projects & Experience</span>
                                <span className="font-semibold">{breakdown?.experience || 0}/20</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(((breakdown?.experience || 0) / 20) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Consistency</span>
                                <span className="font-semibold">{breakdown?.consistency || 0}/10</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${((breakdown?.consistency || 0) / 10) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Actionable Insights
                    </h3>
                    {insights && insights.length > 0 ? (
                        <ul className="space-y-3">
                            {insights.map((insight, idx) => (
                                <li key={idx} className="flex gap-3 text-gray-700 text-sm bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                    <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-center">
                            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                            <p>Great job! You are on track.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PRSMeter;
