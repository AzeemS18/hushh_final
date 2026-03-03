import pandas as pd
import os

EXCEL_PATH = r'E:\Hushh-Hackathon\Final1.xlsx'
COMPANY_DATA_DIR = r'E:\Hushh-Hackathon\interview-company-wise-problems-main'
HR_DATA_PATH = r'E:\Hushh-Hackathon\HR Interview Questions and Ideal Answers\hr_interview_questions_dataset.json'

class DataManager:
    def __init__(self):
        self.df = pd.read_excel(EXCEL_PATH)
        self.df.columns = [c.strip() for c in self.df.columns]
        self.dept_col = 'Domain Name'
        self.question_col = 'Question'
        self.option1 = 'Option 1'
        self.option2 = 'Option 2'
        self.option3 = 'Option 3'
        self.option4 = 'Option 4'
        self.answer_col = 'Answer'
        self.explanation_col = 'Explanation'
        self.topic_col = 'Topic Name'
        self.difficulty_col = 'Difficulty (Easy/Medium/Hard)'

    def get_departments(self):
        return sorted(self.df[self.dept_col].dropna().unique().tolist())

    def get_questions_by_dept(self, dept):
        dept_data = self.df[self.df[self.dept_col] == dept].drop_duplicates(subset=[self.question_col])
        
        dept_data = dept_data.sample(frac=1).reset_index(drop=True)
        
        dept_data = dept_data.head(15)
        
        questions = []
        for i, row in dept_data.iterrows():
            opts = [str(row[self.option1]), str(row[self.option2]), str(row[self.option3]), str(row[self.option4])]
            opts = [o if o.lower() != 'nan' else 'N/A' for o in opts]
            
            questions.append({
                "id": str(i),
                "text": str(row[self.question_col]),
                "options": opts,
                "answer": str(row[self.answer_col]),
                "explanation": str(row[self.explanation_col]),
                "topic": str(row[self.topic_col]) if self.topic_col in row else "General",
                "difficulty": str(row[self.difficulty_col]) if self.difficulty_col in row else "Medium"
            })
        return questions

    def get_companies(self):
        if not os.path.exists(COMPANY_DATA_DIR):
            return []
        companies = [d for d in os.listdir(COMPANY_DATA_DIR) if os.path.isdir(os.path.join(COMPANY_DATA_DIR, d))]
        return sorted(companies)

    def get_questions_by_company(self, company):
        company_path = os.path.join(COMPANY_DATA_DIR, company, "5. All.csv")
        if not os.path.exists(company_path):
            csv_files = [f for f in os.listdir(os.path.join(COMPANY_DATA_DIR, company)) if f.endswith('.csv')]
            if not csv_files:
                return []
            company_path = os.path.join(COMPANY_DATA_DIR, company, csv_files[0])
        
        try:
            df = pd.read_csv(company_path)
            questions = []
            for i, row in df.iterrows():
                questions.append({
                    "id": f"comp_{company}_{i}",
                    "text": f"Problem: {row['Title']}\n\nTopics: {row['Topics']}\nAcceptance: {row['Acceptance Rate']:.2%}",
                    "options": ["Solved", "Not Solved", "In Progress", "Skip"], # These are practice problems, providing generic status options
                    "answer": "Solved", # Placeholder for interactive check
                    "explanation": f"This is a {row['Difficulty']} level problem from {company}. Check it out here: {row['Link']}",
                    "topic": str(row['Topics']).split(',')[0],
                    "difficulty": str(row['Difficulty']),
                    "link": str(row['Link']) if 'Link' in row else "#"
                })
            return questions
        except Exception as e:
            print(f"Error loading company data for {company}: {e}")
            return []

    def get_hr_questions(self, category=None):
        if not os.path.exists(HR_DATA_PATH):
            return []
        
        questions = []
        try:
            import json
            with open(HR_DATA_PATH, 'r', encoding='utf-8') as f:
                chunk = f.read(1024 * 1024)
                last_brace = chunk.rfind('}')
                if last_brace != -1:
                    data = json.loads(chunk[:last_brace+1] + ']')
                    for i, item in enumerate(data):
                        if category and item.get('category') != category:
                            continue
                        questions.append({
                            "id": f"hr_{i}",
                            "text": item.get('question', 'N/A'),
                            "options": ["Excellent", "Good", "Needs Improvement", "Skip"],
                            "answer": "Excellent",
                            "explanation": f"Ideal Answer: {item.get('ideal_answer', 'N/A')}",
                            "topic": item.get('category', 'HR'),
                            "difficulty": "General"
                        })
        except Exception as e:
            print(f"Error sampling HR data: {e}")
        
        import random
        random.shuffle(questions)
        return questions[:20]

    def get_hr_categories(self):
        if not os.path.exists(HR_DATA_PATH):
            return []
        
        categories = set()
        try:
            import json
            with open(HR_DATA_PATH, 'r', encoding='utf-8') as f:
                chunk = f.read(1024 * 1024)
                last_brace = chunk.rfind('}')
                if last_brace != -1:
                    data = json.loads(chunk[:last_brace+1] + ']')
                    for item in data:
                        cat = item.get('category')
                        if cat:
                            categories.add(cat)
        except Exception as e:
            print(f"Error getting HR categories: {e}")
        
        return sorted(list(categories)) if categories else ["General", "Behavioral", "Teamwork"]

    def get_coding_problems(self):
        return [
            {
                "id": "coding_1",
                "title": "Two Sum",
                "difficulty": "Easy",
                "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
                "starter_code": {
                    "python": "def solution(nums, target):\n    # Write your code here\n    pass",
                    "java": "import java.util.*;\n\npublic class Solution {\n    public int[] solution(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}"
                },
                "test_cases": [
                    {"input": "[2,7,11,15], 9", "expected": "[0, 1]"},
                    {"input": "[3,2,4], 6", "expected": "[1, 2]"}
                ]
            },
            {
                "id": "coding_2",
                "title": "Palindrome Number",
                "difficulty": "Easy",
                "description": "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nExample:\nInput: x = 121\nOutput: true",
                "starter_code": {
                    "python": "def solution(x):\n    # Write your code here\n    pass",
                    "java": "public class Solution {\n    public boolean solution(int x) {\n        // Write your code here\n        return false;\n    }\n}"
                },
                "test_cases": [
                    {"input": "121", "expected": "True"},
                    {"input": "-121", "expected": "False"},
                    {"input": "10", "expected": "False"}
                ]
            },
            {
                "id": "coding_3",
                "title": "Reverse Linked List",
                "difficulty": "Easy",
                "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\nExample:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
                "starter_code": {
                    "python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef solution(head):\n    # Write your code here\n    pass",
                    "java": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\npublic class Solution {\n    public ListNode solution(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}"
                },
                "test_cases": [
                    {"input": "[1,2,3,4,5]", "expected": "[5,4,3,2,1]"}
                ]
            },
            {
                "id": "coding_4",
                "title": "Longest Substring Without Repeating Characters",
                "difficulty": "Medium",
                "description": "Given a string `s`, find the length of the longest substring without repeating characters.\n\nExample:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.",
                "starter_code": {
                    "python": "def solution(s):\n    # Write your code here\n    pass",
                    "java": "public class Solution {\n    public int solution(String s) {\n        // Write your code here\n        return 0;\n    }\n}"
                },
                "test_cases": [
                    {"input": "\"abcabcbb\"", "expected": "3"},
                    {"input": "\"bbbbb\"", "expected": "1"},
                    {"input": "\"pwwkew\"", "expected": "3"}
                ]
            },
            {
                "id": "coding_5",
                "title": "Merge k Sorted Lists",
                "difficulty": "Hard",
                "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\nMerge all the linked-lists into one sorted linked-list and return it.\n\nExample:\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]",
                "starter_code": {
                    "python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef solution(lists):\n    # Write your code here\n    pass",
                    "java": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\npublic class Solution {\n    public ListNode solution(ListNode[] lists) {\n        // Write your code here\n        return null;\n    }\n}"
                },
                "test_cases": [
                    {"input": "[[1,4,5],[1,3,4],[2,6]]", "expected": "[1,1,2,3,4,4,5,6]"}
                ]
            }
        ]

data_manager = DataManager()
