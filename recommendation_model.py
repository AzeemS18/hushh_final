from typing import List, Dict
import pandas as pd
from collections import Counter

class RecommendationEngine:
    def get_recommendations(self, results: List[Dict]):
        """
        Results is a list of { "topic": str, "correct": bool, "difficulty": str }
        """
        wrong_topics = [res['topic'] for res in results if not res['correct']]
        topic_counts = Counter(wrong_topics)
        
        
        sorted_recommendations = [topic for topic, count in topic_counts.most_common()]
        
        recommendations = []
        for topic in sorted_recommendations:
            count = topic_counts[topic]
            recommendations.append({
                "topic": topic,
                "reason": f"You missed {count} questions in this area.",
                "priority": "High" if count > 2 else "Medium"
            })
            
        return recommendations

recommendation_engine = RecommendationEngine()
