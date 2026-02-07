import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Users,
    BarChart2,
    LogOut,
    Home,
    TrendingUp,
    Building2,
    Lightbulb,
    UserCheck,
    FolderKanban,
    AlertCircle,
    GraduationCap,
    Award,
    Briefcase,
    BookOpen
} from 'lucide-react';

const FacultyDashboard = () => {
    const [facultyProfile, setFacultyProfile] = useState(null);
    const [profileCompleted, setProfileCompleted] = useState(true);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');
    const navigate = useNavigate();

    useEffect(() => {
        fetchFacultyProfile();
    }, []);

    const fetchFacultyProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/faculty/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Faculty profile data:', data); // Debug log
                setProfileCompleted(data.profile_completed);
                setFacultyProfile(data.faculty);
            }
        } catch (err) {
            console.error('Failed to fetch faculty profile', err);
        } finally {
            setLoading(false);
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: Home, description: 'Your profile & quick stats' },
        { id: 'skill-gaps', label: 'Skill Gap Analysis', icon: TrendingUp, description: 'View skill gaps by subject/branch' },
        { id: 'performance', label: 'Student Performance', icon: BarChart2, description: 'Analyze performance trends' },
        { id: 'department', label: 'Department Insights', icon: Building2, description: 'Weak topics in your department' },
        { id: 'curriculum', label: 'Curriculum Recommendations', icon: Lightbulb, description: 'AI-powered improvements' },
        { id: 'progress', label: 'Student Progress', icon: UserCheck, description: 'Monitor skill development' },
        { id: 'projects', label: 'Project Suggestions', icon: FolderKanban, description: 'Training topics & projects' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Blue theme to match student dashboard */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo/Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">SkillSight AI</h1>
                            <p className="text-xs text-gray-500">Faculty Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full text-left p-3 rounded-lg transition-all ${isActive
                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-5 h-5" />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{item.label}</div>
                                            <div className={`text-xs ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-500 hover:bg-red-600 transition text-white"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {sidebarItems.find(item => item.id === activeSection)?.description}
                    </p>
                </header>

                {/* Content Area */}
                <div className="p-6">
                    {/* Incomplete Profile Banner */}
                    {!profileCompleted && (
                        <div className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <AlertCircle className="w-12 h-12" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Incomplete Profile</h3>
                                        <p className="text-orange-100">Complete your profile to unlock all features and personalized insights</p>
                                    </div>
                                </div>
                                <Link
                                    to="/faculty/profile"
                                    className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                                >
                                    Complete Profile
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <div className="space-y-6">
                            {/* Profile Card */}
                            {facultyProfile ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-800">Faculty Profile</h3>
                                        <Link
                                            to="/faculty/profile"
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            Edit Profile
                                        </Link>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="p-4 bg-blue-50 rounded-full flex-shrink-0">
                                            <GraduationCap className="w-16 h-16 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-2xl font-bold text-gray-800 mb-1">{facultyProfile.name}</h4>
                                            <p className="text-blue-600 font-medium mb-1">{facultyProfile.designation || 'Faculty Member'}</p>
                                            <p className="text-gray-600 text-sm mb-4">{facultyProfile.department}</p>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Qualification</p>
                                                        <p className="font-semibold text-gray-800">{facultyProfile.qualification || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Experience</p>
                                                        <p className="font-semibold text-gray-800">{facultyProfile.experience_years} years</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Specialization</p>
                                                        <p className="font-semibold text-gray-800">{facultyProfile.specialization || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subjects */}
                                            {facultyProfile.subjects && facultyProfile.subjects.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-gray-500 mb-2 font-medium">Subjects Teaching:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {facultyProfile.subjects.map((subject, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                                {subject}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Skills */}
                                            {facultyProfile.skills && facultyProfile.skills.length > 0 && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-2 font-medium">Skills & Tools:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {facultyProfile.skills.map((skill, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">No Profile Found</h3>
                                    <p className="text-gray-500 mb-4">Complete your profile to get started</p>
                                    <Link
                                        to="/faculty/profile"
                                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        Complete Profile
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Other Sections - Placeholder */}
                    {activeSection !== 'overview' && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <div className="max-w-md mx-auto">
                                {React.createElement(sidebarItems.find(item => item.id === activeSection)?.icon || Home, {
                                    className: "w-20 h-20 text-gray-300 mx-auto mb-4"
                                })}
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {sidebarItems.find(item => item.id === activeSection)?.label}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {sidebarItems.find(item => item.id === activeSection)?.description}
                                </p>
                                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                    Coming Soon
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FacultyDashboard;
