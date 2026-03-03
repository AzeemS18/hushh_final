'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const DOMAIN_TESTS: Record<string, { title: string; difficulty: string; questions: number; time: string }[]> = {
  'data-structures-algorithms': [
    { title: 'Arrays & Lists Basics', difficulty: 'Easy', questions: 10, time: '20 min' },
    { title: 'Trees & Graphs Fundamentals', difficulty: 'Easy', questions: 10, time: '25 min' },
    { title: 'Sorting & Searching', difficulty: 'Medium', questions: 15, time: '30 min' },
    { title: 'Dynamic Programming Concepts', difficulty: 'Medium', questions: 12, time: '35 min' },
    { title: 'Advanced Algorithm Design', difficulty: 'Hard', questions: 15, time: '45 min' },
  ],
  'system-design': [
    { title: 'System Design Basics', difficulty: 'Easy', questions: 8, time: '25 min' },
    { title: 'Scalability Principles', difficulty: 'Medium', questions: 12, time: '35 min' },
    { title: 'Database Design Patterns', difficulty: 'Medium', questions: 10, time: '30 min' },
    { title: 'Distributed Systems Design', difficulty: 'Hard', questions: 15, time: '45 min' },
  ],
  'web-development': [
    { title: 'HTML & CSS Fundamentals', difficulty: 'Easy', questions: 10, time: '20 min' },
    { title: 'JavaScript Basics', difficulty: 'Easy', questions: 12, time: '25 min' },
    { title: 'React & Component Design', difficulty: 'Medium', questions: 15, time: '35 min' },
    { title: 'Performance & Optimization', difficulty: 'Hard', questions: 12, time: '40 min' },
  ],
  'cloud-computing': [
    { title: 'Cloud Fundamentals', difficulty: 'Easy', questions: 10, time: '20 min' },
    { title: 'AWS Core Services', difficulty: 'Medium', questions: 15, time: '35 min' },
    { title: 'Cloud Architecture', difficulty: 'Hard', questions: 12, time: '40 min' },
  ],
  'machine-learning': [
    { title: 'ML Basics', difficulty: 'Easy', questions: 10, time: '25 min' },
    { title: 'Supervised Learning', difficulty: 'Medium', questions: 12, time: '30 min' },
    { title: 'Deep Learning', difficulty: 'Hard', questions: 15, time: '45 min' },
  ],
}

const DIFFICULTY_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Easy: 'secondary',
  Medium: 'default',
  Hard: 'destructive',
}

export default function DomainTestsPage() {
  const params = useParams()
  const router = useRouter()
  const domain = params.domain as string
  const tests = DOMAIN_TESTS[domain] || []

  const getDomainTitle = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{getDomainTitle(domain)} Tests</h1>
        <p className="text-muted-foreground">Practice tests tailored to this domain</p>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="pt-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No tests available for this domain yet.</p>
              <Button onClick={() => router.push('/learning-path')}>Choose Another Domain</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test, index) => (
            <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/assessment')}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{test.title}</CardTitle>
                    <CardDescription>{test.questions} questions • {test.time}</CardDescription>
                  </div>
                  <Badge variant={DIFFICULTY_COLORS[test.difficulty]}>
                    {test.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <Button className="w-full" onClick={() => router.push('/assessment')}>
                  Start Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.push('/dashboard')} className="flex-1">
          Back to Dashboard
        </Button>
        <Button variant="outline" onClick={() => router.push('/learning-path')} className="flex-1">
          Change Domain
        </Button>
      </div>
    </div>
  )
}
