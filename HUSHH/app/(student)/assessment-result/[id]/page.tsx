'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader2, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Assessment {
  id: string
  test_number: number
  score: number
  skill_categories: Record<string, number>
  weak_areas: string[]
  strong_areas: string[]
  growth_rate_vs_previous: number
  forecast_7day: number
  forecast_14day: number
  created_at: string
}

export default function AssessmentResultPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadAssessment()
  }, [user, params.id, router])

  const loadAssessment = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', params.id)
        .eq('student_id', user?.id)
        .single()

      if (error) throw error
      setAssessment(data)
    } catch (error) {
      console.error('Failed to load assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Assessment Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chartData = Object.entries(assessment.skill_categories || {}).map(([category, score]) => ({
    category,
    score: score || 0,
  }))

  const getScoreColor = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 70) return 'default'
    if (score >= 50) return 'secondary'
    return 'destructive'
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    return <AlertCircle className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Score Summary */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Assessment Results</h1>
          <p className="text-muted-foreground">Test #{assessment.test_number}</p>
        </div>

        {/* Main Score Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">{assessment.score}</div>
              <p className="text-lg text-muted-foreground mb-4">Out of 100</p>
              <div className="flex justify-center gap-4">
                <Badge variant={getScoreColor(assessment.score)}>
                  {assessment.score >= 70 ? 'Excellent' : assessment.score >= 50 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="analysis" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {/* Skill Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Category Breakdown</CardTitle>
                <CardDescription>Performance across different skill areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Strong Areas */}
            {assessment.strong_areas.length > 0 && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Strength Areas
                  </CardTitle>
                  <CardDescription>Categories where you performed well</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {assessment.strong_areas.map(area => (
                      <Badge key={area} variant="default" className="bg-green-600">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weak Areas */}
            {assessment.weak_areas.length > 0 && (
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Areas to Improve
                  </CardTitle>
                  <CardDescription>Focus on these categories to boost your score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {assessment.weak_areas.map(area => (
                      <Badge key={area} variant="destructive">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Projection</CardTitle>
                <CardDescription>Based on your current performance trend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Current Score</p>
                    <p className="text-2xl font-bold text-primary">{assessment.score || 0}</p>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">7-Day Forecast</p>
                    <p className="text-2xl font-bold text-primary">{assessment.forecast_7day || assessment.score || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">+{(assessment.forecast_7day || assessment.score || 0) - (assessment.score || 0)}</p>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">14-Day Forecast</p>
                    <p className="text-2xl font-bold text-primary">{assessment.forecast_14day || assessment.score || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">+{(assessment.forecast_14day || assessment.score || 0) - (assessment.score || 0)}</p>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-2">How this is calculated:</p>
                  <p className="text-sm text-muted-foreground">
                    The forecast is based on your current improvement rate and performance consistency. If you maintain your learning pace, these are the scores you can expect to achieve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Test Number</p>
                    <p className="text-lg font-semibold">{assessment.test_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Test Date</p>
                    <p className="text-lg font-semibold">{new Date(assessment.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth vs Previous</p>
                    <div className="flex items-center gap-2">
                      {getGrowthIcon(assessment.growth_rate_vs_previous || 0)}
                      <p className="text-lg font-semibold">
                        {(assessment.growth_rate_vs_previous || 0) > 0 ? '+' : ''}{(assessment.growth_rate_vs_previous || 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-lg font-semibold">{Object.keys(assessment.skill_categories || {}).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/learning-path')}
            className="flex-1"
          >
            Start Learning Path
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="flex-1"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
