import re
import io
import fitz  # PyMuPDF
from docx import Document
from typing import Dict, List, Any

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from PDF using PyMuPDF"""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_text_from_docx(docx_bytes: bytes) -> str:
    """Extract text from DOCX using python-docx"""
    try:
        doc = Document(io.BytesIO(docx_bytes))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        print(f"Error reading DOCX: {e}")
        return ""

def extract_contact_info(text: str) -> Dict[str, str]:
    """Extract email, phone, and LinkedIn using regex"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
    linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9-]+'
    
    email = re.search(email_pattern, text)
    phone = re.search(phone_pattern, text)
    linkedin = re.search(linkedin_pattern, text)
    
    return {
        "email": email.group() if email else "",
        "phone": phone.group() if phone else "",
        "linkedin": linkedin.group() if linkedin else ""
    }

def extract_name(text: str) -> str:
    """Extract name using simple heuristics"""
    lines = text.split('\n')
    for line in lines[:10]:  # Check first 10 lines
        line = line.strip()
        # Look for patterns like "John Doe" or "DOE, John"
        if len(line.split()) == 2 and line[0].isupper():
            return line
        # Look for comma-separated names
        if ',' in line and len(line.split(',')) == 2:
            parts = line.split(',')
            if len(parts[0].split()) <= 2 and len(parts[1].split()) <= 2:
                return line
    return ""

def extract_skills(text: str) -> List[str]:
    """Extract skills using keyword matching"""
    skill_keywords = [
        "Python", "JavaScript", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
        "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "FastAPI",
        "MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "Azure", "GCP", "Docker",
        "Kubernetes", "Git", "GitHub", "CI/CD", "Jenkins", "Jira", "Agile", "Scrum",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn",
        "NLP", "Computer Vision", "Data Analysis", "Pandas", "NumPy", "Matplotlib",
        "HTML", "CSS", "SASS", "Bootstrap", "Tailwind", "REST API", "GraphQL",
        "Microservices", "Serverless", "Lambda", "S3", "EC2", "DynamoDB"
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in skill_keywords:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return list(set(found_skills))

def extract_education(text: str) -> List[Dict[str, str]]:
    """Extract education information"""
    education = []
    
    # Look for education-related keywords
    edu_keywords = ["education", "academic", "university", "college", "degree", "bachelor", "master", "phd"]
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in edu_keywords):
            # Try to extract degree, institution, year
            degree_match = re.search(r'(bachelor|master|phd|b\.?s\.?|m\.?s\.?|mba)', line_lower)
            year_match = re.search(r'(20\d{2}|19\d{2})', line)
            
            if degree_match or year_match:
                education.append({
                    "degree": degree_match.group().upper() if degree_match else "",
                    "institution": line.strip(),
                    "year": year_match.group() if year_match else ""
                })
    
    return education

def extract_experience(text: str) -> List[Dict[str, str]]:
    """Extract work experience"""
    experience = []
    
    # Look for experience-related keywords
    exp_keywords = ["experience", "work", "employment", "job", "position"]
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in exp_keywords):
            # Try to extract company, role, dates
            company_match = re.search(r'([A-Z][a-zA-Z\s&]+(?:Inc|Corp|LLC|Ltd|Company))', line)
            date_match = re.search(r'(20\d{2}|19\d{2})', line)
            
            if company_match or date_match:
                experience.append({
                    "company": company_match.group() if company_match else "",
                    "role": line.strip(),
                    "dates": date_match.group() if date_match else ""
                })
    
    return experience

def extract_projects(text: str) -> List[str]:
    """Extract project information"""
    projects = []
    
    # Look for project-related keywords
    project_keywords = ["project", "developed", "built", "created", "implemented"]
    lines = text.split('\n')
    
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in project_keywords):
            if len(line.strip()) > 10:  # Filter out very short lines
                projects.append(line.strip())
    
    return projects[:5]  # Limit to 5 projects

def extract_certifications(text: str) -> List[str]:
    """Extract certifications"""
    certifications = []
    
    # Look for certification-related keywords
    cert_keywords = ["certified", "certification", "certificate", "aws", "azure", "google", "cisco"]
    lines = text.split('\n')
    
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in cert_keywords):
            if len(line.strip()) > 5:
                certifications.append(line.strip())
    
    return certifications

def calculate_confidence_score(extracted_data: Dict[str, Any]) -> float:
    """Calculate confidence score based on extracted data quality"""
    score = 0.0
    total_fields = 0
    
    if extracted_data.get("name"):
        score += 1.0
    total_fields += 1
    
    if extracted_data.get("email"):
        score += 1.0
    total_fields += 1
    
    if extracted_data.get("phone"):
        score += 1.0
    total_fields += 1
    
    if extracted_data.get("skills"):
        score += min(len(extracted_data["skills"]) / 5.0, 1.0)
    total_fields += 1
    
    if extracted_data.get("experience"):
        score += min(len(extracted_data["experience"]) / 3.0, 1.0)
    total_fields += 1
    
    if extracted_data.get("education"):
        score += min(len(extracted_data["education"]) / 2.0, 1.0)
    total_fields += 1
    
    return (score / total_fields) * 100

def parse_resume(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """Main parsing function"""
    # Determine file type and extract text
    if filename.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_bytes)
    elif filename.lower().endswith('.docx'):
        text = extract_text_from_docx(file_bytes)
    else:
        return {"error": "Unsupported file format"}
    
    if not text.strip():
        return {"error": "Could not extract text from file"}
    
    # Extract all information
    contact_info = extract_contact_info(text)
    name = extract_name(text)
    skills = extract_skills(text)
    education = extract_education(text)
    experience = extract_experience(text)
    projects = extract_projects(text)
    certifications = extract_certifications(text)
    
    # Compile results
    result = {
        "name": name,
        "email": contact_info["email"],
        "phone": contact_info["phone"],
        "linkedin": contact_info["linkedin"],
        "skills": skills,
        "education": education,
        "experience": experience,
        "projects": projects,
        "certifications": certifications,
        "confidence_score": 0.0
    }
    
    # Calculate confidence score
    result["confidence_score"] = calculate_confidence_score(result)
    
    return result 