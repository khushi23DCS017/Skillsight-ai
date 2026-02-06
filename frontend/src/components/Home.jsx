import React, { useState } from 'react';
import StudentForm from './StudentForm';
import ResumeUpload from './ResumeUpload';

const Home = () => {
    const [activeTab, setActiveTab] = useState('placement');

    return (
        <div className="space-y-6">
            <div className="text-center mb-8 mt-4">
                <h2 className="text-3xl font-bold text-gray-900">Intelligent Placement Analytics</h2>
                <p className="text-gray-600 mt-2">Get personalized insights and skill recommendations.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('placement')}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'placement'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Placement Predictor
                </button>
                <button
                    onClick={() => setActiveTab('resume')}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'resume'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Resume Intelligence
                </button>
            </div>

            {/* Content */}
            {activeTab === 'placement' && <StudentForm />}
            {activeTab === 'resume' && <ResumeUpload />}
        </div>
    );
};

export default Home;
