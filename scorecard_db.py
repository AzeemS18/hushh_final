import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "scorecards.db")

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS scorecards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                name TEXT DEFAULT 'Anonymous',
                category TEXT,
                score INTEGER,
                total INTEGER,
                percentage REAL,
                recommendations TEXT,
                created_at TEXT
            )
        """)
    print("[DB] Scorecard table ready.")

def save_scorecard(session_id, name, category, score, total, recommendations):
    percentage = round((score / total) * 100, 1) if total > 0 else 0
    with get_conn() as conn:
        conn.execute("""
            INSERT INTO scorecards (session_id, name, category, score, total, percentage, recommendations, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (session_id, name, category, score, total, percentage,
              json.dumps(recommendations), datetime.now().isoformat()))
    return {"session_id": session_id, "percentage": percentage}

def get_all_scorecards(limit=20):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM scorecards ORDER BY created_at DESC LIMIT ?", (limit,)
        ).fetchall()
    return [dict(r) for r in rows]

def get_scorecard(session_id):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM scorecards WHERE session_id = ?", (session_id,)
        ).fetchone()
    return dict(row) if row else None

init_db()
