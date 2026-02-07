import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, TrendingUp, BookOpen, FileText, AlertCircle, ChevronRight, Menu, X, BarChart2, Target } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import ResumeUpload from '../components/ResumeUpload';
import PRSMeter from '../components/PRSMeter';
import SkillGap from '../components/SkillGap';
import CompanyRoadmap from '../components/CompanyRoadmap';
import TrainingRoadmap from '../components/TrainingRoadmap';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [prsData, setPrsData] = useState(null);
    const [prsError, setPrsError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentProfile();
    }, []);

    useEffect(() => {
        if (activeTab === 'prs' && !prsData) {
            const fetchPRS = async () => {
                try {
                    setPrsError(null);
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:5000/api/analytics/prs', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setPrsData(data);
                    } else {
                        const err = await response.json();
                        setPrsError(err.error || "Failed to fetch PRS");
                    }
                } catch (error) {
                    console.error("Error fetching PRS:", error);
                    setPrsError("Network Error. Ensure backend is running.");
                }
            };
            fetchPRS();
        }
    }, [activeTab, prsData]);

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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`bg-white shadow-xl fixed inset-y-0 left-0 z-50 transition-all duration-300 transform 
                ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} lg:translate-x-0 lg:static lg:w-72`}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    <h1 className="text-xl font-bold text-blue-600">SkillSight AI</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    <div className="mb-6">
                        <div className="px-4 py-2">
                            <p className="text-sm font-semibold text-gray-800">{student?.name}</p>
                            <p className="text-xs text-gray-500">{student?.branch} • CGPA: {student?.cgpa}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <User className="w-5 h-5" />
                        My Profile
                    </button>

                    <button
                        onClick={() => setActiveTab('prs')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'prs' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <TrendingUp className="w-5 h-5" />
                        Placement Readiness
                    </button>
                    <button
                        onClick={() => setActiveTab('skillgap')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'skillgap' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <BarChart2 className="w-5 h-5" />
                        Skill Gap Analysis
                    </button>

                    <button
                        onClick={() => setActiveTab('roadmap')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === 'roadmap' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Target className="w-5 h-5" />
                        Company Roadmaps
                    </button>

                    <button
                        onClick={() => setActiveTab('learning')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === 'learning' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <BookOpen className="w-5 h-5" />
                        Micro-Learning Paths
                    </button>

                    <button
                        onClick={() => setActiveTab('resume')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === 'resume' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FileText className="w-5 h-5" />
                        Resume Intelligence
                    </button>

                    <div className="pt-8 mt-8 border-t">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {
                isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )
            }

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-blue-600">SkillSight AI</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-8">
                    {/* Tab Content */}
                    {activeTab === 'profile' && (
                        student ? (
                            /* Check for incomplete profile: Branch='General' AND CGPA=0 */
                            (student.branch === 'General' && student.cgpa === 0) ? (
                                <div className="bg-white rounded-xl shadow-md p-10 text-center">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="w-10 h-10 text-orange-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Incomplete</h2>
                                        <p className="text-gray-600 max-w-md mx-auto">
                                            You are one step away from personalized placement insights! Complete your profile to unlock predictions and roadmaps.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/student/complete-profile')}
                                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                                    >
                                        Complete Profile
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-md p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
                                        <button
                                            onClick={() => navigate('/student/complete-profile')}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm text-decoration-underline"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
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
                            )
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
                                <p className="text-gray-600 mb-6">We couldn't find your student profile data. This might be because your registration process wasn't completed successfully.</p>
                            </div>
                        )
                    )}

                    {activeTab === 'prs' && (
                        <div className="space-y-6">
                            {prsError ? (
                                <div className="bg-red-50 text-red-600 p-8 rounded-xl flex flex-col items-center justify-center text-center">
                                    <AlertCircle className="w-12 h-12 mb-4" />
                                    <h3 className="text-lg font-bold">Unable to load Placement Score</h3>
                                    <p>{prsError}</p>
                                    <p className="text-sm mt-2 text-gray-500">Please ensure the backend server is running.</p>
                                </div>
                            ) : !prsData ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Calculating your Placement Score...</p>
                                </div>
                            ) : (
                                <PRSMeter prsData={prsData} />
                            )}
                        </div>
                    )}

                    {activeTab === 'skillgap' && (
                        <SkillGap />
                    )}

                    {activeTab === 'roadmap' && (
                        <CompanyRoadmap />
                    )}

                    {activeTab === 'learning' && (
                        <TrainingRoadmap />
                    )}

                    {activeTab === 'resume' && (
                        <ResumeUpload />
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;

