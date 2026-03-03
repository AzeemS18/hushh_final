import os
import requests
import json
from openai import OpenAI

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_coding_problems",
            "description": "Fetch a list of available coding problems from the platform to present to the user.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "evaluate_code",
            "description": "Evaluate the user's Python or Java code submission against hidden test cases.",
            "parameters": {
                "type": "object",
                "properties": {
                    "problem_id": {"type": "string", "description": "The ID of the problem (e.g., 'coding_1')"},
                    "language": {"type": "string", "description": "The programming language ('python', 'java')"},
                    "code": {"type": "string", "description": "The raw code string submitted by the user"}
                },
                "required": ["problem_id", "language", "code"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_performance_summary",
            "description": "Get a summary of the user's weak areas across different topics based on their historical mock test performance.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]

class PlacementAssistant:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        self.backend_url = "http://localhost:8000/api"
        self.system_prompt = """You are an expert AI Placement Assistant.
Your goal is to help users prepare for technical interviews by assigning them coding problems, evaluating their answers, and generating personalized study plans based on their weaknesses.

You have access to tools that connect directly to the placement platform's backend.
1. Use `get_coding_problems` to see what questions are available. 
2. Use `evaluate_code` when the user provides a solution to test it against our hidden test cases. 
3. Use `get_performance_summary` to understand their weak areas and generate a study plan.

IMPORTANT: Always respond in a supportive, constructive, and concise manner. Use markdown for code and formatting. Do not hallucinate test results; always rely on the tool output.
"""
        self.messages = [{"role": "system", "content": self.system_prompt}]

    def execute_tool(self, tool_call):
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)
        
        try:
            if name == "get_coding_problems":
                response = requests.get(f"{self.backend_url}/coding/questions")
                response.raise_for_status()
                probs = response.json()
                summary = [{"id": p['id'], "title": p['title'], "difficulty": p['difficulty'], "description": p['description']} for p in probs]
                return json.dumps(summary)
            
            elif name == "evaluate_code":
                response = requests.post(f"{self.backend_url}/coding/test", json=args)
                response.raise_for_status()
                return json.dumps(response.json())
                
            elif name == "get_performance_summary":
                response = requests.get(f"{self.backend_url}/performance")
                response.raise_for_status()
                return json.dumps(response.json())
            else:
                return json.dumps({"error": f"Tool {name} not found"})
        except Exception as e:
            return json.dumps({"error": f"Tool execution failed: {str(e)}"})

    def chat(self, user_message: str):
        self.messages.append({"role": "user", "content": user_message})
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=self.messages,
                tools=tools
            )
            
            msg = response.choices[0].message
            self.messages.append(msg)
            
            if msg.tool_calls:
                for tool_call in msg.tool_calls:
                    print(f"🔧 Assistant is analyzing data (Tool: {tool_call.function.name})...")
                    tool_result = self.execute_tool(tool_call)
                    
                    self.messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": tool_call.function.name,
                        "content": tool_result
                    })
                
                second_response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=self.messages
                )
                final_msg = second_response.choices[0].message
                self.messages.append(final_msg)
                return final_msg.content
            
            return msg.content
            
        except Exception as e:
            if len(self.messages) > 0 and self.messages[-1].get("role") == "user":
                self.messages.pop()
            return f"❌ AI Error: {str(e)}"

if __name__ == "__main__":
    print("AI Agent initialized. Ready to interface via Streamlit.")
