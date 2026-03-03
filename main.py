from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
from data_manager import data_manager
from recommendation_model import recommendation_engine
from compiler_service import compiler_service
from scorecard_db import save_scorecard, get_all_scorecards, get_scorecard
from pdf_service import generate_scorecard_pdf, generate_ats_pdf
import uvicorn, uuid, os, io
import requests as ext_req

app = FastAPI(title="Mock Test API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnswerSubmission(BaseModel):
    results: List[Dict]

class CompileRequest(BaseModel):
    language: str
    code: str

class TestRequest(BaseModel):
    language: str
    code: str
    problem_id: str

class ChatRequest(BaseModel):
    message: str
    history: List[Dict] = []

@app.get("/api/departments")
def get_depts():
    return data_manager.get_departments()

@app.get("/api/questions/{dept}")
def get_questions(dept: str):
    questions = data_manager.get_questions_by_dept(dept)
    if not questions:
        raise HTTPException(status_code=404, detail="Department not found")
    return questions

@app.get("/api/companies")
def get_companies():
    return data_manager.get_companies()

@app.get("/api/questions/company/{company}")
def get_company_questions(company: str):
    questions = data_manager.get_questions_by_company(company)
    if not questions:
        raise HTTPException(status_code=404, detail="Company not found")
    return questions

@app.get("/api/hr/categories")
def get_hr_categories():
    return data_manager.get_hr_categories()

@app.get("/api/hr/questions")
def get_hr_questions(category: str = None):
    return data_manager.get_hr_questions(category)

@app.post("/api/recommend")
def get_recommendation(submission: AnswerSubmission):
    recommendations = recommendation_engine.get_recommendations(submission.results)
    return recommendations

@app.post("/api/compile")
def compile_code(request: CompileRequest):
    result = compiler_service.run_code(request.language, request.code)
    return result

@app.get("/api/coding/questions")
def get_coding_questions():
    return data_manager.get_coding_problems()

@app.post("/api/coding/test")
def test_coding_submission(request: TestRequest):
    problems = data_manager.get_coding_problems()
    problem = next((p for p in problems if p['id'] == request.problem_id), None)
    if not problem:
        return {"error": "Problem not found"}
    
    result = compiler_service.test_code(request.language, request.code, problem['test_cases'])
    return result

@app.post("/api/chat")
def chat_with_ollama(request: ChatRequest):
    """Proxy chat messages to the local Ollama llama3.2 model."""
    import requests as req
    import json
    
    system_prompt = "You are an expert AI Placement Assistant. Help users with DSA questions, coding challenges, interview prep, study plans, and career advice. Be concise and supportive."
    
    messages = [{"role": "system", "content": system_prompt}]
    for h in request.history:
        messages.append(h)
    messages.append({"role": "user", "content": request.message})
    
    try:
        response = req.post(
            "http://localhost:11434/api/chat",
            json={"model": "llama3.2", "messages": messages, "stream": False},
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        reply = data.get("message", {}).get("content", "No response from model.")
        return {"reply": reply}
    except Exception as e:
        return {"error": f"Ollama error: {str(e)}. Make sure Ollama is running."}

@app.get("/api/performance")
def get_performance():
    """Returns simulated user performance across topics for the AI agent's weakness analyzer."""
    return {
        "performance": {
            "Data Structures": 30,
            "Algorithms": 60,
            "System Design": 90,
            "Behavioral": 40,
            "Graphs": 35,
            "Dynamic Programming": 50,
            "Trees": 55,
            "Sorting & Searching": 70
        },
        "recommendation": "Focus on Data Structures, Graphs, and Behavioral as they have the lowest scores."
    }


class ScorecardSubmit(BaseModel):
    name: str = "Anonymous"
    category: str
    score: int
    total: int
    recommendations: list = []

@app.post("/api/scorecards")
def submit_scorecard(data: ScorecardSubmit):
    """Save a quiz result to the SQLite scorecard history."""
    session_id = str(uuid.uuid4())[:8]
    result = save_scorecard(
        session_id=session_id,
        name=data.name,
        category=data.category,
        score=data.score,
        total=data.total,
        recommendations=data.recommendations
    )
    return {"session_id": session_id, **result}

@app.get("/api/scorecards")
def list_scorecards():
    """Return the last 20 scorecard entries."""
    return get_all_scorecards()

class ReportPayload(BaseModel):
    id: str
    name: str = "Anonymous"
    category: str
    created_at: str
    score: int
    total: int
    percentage: int
    recommendations: str = ""

@app.post("/api/report/generate")
def generate_report_from_json(data: ReportPayload):
    """Generate and return a PDF report from a raw JSON payload (e.g., from Supabase)."""
    sc = {
        "session_id": data.id,
        "name": data.name,
        "category": data.category,
        "created_at": data.created_at,
        "score": data.score,
        "total": data.total,
        "percentage": data.percentage,
        "recommendations": data.recommendations
    }
    pdf_path = generate_scorecard_pdf(sc)
    return FileResponse(pdf_path, media_type="application/pdf", filename=f"report_{data.id}.pdf")


@app.post("/api/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """Accept a PDF or text resume and return an ATS score using local Ollama."""
    import PyPDF2

    content = await file.read()
    resume_text = ""

    if file.filename.lower().endswith(".pdf"):
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            for page in reader.pages:
                resume_text += page.extract_text() or ""
        except Exception as e:
            return {"error": f"Could not parse PDF: {e}"}
    else:
        resume_text = content.decode("utf-8", errors="ignore")

    if not resume_text.strip():
        return {"error": "Could not extract text from the resume."}

    resume_text = resume_text[:3000]

    prompt = f"""You are an expert ATS (Applicant Tracking System) evaluator.
Analyze the following resume and return a STRICTLY VALID JSON object with:
- "ats_score": a number from 0-100
- "feedback": a 2-3 paragraph constructive analysis (use plain text, NO newlines or unescaped quotes inside the string)
- "strengths": list of 3 resume strengths (strings without quotes inside)
- "improvements": list of 3 top improvements (strings without quotes inside)

RESUME:
{resume_text}

OUTPUT ONLY VALID JSON. Do not use blockquotes, do not use markdown, do not add any text before or after the {{...}} object."""

    try:
        response = ext_req.post("http://localhost:11434/api/generate",
                            json={"model": "llama3.2", "prompt": prompt, "stream": False, "format": "json"},
                            timeout=60)
        response.raise_for_status()
        import json, re
        raw = response.json().get("response", "")
        
        raw = raw.replace("```json", "").replace("```", "").strip()
        
        json_match = re.search(r'\{[\s\S]*\}', raw)
        if json_match:
            try:
                clean_json_str = re.sub(r'[\r\n\t]', ' ', json_match.group())
                result = json.loads(clean_json_str)
            except json.JSONDecodeError as jde:
                result = {"ats_score": 50, "feedback": f"Could not parse AI response correctly: {jde}", "strengths": [], "improvements": []}
        else:
            result = {"ats_score": 50, "feedback": raw, "strengths": [], "improvements": []}

        session_id = str(uuid.uuid4())[:8]
        result["session_id"] = session_id
        generate_ats_pdf(result)
        return result
    except Exception as e:
        return {"error": f"Ollama ATS analysis failed: {str(e)}"}


@app.get("/api/study-material/{dept}")
def generate_study_material(dept: str, timeline: str = "1 Month"):
    """Generate a domain-specific study plan using local Ollama model."""
    import requests as req
    prompt = f"Generate a concise, 3-point core subjects study syllabus for a student preparing for technical placement interviews specifically in the {dept} department. Create a study plan for a timeline of {timeline}. Provide focused topics. Keep it plain text and strictly under 150 words total. Do not include introductory text, just the bullet points."
    
    try:
        response = req.post("http://localhost:11434/api/generate",
                            json={"model": "llama3.2", "prompt": prompt, "stream": False},
                            timeout=60)
        response.raise_for_status()
        reply = response.json().get("response", "Could not generate study material.")
        return {"material": reply}
    except Exception as e:
        return {"error": f"Ollama failed to generate material: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
