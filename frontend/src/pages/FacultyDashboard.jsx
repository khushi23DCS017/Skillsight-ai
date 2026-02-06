import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    BarChart2,
    LogOut,
    Trash2,
    Search,
    Download,
    Upload,
    FileText
} from 'lucide-react';

const FacultyDashboard = () => {
    const [students, setStudents] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('students');
    const navigate = useNavigate();

    // Data Management Handlers
    const handleUploadData = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/upload-data', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                alert("Data uploaded successfully! Refreshing dashboard...");
                fetchStudents(); // Refresh data
                fetchAnalytics();
            } else {
                const err = await response.json();
                alert("Upload failed: " + err.error);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload data");
        }
    };

    const handleDownloadReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/report', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'placement_report.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert("Failed to download report");
            }
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download report");
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchAnalytics();
    }, []);

    const fetchStudents = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/students', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/analytics/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (err) {
            console.error('Failed to fetch analytics', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDeleteStudent = async (studentId) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchStudents();
                fetchAnalytics();
            }
        } catch (err) {
            console.error('Failed to delete student', err);
        }
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
                    <h1 className="text-2xl font-bold text-purple-600">SkillSight AI - Faculty Portal</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Tab Navigation */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`flex items-center px-6 py-3 text-sm font-medium transition ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Users className="w-5 h-5 mr-2" />
                        Manage Students
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center px-6 py-3 text-sm font-medium transition ${activeTab === 'analytics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <BarChart2 className="w-5 h-5 mr-2" />
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className={`flex items-center px-6 py-3 text-sm font-medium transition ${activeTab === 'data' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Upload className="w-5 h-5 mr-2" />
                        Data Management
                    </button>
                </div>

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Student Records</h2>
                            <p className="text-gray-600">Total Students: {students.length}</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Branch</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">CGPA</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Skills</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{student.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{student.branch}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{student.cgpa}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {student.skills?.length || 0} skills
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.placed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {student.placed ? 'Placed' : 'Not Placed'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <button
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Data Management Tab */}
                {activeTab === 'data' && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Data Management</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Upload Section */}
                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Upload className="w-5 h-5 mr-2 text-blue-600" />
                                    Upload Placement Data
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Upload historical placement data (CSV) to update the database and analytics.
                                </p>
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) handleUploadData(file);
                                        }}
                                    />
                                    <p className="text-xs text-gray-400">
                                        Required columns: Name, Branch, CGPA, Placed, Salary, Skills (pipe separated)
                                    </p>
                                </div>
                            </div>

                            {/* Export Section */}
                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Download className="w-5 h-5 mr-2 text-green-600" />
                                    Download Reports
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Download comprehensive placement reports and analytics data.
                                </p>
                                <button
                                    onClick={handleDownloadReport}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Download Placement Report (CSV)
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && analytics && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                                <p className="text-sm text-gray-500 mb-1">Placement Rate</p>
                                <p className="text-3xl font-bold text-blue-600">{analytics.placement_rate}%</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                                <p className="text-sm text-gray-500 mb-1">Avg Salary</p>
                                <p className="text-3xl font-bold text-green-600">₹{(analytics.avg_salary / 100000).toFixed(1)}L</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                                <p className="text-sm text-gray-500 mb-1">Total Students</p>
                                <p className="text-3xl font-bold text-purple-600">{analytics.total_students}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                                <p className="text-sm text-gray-500 mb-1">Placed Students</p>
                                <p className="text-3xl font-bold text-orange-600">{analytics.placed_students}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FacultyDashboard;
