import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, CheckCircle, AlertCircle, ChevronRight, User, BookOpen, Code, Briefcase, Award, Star, Cpu, MapPin } from 'lucide-react';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Initial State structure matches requirements
    const [formData, setFormData] = useState({
        // Section 1: Basic
        fullName: '',
        rollNumber: '',
        branch: '',
        batch: '',
        semester: '',
        cgpa: '',
        tenthMarks: '',
        twelfthMarks: '',
        hasBacklogs: 'No',
        backlogCount: '0',

        // Section 2: Technical Skills
        languages: [], // Multi
        coreSubjects: [],
        aiMlSkills: [],
        webAppSkills: [],
        cloudSkills: [],
        skillProficiency: {}, // Map of skill -> level

        // Section 3: Projects
        projectCount: '',
        projectDomains: [],
        bestProjectDesc: '',
        githubLink: '',
        repoCount: '',
        hasInternship: 'No',
        internshipDuration: '',
        internshipDomain: '',

        // Section 4: Certifications
        certifications: '',
        leetcodeRating: '',
        codechefRating: '',
        problemsSolved: '',

        // Section 5: Soft Skills
        communication: '3',
        teamwork: 'No',
        leadership: 'No',
        hackathons: '',
        publications: '',

        // Section 6: Placement Goals
        preferredRole: [],
        targetCompanies: [],
        expectedCTC: '',
        relocate: 'Yes',
        higherStudies: 'No',

        // Section 7: Links
        linkedinLink: '',
        portfolioLink: '',

        // Section 8: Consent
        consent: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Pre-fill email/name if available from auth
            // We might fetch existing profile to pre-fill if partially done, but assuming fresh for now
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Helper for comma-sep inputs
    const handleArrayChange = (e, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value.split(',').map(item => item.trim())
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.consent) {
            alert("Please provide consent to proceed.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const profilePayload = {
                // Core fields mapping
                name: formData.fullName || user.email.split('@')[0], // Fallback
                branch: formData.branch,
                cgpa: parseFloat(formData.cgpa) || 0,
                tenth_marks: parseFloat(formData.tenthMarks) || 0,
                twelfth_marks: parseFloat(formData.twelfthMarks) || 0,
                internships: formData.hasInternship === 'Yes' ? 1 : 0, // Simplified for core
                projects: parseInt(formData.projectCount) || 0,
                skills: [...(formData.languages || []), ...(formData.webAppSkills || [])], // Flatten for core search

                // Extended Data
                profile_data: JSON.stringify(formData)
            };

            const response = await fetch('http://localhost:5000/api/students/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profilePayload)
            });

            if (response.ok) {
                navigate('/student');
            } else {
                const err = await response.json();
                alert("Failed to save profile: " + err.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error saving profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-8 py-6 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CheckCircle className="w-8 h-8" />
                        Complete Your Profile
                    </h1>
                    <p className="opacity-90 mt-2">
                        Please provide detailed information to help us generate accurate placement predictions and roadmaps.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Section 1: Basic Academic */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <User className="text-blue-600" />
                            1. Basic Academic Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Full Name</label>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label">University Roll Number</label>
                                <input name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="label">Branch / Department</label>
                                <select name="branch" value={formData.branch} onChange={handleChange} className="input-field" required>
                                    <option value="">Select Branch</option>
                                    <option value="CSE">CSE</option>
                                    <option value="IT">IT</option>
                                    <option value="ECE">ECE</option>
                                    <option value="MECH">Mechanical</option>
                                    <option value="CIVIL">Civil</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Current CGPA</label>
                                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label">10th Percentage</label>
                                <input type="number" name="tenthMarks" value={formData.tenthMarks} onChange={handleChange} className="input-field" required />
                            </div>
                            <div>
                                <label className="label">12th Percentage</label>
                                <input type="number" name="twelfthMarks" value={formData.twelfthMarks} onChange={handleChange} className="input-field" required />
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Technical Skills */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <Code className="text-blue-600" />
                            2. Technical Skill Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Programming Languages (Comma separated)</label>
                                <input name="languages" value={formData.languages} onChange={(e) => handleArrayChange(e, 'languages')} className="input-field" placeholder="e.g. Python, Java, C++" />
                            </div>
                            <div>
                                <label className="label">Web Technologies (Comma separated)</label>
                                <input name="webAppSkills" value={formData.webAppSkills} onChange={(e) => handleArrayChange(e, 'webAppSkills')} className="input-field" placeholder="e.g. React, Node.js" />
                            </div>
                            <div>
                                <label className="label">AI/ML Skills (Comma separated)</label>
                                <input name="aiMlSkills" value={formData.aiMlSkills} onChange={(e) => handleArrayChange(e, 'aiMlSkills')} className="input-field" placeholder="e.g. NumPy, Pandas" />
                            </div>
                            <div>
                                <label className="label">Cloud/DevOps (Comma separated)</label>
                                <input name="cloudSkills" value={formData.cloudSkills} onChange={(e) => handleArrayChange(e, 'cloudSkills')} className="input-field" placeholder="e.g. Docker, AWS" />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Projects */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <Briefcase className="text-blue-600" />
                            3. Projects & Experience
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Number of Projects</label>
                                <input type="number" name="projectCount" value={formData.projectCount} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="label">Github Profile Link</label>
                                <input type="url" name="githubLink" value={formData.githubLink} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="label">Completed Internship?</label>
                                <select name="hasInternship" value={formData.hasInternship} onChange={handleChange} className="input-field">
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Certifications */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <Award className="text-blue-600" />
                            4. Certifications & Training
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Certifications</label>
                                <input name="certifications" value={formData.certifications} onChange={handleChange} className="input-field" placeholder="e.g. AWS Certified, Coursera ML" />
                            </div>
                            <div>
                                <label className="label">LeetCode Rating</label>
                                <input type="number" name="leetcodeRating" value={formData.leetcodeRating} onChange={handleChange} className="input-field" />
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Soft Skills */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <Cpu className="text-blue-600" />
                            5. Soft Skills & Activities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Communication Skill (1-5)</label>
                                <select name="communication" value={formData.communication} onChange={handleChange} className="input-field">
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Hackathons Participated</label>
                                <input type="number" name="hackathons" value={formData.hackathons} onChange={handleChange} className="input-field" />
                            </div>
                        </div>
                    </section>

                    {/* Section 6: Goals */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <Star className="text-blue-600" />
                            6. Placement Goals
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Expected CTC (LPA)</label>
                                <input type="text" name="expectedCTC" value={formData.expectedCTC} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="label">Willing to Relocate?</label>
                                <select name="relocate" value={formData.relocate} onChange={handleChange} className="input-field">
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 7: Links */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <MapPin className="text-blue-600" />
                            7. Profile Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">LinkedIn Profile</label>
                                <input type="url" name="linkedinLink" value={formData.linkedinLink} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="label">Portfolio Website</label>
                                <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} className="input-field" />
                            </div>
                        </div>
                    </section>

                    {/* Consent */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-5 h-5 text-blue-600" />
                        <label className="text-sm text-gray-700">I consent to my data being used for placement analytics and recommendations.</label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg">
                        {loading ? 'Saving Profile...' : 'Save & Complete Profile'}
                    </button>
                </form>
            </div>

            <style>{`
                .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
                .input-field { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all; }
                .input-field:focus { border-color: #2563eb; ring: 2px solid #93c5fd; }
            `}</style>
        </div>
    );
};

export default CompleteProfile;
