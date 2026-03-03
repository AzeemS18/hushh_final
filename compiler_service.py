import subprocess
import os
import tempfile
import uuid

class CompilerService:
    def __init__(self):
        self.temp_dir = os.path.join(tempfile.gettempdir(), "hushh_compiler")
        if not os.path.exists(self.temp_dir):
            os.makedirs(self.temp_dir)

    def execute_python(self, code):
        filename = f"{uuid.uuid4()}.py"
        filepath = os.path.join(self.temp_dir, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(code)
            
            result = subprocess.run(
                ["python", filepath],
                capture_output=True,
                text=True,
                timeout=5
            )
            return {
                "output": result.stdout,
                "error": result.stderr,
                "exit_code": result.returncode
            }
        except subprocess.TimeoutExpired:
            return {"output": "", "error": "Execution Timed Out (5s limit)", "exit_code": 1}
        except Exception as e:
            return {"output": "", "error": str(e), "exit_code": 1}
        finally:
            if os.path.exists(filepath):
                try: os.remove(filepath)
                except: pass

    def execute_java(self, code):
        class_name = "Main"
        if "public class" in code:
            try:
                class_name = code.split("public class")[1].split("{")[0].strip()
            except:
                pass
        
        unique_id = str(uuid.uuid4()).replace("-", "")
        session_dir = os.path.join(self.temp_dir, unique_id)
        os.makedirs(session_dir)
        
        filepath = os.path.join(session_dir, f"{class_name}.java")
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(code)
            
            compile_res = subprocess.run(
                ["javac", filepath],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if compile_res.returncode != 0:
                return {
                    "output": "",
                    "error": compile_res.stderr,
                    "exit_code": compile_res.returncode
                }
            
            run_res = subprocess.run(
                ["java", "-cp", session_dir, class_name],
                capture_output=True,
                text=True,
                timeout=5
            )
            return {
                "output": run_res.stdout,
                "error": run_res.stderr,
                "exit_code": run_res.returncode
            }
        except subprocess.TimeoutExpired:
            return {"output": "", "error": "Execution Timed Out (5s limit)", "exit_code": 1}
        except Exception as e:
            return {"output": "", "error": str(e), "exit_code": 1}
        finally:
            try:
                import shutil
                shutil.rmtree(session_dir)
            except: pass

    def run_code(self, language, code):
        if language.lower() == "python":
            return self.execute_python(code)
        elif language.lower() == "java":
            return self.execute_java(code)
        else:
            return {"output": "", "error": f"Language {language} not supported", "exit_code": 1}

    def test_code(self, language, code, test_cases):
        if language.lower() == "python":
            return self.test_python(code, test_cases)
        elif language.lower() == "java":
            return self.test_java(code, test_cases)
        else:
            return {"error": f"Language {language} not supported for testing"}

    def test_python(self, code, test_cases):
        unique_id = str(uuid.uuid4()).replace("-", "")
        code_filepath = os.path.join(self.temp_dir, f"code_{unique_id}.py")
        harness_filepath = os.path.join(self.temp_dir, f"harness_{unique_id}.py")
        
        try:
            with open(code_filepath, 'w', encoding='utf-8') as f:
                f.write(code)
            
            import json
            harness = """
import sys, io, json, types
import traceback

namespace = {}
with open(r'CODE_FILEPATH_PLACEHOLDER', 'r', encoding='utf-8') as f:
    user_code = f.read()

try:
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    exec(user_code, globals(), namespace)
    sys.stdout = old_stdout
except Exception as e:
    sys.stdout = old_stdout
    print(json.dumps({"error": "Compilation Error: " + str(e)}))
    sys.exit(0)

target_func = namespace.get('solution')
if not target_func:
    funcs = [var for name, var in namespace.items() if isinstance(var, types.FunctionType)]
    if funcs:
        target_func = funcs[-1]

if not target_func:
    print(json.dumps({"error": "No function found to evaluate. Please define a function."}))
    sys.exit(0)

test_cases = TEST_CASES_PLACEHOLDER
results = []

for tc in test_cases:
    try:
        args = eval("[" + tc['input'] + "]")
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        actual = target_func(*args)
        sys.stdout = old_stdout
        
        expected = eval(tc['expected'])
        passed = str(actual) == str(expected)
        results.append({"input": tc['input'], "expected": str(expected), "actual": str(actual), "passed": passed})
    except Exception as e:
        sys.stdout = old_stdout
        results.append({"input": tc['input'], "error": "Error: " + str(e), "passed": False})

print(json.dumps({"results": results}))
"""
            harness = harness.replace('CODE_FILEPATH_PLACEHOLDER', code_filepath)
            harness = harness.replace('TEST_CASES_PLACEHOLDER', json.dumps(test_cases))

            with open(harness_filepath, 'w', encoding='utf-8') as f:
                f.write(harness)
                
            result = subprocess.run(
                ["python", harness_filepath],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.stderr and not result.stdout.strip():
                return {"error": result.stderr}
                
            try:
                output_data = json.loads(result.stdout)
                if "error" in output_data:
                    return {"error": output_data["error"]}
                return output_data
            except Exception as e:
                return {"error": "Failed to parse test results. Output was: " + result.stdout[:200]}
                
        except subprocess.TimeoutExpired:
            return {"error": "Execution Timed Out (5s limit)"}
        except Exception as e:
            return {"error": str(e)}
        finally:
            if os.path.exists(code_filepath):
                try: os.remove(code_filepath)
                except: pass
            if os.path.exists(harness_filepath):
                try: os.remove(harness_filepath)
                except: pass

    def test_java(self, code, test_cases):
        
        
        harness_main = f"""
import java.util.*;

public class TestHarness {{
    public static void main(String[] args) {{
        Solution sol = new Solution();
        List<Map<String, String>> results = new ArrayList<>();
        
        // This is a simplified harness. In a real environment, we'd use reflection 
        // or a more robust testing framework.
        try {{
            // Test 1 logic here... 
            // Since Java is statically typed, we'd need problem-specific harnesses.
            // For now, let's keep it simple: we only support Python for full test-case validation 
            // in this POC, or we'd need a separate harness for each Java problem.
        }} catch (Exception e) {{
            e.printStackTrace();
        }}
    }}
}}
"""
        return {"error": "Automated test validation currently only supported for Python. Coming soon for Java!"}

compiler_service = CompilerService()
