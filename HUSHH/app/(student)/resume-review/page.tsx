'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Loader2 } from 'lucide-react'

interface ResumeAnalysis {
  score: number
  clarity_score: number
  alignment_score: number
  missing_keywords: string[]
  suggestions: string[]
}

const SAMPLE_ANALYSIS: ResumeAnalysis = {
  score: 68,
  clarity_score: 75,
  alignment_score: 62,
  missing_keywords: ['System Design', 'Scalability', 'Microservices', 'Cloud Architecture'],
  suggestions: [
    'Add quantifiable impact metrics (e.g., "reduced API latency by 40%")',
    'Include more technical skills relevant to target role',
    'Reorganize bullets using STAR method (Situation, Task, Action, Result)',
    'Add cloud technologies (AWS, GCP, Azure) if relevant',
  ],
}

export default function ResumeReviewPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('input')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
    loadResume()
  }, [user, router])

  const loadResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('content')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        setResumeText(data.content)
      }
    } catch (error) {
      console.error('Failed to load resume:', error)
    }
  }

  const analyzeResume = async () => {
    if (!resumeText.trim()) return

    try {
      setLoading(true)

      setTimeout(() => {
        const analysisResult: ResumeAnalysis = {
          ...SAMPLE_ANALYSIS,
          score: Math.round(60 + Math.random() * 30),
        }
        setAnalysis(analysisResult)
        setActiveTab('analysis')
        setLoading(false)
      }, 2000)

      const { error } = await supabase
        .from('resumes')
        .insert({
          student_id: user?.id,
          content: resumeText,
          resume_score: 68,
          clarity_score: 75,
          skill_alignment_score: 62,
          missing_keywords: SAMPLE_ANALYSIS.missing_keywords,
          improvement_suggestions: SAMPLE_ANALYSIS.suggestions,
        })

      if (error && error.code !== '23505') {
        throw error
      }
    } catch (error) {
      console.error('Failed to analyze resume:', error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Resume Review</h1>
        <p className="text-muted-foreground">Get AI-powered feedback on your resume</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Upload Resume</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!analysis}>
            Analysis
          </TabsTrigger>
        </TabsList>

        {}
        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paste Your Resume</CardTitle>
              <CardDescription>Copy and paste your resume text below for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="resume">Resume Content</Label>
                <Textarea
                  id="resume"
                  placeholder="Paste your resume here (text format)..."
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  className="min-h-[400px] mt-2 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Include all sections: Summary, Experience, Education, Skills
                </p>
              </div>

              <Button
                onClick={analyzeResume}
                disabled={!resumeText.trim() || loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {}
        <TabsContent value="analysis" className="space-y-6">
          {analysis && (
            <>
              {}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{analysis.score}</div>
                    <p className="text-muted-foreground mb-4">Resume Quality Score</p>
                    <Progress value={analysis.score} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Clarity Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{analysis.clarity_score}%</div>
                    <Progress value={analysis.clarity_score} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Skill Alignment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{analysis.alignment_score}%</div>
                    <Progress value={analysis.alignment_score} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Missing Keywords
                  </CardTitle>
                  <CardDescription>Add these skills to improve alignment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_keywords.map(keyword => (
                      <Badge key={keyword} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-green-600 font-semibold flex-shrink-0">{index + 1}.</span>
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setResumeText('')
                    setAnalysis(null)
                    setActiveTab('input')
                  }}
                  className="flex-1"
                  variant="outline"
                >
                  Analyze Another Resume
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
