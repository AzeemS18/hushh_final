-- Seed sample questions for assessments

INSERT INTO public.questions (domain, category, difficulty, question_text, options, correct_answer, explanation, skills_tested) VALUES

-- DSA - Arrays (Easy)
('DSA', 'Arrays', 'Easy', 
'What is the time complexity of accessing an element in an array by index?',
'{"a": "O(1)", "b": "O(n)", "c": "O(log n)", "d": "O(n^2)"}',
'a',
'Array access by index is a constant time operation because arrays store elements contiguously in memory.',
'{"Array fundamentals", "Time complexity"}'),

('DSA', 'Arrays', 'Easy',
'Which of the following is NOT a valid array operation in most languages?',
'{"a": "Accessing an element by index", "b": "Sorting the array", "c": "Changing the size of a fixed-size array", "d": "Iterating through elements"}',
'c',
'Fixed-size arrays cannot change their size after creation. You would need to create a new array.',
'{"Array fundamentals"}'),

-- DSA - Arrays (Medium)
('DSA', 'Arrays', 'Medium',
'What is the time complexity of finding the maximum element in an unsorted array?',
'{"a": "O(log n)", "b": "O(1)", "c": "O(n)", "d": "O(n log n)"}',
'c',
'You must examine each element to find the maximum, requiring O(n) time.',
'{"Array algorithms", "Time complexity"}'),

('DSA', 'Arrays', 'Medium',
'Which sorting algorithm has O(n log n) time complexity in the best case?',
'{"a": "Bubble sort", "b": "Merge sort", "c": "Selection sort", "d": "Insertion sort"}',
'b',
'Merge sort consistently achieves O(n log n) time complexity, even in the best case.',
'{"Sorting algorithms", "Time complexity"}'),

-- DSA - Arrays (Hard)
('DSA', 'Arrays', 'Hard',
'You have an array of integers. What is the optimal approach to find if two numbers sum to a target?',
'{"a": "Brute force - O(n^2)", "b": "Sorting then two-pointer - O(n log n)", "c": "Hash set - O(n)", "d": "All approaches are equally good"}',
'c',
'Using a hash set to store seen numbers gives O(n) time with O(n) space, which is optimal.',
'{"Two sum problem", "Hash tables", "Optimization"}'),

-- System Design (Easy)
('System Design', 'Scalability', 'Easy',
'What does CRUD stand for?',
'{"a": "Create, Read, Update, Delete", "b": "Create, Request, Update, Database", "c": "Cache, Route, Upload, Deploy", "d": "Copy, Retrieve, Upgrade, Distribute"}',
'a',
'CRUD represents the four basic operations for persistent storage.',
'{"Database basics", "API design"}'),

-- System Design (Medium)
('System Design', 'Databases', 'Medium',
'What is the primary advantage of using a database index?',
'{"a": "Reduces storage space", "b": "Speeds up query performance", "c": "Automatically backs up data", "d": "Encrypts sensitive data"}',
'b',
'Indexes create data structures that allow faster data retrieval, significantly speeding up queries.',
'{"Database optimization", "Indexing"}'),

-- System Design (Hard)
('System Design', 'Distributed Systems', 'Hard',
'In a distributed system with eventual consistency, what does this mean?',
'{"a": "All nodes are always perfectly in sync", "b": "Updates will eventually propagate to all nodes", "c": "The system can never lose data", "d": "Transactions happen instantaneously"}',
'b',
'Eventual consistency means that after an update, all nodes will eventually have the same data, but not immediately.',
'{"Distributed systems", "CAP theorem", "Consistency"}'),

-- Communication (Easy)
('Communication', 'Technical Speaking', 'Easy',
'When explaining a technical concept, what is the most important first step?',
'{"a": "Start with the most complex details", "b": "Use the largest vocabulary possible", "c": "Understand your audience level", "d": "Jump straight to the solution"}',
'c',
'Tailoring your explanation to your audience ensures clarity and comprehension.',
'{"Communication", "Audience analysis"}'),

-- Communication (Medium)
('Communication', 'Writing', 'Medium',
'What makes a good technical document?',
'{"a": "Using long, complex sentences", "b": "Including all possible information", "c": "Clear structure with examples", "d": "Avoiding diagrams and visuals"}',
'c',
'Good technical documentation has clear structure, examples, and appropriate visuals to aid understanding.',
'{"Technical writing", "Documentation"}'),

-- Web Development (Easy)
('Web Dev', 'HTML/CSS', 'Easy',
'What does HTML stand for?',
'{"a": "Hypertext Markup Language", "b": "High Tech Modern Language", "c": "Home Tool Markup Language", "d": "Hyperlinks and Text Markup Language"}',
'a',
'HTML (Hypertext Markup Language) is the standard markup language for web pages.',
'{"Web basics", "HTML"}'),

-- Web Development (Medium)
('Web Dev', 'JavaScript', 'Medium',
'What is the time complexity of Array.sort() in JavaScript?',
'{"a": "Always O(n log n)", "b": "Always O(n^2)", "c": "Typically O(n log n) but depends on implementation", "d": "O(n)"}',
'c',
'JavaScript engines use different sorting algorithms; most modern engines use quicksort or mergesort which average O(n log n).',
'{"JavaScript", "Performance", "Algorithms"}'),

-- Web Development (Hard)
('Web Dev', 'Performance', 'Hard',
'Which strategy best reduces initial page load time?',
'{"a": "Load all JavaScript upfront", "b": "Code splitting and lazy loading", "c": "Increase bundle size for more features", "d": "No optimization needed"}',
'b',
'Code splitting and lazy loading defer non-critical code until needed, significantly reducing initial load time.',
'{"Web performance", "Optimization", "User experience"}'),

-- Python (Easy)
('Python', 'Basics', 'Easy',
'What data structure in Python is most similar to a JavaScript array?',
'{"a": "String", "b": "Tuple", "c": "List", "d": "Set"}',
'c',
'Python lists are ordered, mutable collections similar to JavaScript arrays.',
'{"Python", "Data structures"}'),

-- Python (Medium)
('Python', 'Object-Oriented', 'Medium',
'What is inheritance in Python?',
'{"a": "A way to copy code", "b": "A mechanism for a class to inherit properties from a parent class", "c": "Only for financial code", "d": "A way to delete objects"}',
'b',
'Inheritance allows a class to reuse and extend properties and methods from a parent class.',
'{"OOP", "Python", "Inheritance"}');

-- Create index on difficulty for faster filtering
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_domain ON public.questions(domain);
