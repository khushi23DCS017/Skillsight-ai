import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, TrendingUp, BookOpen, FileText } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import ResumeUpload from '../components/ResumeUpload';
import PRSMeter from '../components/PRSMeter';
import TrainingRoadmap from '../components/TrainingRoadmap';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentProfile();
    }, []);

    const fetchStudentProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/students/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStudent(data);
            } else {
                if (response.status === 401) {
                    navigate('/login');
                } else {
                    console.error("Failed to load profile", response.status);
                    // Don't redirect, let the UI handle empty student state
                }
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">SkillSight AI - Student Portal</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">{student?.name}</p>
                            <p className="text-xs text-gray-500">{student?.branch} • CGPA: {student?.cgpa}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Tab Navigation */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'profile'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        My Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('prediction')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'prediction'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Placement Prediction
                    </button>
                    <button
                        onClick={() => setActiveTab('training')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'training'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <BookOpen className="w-5 h-5 mr-2" />
                        Training Roadmap
                    </button>
                    <button
                        onClick={() => setActiveTab('resume')}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'resume'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        Resume Analysis
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    student ? (
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Profile</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="text-lg font-semibold text-gray-800">{student.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Branch</p>
                                    <p className="text-lg font-semibold text-gray-800">{student.branch}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">CGPA</p>
                                    <p className="text-lg font-semibold text-gray-800">{student.cgpa}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">10th Marks</p>
                                    <p className="text-lg font-semibold text-gray-800">{student.tenth_marks}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">12th Marks</p>
                                    <p className="text-lg font-semibold text-gray-800">{student.twelfth_marks}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Internships</p>
                                    <p className="text-lg font-semibold text-gray-800">{student.internships}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Projects</p>
                                    <p className="text-lg font-semibold text-gray-800">{student.projects}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Placement Status</p>
                                    <p className={`text-lg font-semibold ${student.placed ? 'text-green-600' : 'text-orange-600'}`}>
                                        {student.placed ? 'Placed' : 'Not Placed'}
                                    </p>
                                </div>
                            </div>
                            {student.skills && student.skills.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-sm text-gray-500 mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {student.skills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
                            <p className="text-gray-600 mb-6">We couldn't find your student profile data. This might be because your registration process wasn't completed successfully.</p>
                            <p className="text-gray-600">Please try registering again with a new email.</p>
                        </div>
                    )
                )}

                {/* Prediction Tab */}
                {activeTab === 'prediction' && (
                    <StudentForm />
                )}

                {/* Training Tab */}
                {activeTab === 'training' && (
                    <TrainingRoadmap student={student} />
                )}

                {/* Resume Tab */}
                {activeTab === 'resume' && (
                    <ResumeUpload />
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
