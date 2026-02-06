import React from 'react';

const PRSMeter = ({ score, category }) => {
    // Determine color based on score
    const getColor = () => {
        if (score >= 70) return { primary: '#10B981', secondary: '#D1FAE5', text: 'text-green-700' };
        if (score >= 50) return { primary: '#F59E0B', secondary: '#FEF3C7', text: 'text-yellow-700' };
        if (score >= 30) return { primary: '#F97316', secondary: '#FFEDD5', text: 'text-orange-700' };
        return { primary: '#EF4444', secondary: '#FEE2E2', text: 'text-red-700' };
    };

    const colors = getColor();
    const circumference = 2 * Math.PI * 70; // radius = 70
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
                {/* Background circle */}
                <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                        cx="96"
                        cy="96"
                        r="70"
                        stroke={colors.secondary}
                        strokeWidth="12"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="70"
                        stroke={colors.primary}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800">{score}</span>
                    <span className="text-sm text-gray-500">/ 100</span>
                </div>
            </div>
            {/* Category label */}
            {category && (
                <div className={`mt-4 px-4 py-2 rounded-full font-semibold ${colors.text}`} style={{ backgroundColor: colors.secondary }}>
                    {category.category}
                </div>
            )}
            {category && category.message && (
                <p className="mt-2 text-sm text-gray-600 text-center max-w-xs">{category.message}</p>
            )}
        </div>
    );
};

export default PRSMeter;
