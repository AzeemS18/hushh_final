const API_URL = 'http://localhost:8000/api';

let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let selectedOption = null;
let isStudyMode = false;

async function init() {
    try {
        const deptResponse = await fetch(`${API_URL}/departments`);
        const depts = await deptResponse.json();
        const deptContainer = document.getElementById('dept-container');

        depts.forEach(dept => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.innerHTML = `
                <h3>${dept}</h3>
                <p>Prepare with actual exam patterns.</p>
                <button class="btn" style="margin-top: 1.5rem;" onclick="startQuiz('${dept}', 'dept')">Start Test</button>
            `;
            deptContainer.appendChild(card);
        });

        const compResponse = await fetch(`${API_URL}/companies`);
        const companies = await compResponse.json();
        const compContainer = document.getElementById('company-container');

        companies.forEach(company => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.innerHTML = `
                <h3>${company}</h3>
                <p>Interview problems from top companies.</p>
                <button class="btn" style="margin-top: 1.5rem;" onclick="startQuiz('${company}', 'company')">Practice</button>
            `;
            compContainer.appendChild(card);
        });

        const hrResponse = await fetch(`${API_URL}/hr/categories`);
        const hrCategories = await hrResponse.json();
        const hrContainer = document.getElementById('hr-container');

        hrCategories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.innerHTML = `
                <h3>${cat}</h3>
                <p>Master your soft skills and behavioral answers.</p>
                <button class="btn" style="margin-top: 1.5rem;" onclick="startQuiz('${cat}', 'hr')">Practice</button>
            `;
            hrContainer.appendChild(card);
        });

        const codingResponse = await fetch(`${API_URL}/coding/questions`);
        const codingProblems = await codingResponse.json();
        const codingList = document.getElementById('coding-list');

        codingProblems.forEach(prob => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3>${prob.title}</h3>
                    <span class="difficulty-tag" style="background: ${prob.difficulty === 'Easy' ? '#4ade8022' : '#f8717122'}; color: ${prob.difficulty === 'Easy' ? '#4ade80' : '#f87171'}; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">${prob.difficulty}</span>
                </div>
                <p style="margin-top: 1rem; color: #94a3b8;">Master data structures and algorithms.</p>
                <button class="btn" style="margin-top: 1.5rem;" onclick="startCodingAssessment('${prob.id}')">Solve Challenge</button>
            `;
            codingList.appendChild(card);
        });

        setupTabs();
    } catch (e) {
        console.error("Error fetching data:", e);
    }
}

function setupTabs() {
    const deptBtn = document.getElementById('show-depts-btn');
    const compBtn = document.getElementById('show-companies-btn');
    const hrBtn = document.getElementById('show-hr-btn');
    const compilerBtn = document.getElementById('show-compiler-btn');
    const codingBtn = document.getElementById('show-coding-btn');
    const atsBtn = document.getElementById('show-ats-btn');
    const scoresBtn = document.getElementById('show-scores-btn');

    const sections = [
        document.getElementById('dept-section'),
        document.getElementById('company-section'),
        document.getElementById('hr-section'),
        document.getElementById('compiler-section'),
        document.getElementById('coding-section'),
        document.getElementById('ats-section'),
        document.getElementById('scores-section')
    ];
    const buttons = [deptBtn, compBtn, hrBtn, compilerBtn, codingBtn, atsBtn, scoresBtn];

    function hideAll() {
        sections.forEach(s => s && s.classList.add('hidden'));
        buttons.forEach(b => b && b.classList.remove('active-tab'));
        document.getElementById('quiz-section').classList.add('hidden');
        document.getElementById('result-section').classList.add('hidden');
    }

    deptBtn.onclick = () => { hideAll(); deptBtn.classList.add('active-tab'); sections[0].classList.remove('hidden'); };
    compBtn.onclick = () => { hideAll(); compBtn.classList.add('active-tab'); sections[1].classList.remove('hidden'); };
    hrBtn.onclick = () => { hideAll(); hrBtn.classList.add('active-tab'); sections[2].classList.remove('hidden'); };
    compilerBtn.onclick = () => { hideAll(); compilerBtn.classList.add('active-tab'); sections[3].classList.remove('hidden'); setupCompiler(); };
    codingBtn.onclick = () => { hideAll(); codingBtn.classList.add('active-tab'); sections[4].classList.remove('hidden'); showCodingList(); };
    atsBtn.onclick = () => { hideAll(); atsBtn.classList.add('active-tab'); sections[5].classList.remove('hidden'); setupATS(); };
    scoresBtn.onclick = () => { hideAll(); scoresBtn.classList.add('active-tab'); sections[6].classList.remove('hidden'); loadScorecards(); };
}

function showCodingList() {
    document.getElementById('coding-list').classList.remove('hidden');
    document.getElementById('coding-editor-flow').classList.add('hidden');
}

function setupCompiler() {
    const runBtn = document.getElementById('run-code-btn');
    const langSelect = document.getElementById('language-select');
    const codeEditor = document.getElementById('code-editor');
    const outputText = document.getElementById('terminal-output');

    const defaultCode = {
        python: `def main():
    print("Hello, Python!")

if __name__ == "__main__":
    main()`,
        java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`
    };

    langSelect.onchange = () => {
        codeEditor.value = defaultCode[langSelect.value];
    };

    runBtn.onclick = async () => {
        runBtn.disabled = true;
        runBtn.innerText = "Running...";
        outputText.innerText = "Executing your code...";
        outputText.style.color = "#4ade80";

        try {
            const response = await fetch(`${API_URL}/compile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: langSelect.value,
                    code: codeEditor.value
                })
            });

            const result = await response.json();

            if (result.error) {
                outputText.innerText = result.error;
                outputText.style.color = "#f87171"; // Error red
            } else {
                outputText.innerText = result.output || "Program finished with no output.";
                outputText.style.color = "#4ade80"; // Success green
            }
        } catch (e) {
            outputText.innerText = "Connection Error: Backend server might be down.";
            outputText.style.color = "#f87171";
        } finally {
            runBtn.disabled = false;
            runBtn.innerText = "Run Code";
        }
    };
}

async function startQuiz(id, type) {
    console.log(`Starting ${type} for: ${id}`);
    isStudyMode = (type === 'hr');

    document.getElementById('dept-section').classList.add('hidden');
    document.getElementById('company-section').classList.add('hidden');
    document.getElementById('hr-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');

    let url;
    if (type === 'dept') url = `${API_URL}/questions/${id}`;
    else if (type === 'company') url = `${API_URL}/questions/company/${id}`;
    else url = `${API_URL}/hr/questions?category=${id}`;

    const response = await fetch(url);
    currentQuestions = await response.json();
    console.log(`Fetched ${currentQuestions.length} questions.`);
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

function showQuestion() {
    console.log(`Showing question at index: ${currentQuestionIndex}`);
    const q = currentQuestions[currentQuestionIndex];
    if (!q) {
        showResults();
        return;
    }

    document.getElementById('progress').innerText = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    document.getElementById('question-text').innerText = q.text;

    const container = document.getElementById('options-container');
    container.innerHTML = '';
    selectedOption = null;

    if (isStudyMode) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'answer-input-container';
        inputContainer.innerHTML = `
            <textarea id="hr-answer-input" class="answer-textarea" placeholder="Type your answer here or use the voice button..."></textarea>
            <div class="input-actions">
                <button id="speech-btn" class="speech-btn">
                    <span>🎤</span> Voice Answer
                </button>
                <button id="submit-hr-answer" class="btn" style="flex: 1;">Submit Practice Answer</button>
            </div>
            <div id="hr-feedback" class="feedback-msg hidden"></div>
        `;
        container.appendChild(inputContainer);

        const speechBtn = document.getElementById('speech-btn');
        const hrInput = document.getElementById('hr-answer-input');
        const submitBtn = document.getElementById('submit-hr-answer');
        const feedback = document.getElementById('hr-feedback');

        speechBtn.onclick = () => startSpeechRecognition(hrInput, speechBtn);

        submitBtn.onclick = () => {
            if (!hrInput.value.trim()) {
                alert("Please type or speak your answer first!");
                return;
            }
            feedback.innerText = "That's a good practice answer! Now compare it with the ideal answer below.";
            feedback.classList.remove('hidden');

            const expDiv = document.createElement('div');
            expDiv.className = 'explanation-box';
            expDiv.style.marginTop = '1rem';
            expDiv.innerHTML = `<strong>Ideal Answer:</strong> <p style="margin-top: 0.5rem; font-weight: 300;">${q.explanation.replace('Ideal Answer: ', '')}</p>`;
            container.appendChild(expDiv);

            submitBtn.style.display = 'none';
            speechBtn.style.display = 'none';
            hrInput.disabled = true;
            selectedOption = 'Practice Completed'; // Mark as complete to allow 'Next'
        };
    } else {
        if (!q.options || q.options.length === 0 || q.options.every(o => o === 'N/A')) {
            container.innerHTML = '<p style="color: #f87171;">Question details missing. Please skip.</p>';
            selectedOption = "Skipped";
            return;
        }

        q.options.forEach(opt => {
            if (opt === 'N/A') return;
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedOption = opt;
            };
            container.appendChild(btn);
        });
    }
}

document.getElementById('next-btn').onclick = async () => {
    if (!selectedOption && !isStudyMode) {
        alert("Please select an option!");
        return;
    }
    if (!selectedOption && isStudyMode) selectedOption = 'Checked';

    const q = currentQuestions[currentQuestionIndex];
    userAnswers.push({
        questionId: q.id,
        selected: selectedOption,
        correct: isStudyMode ? true : selectedOption === q.answer,
        topic: q.topic,
        difficulty: q.difficulty,
        questionText: q.text,
        explanation: q.explanation,
        correctAnswer: q.answer
    });

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
};

async function showResults() {
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');

    const scoreDisplay = document.getElementById('score-display');
    const wrongListHead = document.querySelector('#result-section h3');
    const score = userAnswers.filter(a => a.correct).length;

    if (isStudyMode) {
        scoreDisplay.innerText = "Study Session Complete";
        scoreDisplay.style.fontSize = "2rem";
        wrongListHead.innerText = "Questions Reviewed & Ideal Answers";
    } else {
        scoreDisplay.innerText = `${score} / ${userAnswers.length}`;
        scoreDisplay.style.fontSize = "3rem";
        wrongListHead.innerText = "Wrong Questions & Explanations";
    }

    const wrongList = document.getElementById('wrong-answers-list');
    wrongList.innerHTML = '';

    const listToDisplay = isStudyMode ? userAnswers : userAnswers.filter(a => !a.correct);

    listToDisplay.forEach(ans => {
        const div = document.createElement('div');
        div.style.marginBottom = '1.5rem';
        div.style.padding = '1rem';
        div.style.background = isStudyMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(239, 68, 68, 0.1)';
        div.style.borderRadius = '12px';
        div.innerHTML = `
            <p><strong>${ans.questionText}</strong></p>
            ${!isStudyMode ? `<p style="color: #f87171;">Your answer: ${ans.selected}</p>` : ''}
            ${!isStudyMode ? `<p style="color: #4ade80;">Correct answer: ${ans.correctAnswer}</p>` : ''}
            <p style="margin-top: 0.5rem; border-top: 1px solid var(--glass-border); padding-top: 0.5rem;"><em>${ans.explanation}</em></p>
        `;
        wrongList.appendChild(div);
    });

    const recList = document.getElementById('recommendations-list');
    recList.innerHTML = '';

    if (isStudyMode) {
        document.querySelector('#result-section h3:nth-of-type(2)').classList.add('hidden');
        recList.classList.add('hidden');
    } else {
        document.querySelector('#result-section h3:nth-of-type(2)').classList.remove('hidden');
        recList.classList.remove('hidden');

        const recResponse = await fetch(`${API_URL}/recommend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ results: userAnswers.map(a => ({ topic: a.topic, correct: a.correct, difficulty: a.difficulty })) })
        });

        const recommendations = await recResponse.json();
        if (recommendations.length === 0) {
            recList.innerHTML = '<p>Great job! You have mastered all topics covered in this test.</p>';
        } else {
            recommendations.forEach(rec => {
                const div = document.createElement('div');
                div.className = 'rec-item';
                div.innerHTML = `<strong>${rec.topic}</strong>: ${rec.reason} (Priority: ${rec.priority})`;
                recList.appendChild(div);
            });
        }

        try {
            const scRes = await fetch(`${API_URL}/scorecards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Guest User',
                    category: currentQuestions[0]?.topic || 'Mock Assessment',
                    score: score,
                    total: userAnswers.length,
                    recommendations: recommendations
                })
            });
            const scData = await scRes.json();

            if (scData.session_id) {
                const dlContainer = document.createElement('div');
                dlContainer.style.textAlign = 'center';
                dlContainer.style.marginTop = '2rem';
                const dlBtn = document.createElement('a');
                dlBtn.href = `${API_URL}/report/${scData.session_id}`;
                dlBtn.target = "_blank";
                dlBtn.className = "btn";
                dlBtn.innerHTML = "⬇️ Download Scorecard PDF";
                dlContainer.appendChild(dlBtn);
                document.getElementById('result-section').appendChild(dlContainer);
            }
        } catch (e) {
            console.error("Could not save scorecard locally", e);
        }
    }
}

function startSpeechRecognition(targetInput, btn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
        console.log("Speech recognition started...");
        btn.classList.add('recording');
        btn.innerHTML = '<span>🛑</span> Stop Listening';
    };

    recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        if (finalTranscript) {
            targetInput.value += (targetInput.value ? ' ' : '') + finalTranscript;
            console.log("Captured speech:", finalTranscript);
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech Error:", event.error);
        if (event.error === 'not-allowed') {
            alert("Microphone access denied. Please allow microphone permissions in your browser settings.");
        } else if (event.error === 'no-speech') {
            console.warn("No speech detected.");
        } else {
            alert(`Speech Recognition Error: ${event.error}`);
        }
        stopRec();
    };

    recognition.onend = () => {
        console.log("Speech recognition ended.");
        stopRec();
    };

    function stopRec() {
        btn.classList.remove('recording');
        btn.innerHTML = '<span>🎤</span> Voice Answer';
        try { recognition.stop(); } catch (e) { }
    }

    if (btn.classList.contains('recording')) {
        stopRec();
    } else {
        recognition.start();
    }
}

async function startCodingAssessment(probId) {
    const response = await fetch(`${API_URL}/coding/questions`);
    const problems = await response.json();
    const prob = problems.find(p => p.id === probId);

    document.getElementById('coding-list').classList.add('hidden');
    document.getElementById('coding-editor-flow').classList.remove('hidden');

    document.getElementById('coding-problem-title').innerText = prob.title;
    document.getElementById('coding-problem-desc').innerText = prob.description;

    const editor = document.getElementById('coding-textarea');
    const langSelect = document.getElementById('coding-lang-select');
    const resultsContainer = document.getElementById('coding-test-results');
    const submitBtn = document.getElementById('submit-code-btn');

    resultsContainer.classList.add('hidden');
    langSelect.value = 'python';
    editor.value = prob.starter_code.python;

    langSelect.onchange = () => {
        editor.value = prob.starter_code[langSelect.value];
    };

    submitBtn.onclick = async () => {
        submitBtn.disabled = true;
        submitBtn.innerText = "Testing...";
        resultsContainer.classList.remove('hidden');
        const list = document.getElementById('test-results-list');
        list.innerHTML = 'Running test cases...';

        try {
            const res = await fetch(`${API_URL}/coding/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: langSelect.value,
                    code: editor.value,
                    problem_id: probId
                })
            });
            const data = await res.json();

            list.innerHTML = '';
            if (data.error) {
                list.innerHTML = `<p style="color: #f87171;">Error: ${data.error}</p>`;
            } else {
                data.results.forEach((r, idx) => {
                    const item = document.createElement('div');
                    item.className = `test-case-item ${r.passed ? 'passed' : ''}`;
                    item.innerHTML = `
                        <strong>Test Case ${idx + 1}: ${r.passed ? 'PASSED' : 'FAILED'}</strong><br>
                        Input: ${r.input}<br>
                        Expected: ${r.expected} | Actual: ${r.actual || (r.error ? `<span style="color: #f87171;">Error</span>` : 'N/A')}
                        ${r.error ? `<br><small style="color: #f87171;">${r.error}</small>` : ''}
                    `;
                    list.appendChild(item);
                });
            }
        } catch (e) {
            list.innerHTML = '<p style="color: #f87171;">Server Error</p>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit & Test";
        }
    };

    document.getElementById('back-to-coding-list').onclick = showCodingList;
}

let atsSetup = false;
function setupATS() {
    if (atsSetup) return;
    atsSetup = true;

    const fileInput = document.getElementById('resume-file');
    const filenameEl = document.getElementById('ats-filename');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultDiv = document.getElementById('ats-result');
    const uploadArea = document.getElementById('ats-upload-area');

    fileInput.onchange = () => {
        filenameEl.textContent = fileInput.files[0]?.name || '';
    };

    uploadArea.ondragover = (e) => { e.preventDefault(); uploadArea.style.borderColor = '#6366f1'; };
    uploadArea.ondragleave = () => { uploadArea.style.borderColor = ''; };
    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        fileInput.files = e.dataTransfer.files;
        filenameEl.textContent = fileInput.files[0]?.name || '';
    };

    analyzeBtn.onclick = async () => {
        if (!fileInput.files.length) { alert('Please choose a resume file first.'); return; }

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = '⏳ Analyzing with Local AI...';
        resultDiv.classList.add('hidden');

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            const res = await fetch('http://localhost:8000/api/resume/analyze', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const score = data.ats_score || 0;
            const scoreEl = document.getElementById('ats-score-display');
            scoreEl.textContent = `${score}%`;
            scoreEl.style.color = score >= 75 ? '#4ade80' : score >= 50 ? '#f59e0b' : '#f87171';
            const band = score >= 75 ? '🟢 Strong Resume' : score >= 50 ? '🟡 Moderate' : '🔴 Needs Work';
            document.getElementById('ats-band').textContent = band;

            let strengths = data.strengths || [];
            if (typeof strengths === 'string') strengths = strengths.split('\n').map(s => s.replace(/^- /, '').trim()).filter(Boolean);
            const strEl = document.getElementById('ats-strengths');
            strEl.innerHTML = strengths.map(s => `<li>${s}</li>`).join('');

            let improvements = data.improvements || [];
            if (typeof improvements === 'string') improvements = improvements.split('\n').map(s => s.replace(/^- /, '').trim()).filter(Boolean);
            const impEl = document.getElementById('ats-improvements');
            impEl.innerHTML = improvements.map(i => `<li>${i}</li>`).join('');

            document.getElementById('ats-feedback-box').textContent = data.feedback || '';

            if (data.session_id) {
                const dlBtn = document.getElementById('ats-download-btn');
                dlBtn.href = `http://localhost:8000/api/ats-report/${data.session_id}`;
                dlBtn.style.display = 'inline-block';
            }

            resultDiv.classList.remove('hidden');
        } catch (e) {
            alert(`Error: ${e.message}`);
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = '🔍 Analyze Resume';
        }
    };
}

async function loadScorecards() {
    const container = document.getElementById('scorecards-list');
    container.innerHTML = '<p style="color:#94a3b8;">Loading...</p>';
    try {
        const res = await fetch('http://localhost:8000/api/scorecards');
        const data = await res.json();
        if (!data.length) {
            container.innerHTML = '<p style="color:#94a3b8;grid-column:1/-1;">No scorecards yet. Complete a quiz to see your history here!</p>';
            return;
        }
        container.innerHTML = data.map(sc => {
            const color = sc.percentage >= 70 ? '#4ade80' : sc.percentage >= 40 ? '#f59e0b' : '#f87171';
            return `
            <div class="glass-card" style="padding:1.5rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <strong style="font-size:1.1rem;">${sc.name}</strong>
                        <p style="color:#94a3b8;font-size:0.85rem;">${sc.category} &bull; ${sc.created_at?.slice(0, 10)}</p>
                    </div>
                    <div style="font-size:2rem;font-weight:800;color:${color};">${sc.percentage}%</div>
                </div>
                <div style="margin-top:0.8rem;color:#cbd5e1;">${sc.score} / ${sc.total} correct</div>
                <a href="http://localhost:8000/api/report/${sc.session_id}" target="_blank"
                   class="btn btn-sm" style="display:inline-block;margin-top:1rem;text-decoration:none;">
                    ⬇️ Download Report
                </a>
            </div>`;
        }).join('');
    } catch (e) {
        container.innerHTML = '<p style="color:#f87171;">Could not load scorecards. Is the backend running?</p>';
    }
}


init();
