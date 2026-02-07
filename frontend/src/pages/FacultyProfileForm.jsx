import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Building2, Award, BookOpen, Code, ArrowRight } from 'lucide-react';

const FacultyProfileForm = () => {
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState(1);
    const [formData, setFormData] = useState({
        // Section 1: Basic Details
        name: '',
        department: '',
        designation: '',
        experience: '',
        qualification: '',

        // Section 2: Academic & Technical Expertise
        subjects: '',
        specialization: '',
        skills: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const departments = [
        'Computer Science & Engineering',
        'Information Technology',
        'Electronics & Communication Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Chemical Engineering',
        'Biotechnology',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Other'
    ];

    const designations = [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer',
        'Senior Lecturer',
        'Guest Faculty',
        'Visiting Faculty',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateSection1 = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.designation) newErrors.designation = 'Designation is required';
        if (!formData.experience || formData.experience < 0) newErrors.experience = 'Valid experience is required';
        if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSection2 = () => {
        const newErrors = {};
        if (!formData.subjects.trim()) newErrors.subjects = 'At least one subject is required';
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
        if (!formData.skills.trim()) newErrors.skills = 'At least one skill is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateSection1()) {
            setCurrentSection(2);
        }
    };

    const handleBack = () => {
        setCurrentSection(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateSection2()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            // Parse comma-separated values into arrays
            const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);

            const response = await fetch('http://localhost:5000/api/faculty/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    department: formData.department,
                    designation: formData.designation,
                    experience_years: parseInt(formData.experience),
                    qualification: formData.qualification,
                    subjects: JSON.stringify(subjectsArray),
                    specialization: formData.specialization,
                    skills: JSON.stringify(skillsArray)
                })
            });

            if (response.ok) {
                navigate('/faculty');
            } else {
                const error = await response.json();
                alert('Failed to save profile: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <GraduationCap className="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Faculty Profile</h1>
                    <p className="text-gray-600">Help us personalize your experience</p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 ${currentSection === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentSection === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                1
                            </div>
                            <span className="font-medium hidden sm:inline">Basic Details</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-300"></div>
                        <div className={`flex items-center gap-2 ${currentSection === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentSection === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                2
                            </div>
                            <span className="font-medium hidden sm:inline">Academic Expertise</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Basic Details */}
                        {currentSection === 1 && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-4 mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        Basic Details
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Tell us about yourself</p>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Dr. John Doe"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                                </div>

                                {/* Designation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Select Designation</option>
                                        {designations.map(des => (
                                            <option key={des} value={des}>{des}</option>
                                        ))}
                                    </select>
                                    {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Years of Experience <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        min="0"
                                        max="50"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="5"
                                    />
                                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                </div>

                                {/* Qualification */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Highest Qualification <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.qualification ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Ph.D. in Computer Science"
                                    />
                                    {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
                                </div>

                                {/* Next Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                                    >
                                        Next: Academic Expertise
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Section 2: Academic & Technical Expertise */}
                        {currentSection === 2 && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-4 mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                        Academic & Technical Expertise
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Share your teaching and technical skills</p>
                                </div>

                                {/* Subjects Taught */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subjects Taught <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subjects"
                                        value={formData.subjects}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.subjects ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Data Structures, Algorithms, Machine Learning (comma-separated)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple subjects with commas</p>
                                    {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects}</p>}
                                </div>

                                {/* Specialization */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Area of Specialization <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.specialization ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Machine Learning, Artificial Intelligence"
                                    />
                                    {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
                                </div>

                                {/* Skills & Tools */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Skills & Tools <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        rows="4"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.skills ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Python, TensorFlow, PyTorch, Java, C++, Research Methodology (comma-separated)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">List your technical skills and tools you're proficient in</p>
                                    {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : 'Complete Profile'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FacultyProfileForm;
