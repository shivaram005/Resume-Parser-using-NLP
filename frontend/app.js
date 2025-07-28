// Global variables
let parsedData = null;

// DOM elements
const uploadForm = document.getElementById('uploadForm');
const resumeFile = document.getElementById('resumeFile');
const dropZone = document.getElementById('dropZone');
const parseBtn = document.getElementById('parseBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const confidenceBar = document.getElementById('confidenceBar');
const confidenceScore = document.getElementById('confidenceScore');
const exportJsonBtn = document.getElementById('exportJson');
const copyDataBtn = document.getElementById('copyData');

// Drag and drop functionality
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-blue-400', 'bg-blue-50');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-blue-400', 'bg-blue-50');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            resumeFile.files = files;
            showFileSelected(file);
        } else {
            showError('Please select a PDF or DOCX file.');
        }
    }
});

// File input change
resumeFile.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        showFileSelected(e.target.files[0]);
    }
});

// Show selected file
function showFileSelected(file) {
    const fileName = file.name;
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    
    dropZone.innerHTML = `
        <i class="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
        <p class="text-lg text-gray-800 mb-2">${fileName}</p>
        <p class="text-sm text-gray-500">${fileSize} MB</p>
    `;
    
    parseBtn.disabled = false;
}

// Form submission
uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const file = resumeFile.files[0];
    if (!file) {
        showError('Please select a file first.');
        return;
    }
    
    // Show loading
    showLoading();
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        parsedData = data;
        displayResults(data);
        
    } catch (error) {
        showError(`Failed to parse resume: ${error.message}`);
        hideLoading();
    }
});

// Show loading state
function showLoading() {
    loadingSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    parseBtn.disabled = true;
}

// Hide loading state
function hideLoading() {
    loadingSection.classList.add('hidden');
    parseBtn.disabled = false;
}

// Display results
function displayResults(data) {
    hideLoading();
    
    // Update confidence score
    const confidence = data.confidence_score || 0;
    confidenceScore.textContent = `${confidence.toFixed(1)}%`;
    confidenceBar.style.width = `${confidence}%`;
    
    // Set confidence bar color
    if (confidence >= 80) {
        confidenceBar.className = 'bg-green-500 h-3 rounded-full transition-all duration-1000';
    } else if (confidence >= 60) {
        confidenceBar.className = 'bg-yellow-500 h-3 rounded-full transition-all duration-1000';
    } else {
        confidenceBar.className = 'bg-red-500 h-3 rounded-full transition-all duration-1000';
    }
    
    // Display personal information
    displayPersonalInfo(data);
    
    // Display skills
    displaySkills(data.skills || []);
    
    // Display experience
    displayExperience(data.experience || []);
    
    // Display education
    displayEducation(data.education || []);
    
    // Display projects
    displayProjects(data.projects || []);
    
    // Display certifications
    displayCertifications(data.certifications || []);
    
    // Show results section
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Display personal information
function displayPersonalInfo(data) {
    const personalInfo = document.getElementById('personalInfo');
    personalInfo.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas fa-user text-gray-400 w-5"></i>
            <span class="font-medium">Name:</span>
            <span class="text-gray-700">${data.name || 'Not found'}</span>
        </div>
        <div class="flex items-center space-x-3">
            <i class="fas fa-envelope text-gray-400 w-5"></i>
            <span class="font-medium">Email:</span>
            <span class="text-gray-700">${data.email || 'Not found'}</span>
        </div>
        <div class="flex items-center space-x-3">
            <i class="fas fa-phone text-gray-400 w-5"></i>
            <span class="font-medium">Phone:</span>
            <span class="text-gray-700">${data.phone || 'Not found'}</span>
        </div>
        <div class="flex items-center space-x-3">
            <i class="fab fa-linkedin text-gray-400 w-5"></i>
            <span class="font-medium">LinkedIn:</span>
            <span class="text-gray-700">${data.linkedin || 'Not found'}</span>
        </div>
    `;
}

// Display skills
function displaySkills(skills) {
    const skillsSection = document.getElementById('skillsSection');
    if (skills.length === 0) {
        skillsSection.innerHTML = '<p class="text-gray-500">No skills detected</p>';
        return;
    }
    
    skillsSection.innerHTML = skills.map(skill => 
        `<span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">${skill}</span>`
    ).join('');
}

// Display experience
function displayExperience(experience) {
    const experienceSection = document.getElementById('experienceSection');
    if (experience.length === 0) {
        experienceSection.innerHTML = '<p class="text-gray-500">No experience found</p>';
        return;
    }
    
    experienceSection.innerHTML = experience.map(exp => `
        <div class="border-l-4 border-green-500 pl-4">
            <h4 class="font-semibold text-gray-800">${exp.role || 'Unknown Role'}</h4>
            <p class="text-gray-600">${exp.company || 'Unknown Company'}</p>
            <p class="text-sm text-gray-500">${exp.dates || 'Dates not specified'}</p>
        </div>
    `).join('');
}

// Display education
function displayEducation(education) {
    const educationSection = document.getElementById('educationSection');
    if (education.length === 0) {
        educationSection.innerHTML = '<p class="text-gray-500">No education found</p>';
        return;
    }
    
    educationSection.innerHTML = education.map(edu => `
        <div class="border-l-4 border-indigo-500 pl-4">
            <h4 class="font-semibold text-gray-800">${edu.degree || 'Unknown Degree'}</h4>
            <p class="text-gray-600">${edu.institution || 'Unknown Institution'}</p>
            <p class="text-sm text-gray-500">${edu.year || 'Year not specified'}</p>
        </div>
    `).join('');
}

// Display projects
function displayProjects(projects) {
    const projectsSection = document.getElementById('projectsSection');
    if (projects.length === 0) {
        projectsSection.innerHTML = '<p class="text-gray-500">No projects found</p>';
        return;
    }
    
    projectsSection.innerHTML = projects.map(project => `
        <div class="flex items-start space-x-3">
            <i class="fas fa-project-diagram text-orange-500 mt-1"></i>
            <p class="text-gray-700">${project}</p>
        </div>
    `).join('');
}

// Display certifications
function displayCertifications(certifications) {
    const certificationsSection = document.getElementById('certificationsSection');
    if (certifications.length === 0) {
        certificationsSection.innerHTML = '<p class="text-gray-500">No certifications found</p>';
        return;
    }
    
    certificationsSection.innerHTML = certifications.map(cert => `
        <div class="flex items-start space-x-3">
            <i class="fas fa-certificate text-red-500 mt-1"></i>
            <p class="text-gray-700">${cert}</p>
        </div>
    `).join('');
}

// Export JSON functionality
exportJsonBtn.addEventListener('click', () => {
    if (!parsedData) return;
    
    const dataStr = JSON.stringify(parsedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'parsed_resume.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccess('JSON file downloaded successfully!');
});

// Copy data functionality
copyDataBtn.addEventListener('click', async () => {
    if (!parsedData) return;
    
    try {
        await navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2));
        showSuccess('Data copied to clipboard!');
    } catch (err) {
        showError('Failed to copy data to clipboard.');
    }
});

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate__animated animate__fadeInRight';
    errorDiv.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add('animate__fadeOutRight');
        setTimeout(() => document.body.removeChild(errorDiv), 500);
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate__animated animate__fadeInRight';
    successDiv.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.classList.add('animate__fadeOutRight');
        setTimeout(() => document.body.removeChild(successDiv), 500);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    parseBtn.disabled = true;
}); 