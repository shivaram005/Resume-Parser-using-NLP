# Smart Resume Parser using NLP

A beautiful, modern web-based Resume Parser that allows users to upload resumes (PDF or DOCX), parses the content using advanced NLP techniques, and displays structured data with confidence scoring.

## ✨ Features

### 🎯 Core Functionality
- **File Upload**: Drag & drop or click to upload PDF and DOCX resumes
- **NLP Parsing**: Advanced text extraction and information parsing
- **Structured Data**: Clean display of parsed information in organized sections
- **Confidence Scoring**: Real-time parsing accuracy assessment

### 📊 Extracted Information
- **Personal Info**: Name, Email, Phone, LinkedIn
- **Skills & Technologies**: 40+ programming languages, frameworks, and tools
- **Work Experience**: Company, Role, Dates, Description
- **Education**: Degree, Institution, Year, Grade
- **Projects**: Project names and descriptions
- **Certifications**: Professional certifications and achievements

### 🚀 Bonus Features
- **Export Functionality**: Download parsed data as JSON
- **Copy to Clipboard**: One-click data copying
- **Beautiful UI**: Modern, responsive design with animations
- **Real-time Feedback**: Loading states and progress indicators
- **Error Handling**: Graceful error messages and validation

## 🛠 Technical Stack

### Backend (FastAPI)
- **FastAPI**: Modern, fast web framework
- **PyMuPDF**: PDF text extraction
- **python-docx**: DOCX file processing
- **Regex**: Advanced pattern matching for contact info
- **Confidence Scoring**: Intelligent parsing accuracy assessment

### Frontend (HTML/CSS/JavaScript)
- **Tailwind CSS**: Modern, utility-first CSS framework
- **Animate.css**: Smooth animations and transitions
- **Font Awesome**: Beautiful icons
- **Vanilla JavaScript**: No framework dependencies

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
Open `frontend/index.html` in your browser.

### 3. Usage
1. Upload a PDF or DOCX resume
2. Wait for parsing to complete
3. View structured results with confidence score
4. Export data as JSON or copy to clipboard

## 📁 Project Structure

```
Resume-Parser-using-NLP/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── parser.py            # NLP parsing logic
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html           # Main application page
│   └── app.js              # Frontend logic
└── README.md               # This file
```

## 🔧 API Endpoints

### POST /upload
Upload and parse a resume file.

**Request:**
- Content-Type: multipart/form-data
- Body: file (PDF or DOCX)

**Response:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8901",
  "linkedin": "linkedin.com/in/johndoe",
  "skills": ["Python", "React", "AWS"],
  "education": [
    {
      "degree": "BACHELOR",
      "institution": "University Name",
      "year": "2020"
    }
  ],
  "experience": [
    {
      "company": "Tech Corp",
      "role": "Software Engineer",
      "dates": "2020-2022"
    }
  ],
  "projects": ["Project descriptions"],
  "certifications": ["AWS Certified"],
  "confidence_score": 85.5
}
```

## 🎨 UI Features

### Design Highlights
- **Gradient Backgrounds**: Beautiful blue-to-indigo gradients
- **Card-based Layout**: Clean, organized information display
- **Smooth Animations**: Fade-in effects and transitions
- **Responsive Design**: Works on desktop and mobile
- **Interactive Elements**: Hover effects and visual feedback

### User Experience
- **Drag & Drop**: Intuitive file upload
- **Real-time Feedback**: Loading states and progress bars
- **Error Handling**: Clear error messages
- **Export Options**: Multiple ways to save data

## 🔮 Future Enhancements

- **spaCy Integration**: Advanced Named Entity Recognition
- **Role Classification**: Automatic job role detection
- **CSV Export**: Additional export format
- **Batch Processing**: Multiple file upload support
- **Template Matching**: Resume format detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using FastAPI, Tailwind CSS, and modern web technologies.** 