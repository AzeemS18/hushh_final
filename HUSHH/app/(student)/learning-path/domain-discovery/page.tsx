'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  domain: string
}

const DISCOVERY_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'What interests you most?',
    options: ['Problem-solving algorithms', 'System architecture', 'Web/Frontend development', 'Cloud infrastructure', 'Data analysis'],
    domain: 'general',
  },
  {
    id: '2',
    question: 'What is your experience level with coding?',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    domain: 'general',
  },
  {
    id: '3',
    question: 'Which area excites you most?',
    options: ['Optimizing code efficiency', 'Designing scalable systems', 'Building user interfaces', 'Managing cloud resources', 'Processing large datasets'],
    domain: 'general',
  },
]

const DOMAIN_MAPPING: Record<string, string> = {
  'Problem-solving algorithms': 'Data Structures & Algorithms',
  'System architecture': 'System Design',
  'Web/Frontend development': 'Web Development',
  'Cloud infrastructure': 'Cloud Computing',
  'Data analysis': 'Machine Learning',
}

export default function DomainDiscoveryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [showRecommendation, setShowRecommendation] = useState(false)
  const [recommendedDomain, setRecommendedDomain] = useState<string>('')

  const question = DISCOVERY_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / DISCOVERY_QUESTIONS.length) * 100

  const handleNext = async () => {
    if (!selectedAnswer) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (currentQuestion < DISCOVERY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    } else {
      await calculateAndSaveDomain(newAnswers)
    }
  }

  const calculateAndSaveDomain = async (finalAnswers: string[]) => {
    try {
      setSubmitting(true)

      const domain = DOMAIN_MAPPING[finalAnswers[0]] || 'Data Structures & Algorithms'
      setRecommendedDomain(domain)
      setShowRecommendation(true)

      if (user) {
        const { error } = await supabase
          .from('students')
          .update({
            domain_preference: domain,
            knows_target_domain: true,
          })
          .eq('id', user.id)

        if (error) throw error
      }
    } catch (error) {
      console.error('Failed to save domain:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (showRecommendation) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Recommended Domain</h1>
          <p className="text-muted-foreground">Based on your interests and experience</p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-4">{recommendedDomain}</div>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                This domain matches your interests and will help you prepare effectively for placement interviews.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    const domainPath = recommendedDomain.toLowerCase().replace(/\s+/g, '-')
                    router.push(`/learning-path/${domainPath}/tests`)
                  }}
                  size="lg"
                  className="w-full"
                >
                  Start {recommendedDomain} Path
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/learning-path')}
                  className="w-full"
                >
                  Choose a Different Domain
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Domain Discovery Quiz</h1>
        <p className="text-muted-foreground">Let's find your perfect learning path (2 minutes)</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Progress value={progress} className="flex-1" />
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          {currentQuestion + 1} of {DISCOVERY_QUESTIONS.length}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            <div className="space-y-3">
              {question.options.map(option => (
                <div
                  key={option}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1)
                  setSelectedAnswer(answers[currentQuestion - 1] || '')
                }
              }}
              disabled={currentQuestion === 0 || submitting}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer || submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : currentQuestion === DISCOVERY_QUESTIONS.length - 1 ? (
                'Get Recommendation'
              ) : (
                'Next Question'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
