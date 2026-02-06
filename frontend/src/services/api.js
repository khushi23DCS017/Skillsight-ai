const API_BASE_URL = "http://localhost:5000/api";

export const checkHealth = async () => {
    try {
        const response = await fetch("http://localhost:5000/health");
        return await response.json();
    } catch (error) {
        console.error("Health check failed", error);
        return { status: "error" };
    }
};

export const predictPlacement = async (studentData) => {
    const response = await fetch(`${API_BASE_URL}/predict/placement`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
    });
    return await response.json();
};

export const recommendSkills = async (skills, targetCompany) => {
    const response = await fetch(`${API_BASE_URL}/recommend/skills`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills, target_company: targetCompany }),
    });
    return await response.json();
};
