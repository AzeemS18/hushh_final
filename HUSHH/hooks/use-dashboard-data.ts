'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Assessment } from '@/lib/db/types'

interface DashboardData {
  latestAssessment: Assessment | null
  allAssessments: Assessment[]
  readinessScore: number
  growthRate: number
  weeklyStreak: number
  department: string | null
  proficiencyLevel: number // 33 for Beginner, 66 for Intermediate, 100 for Advanced
  level: number
  chartData: { date: string, score: number }[]
}

export function useDashboardData(userId: string | undefined) {
  const supabase = createClient()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true)

        if (userId?.startsWith('mock-')) {
          const mockAssessment: Assessment = {
            id: 'mock-assessment-1',
            student_id: 'mock-123',
            test_number: 1,
            score: 75,
            skill_categories: {
              'Mathematics': 80,
              'Problem Solving': 70,
              'Communication': 85,
            },
            difficulty_progression: ['Medium', 'Hard'],
            duration_seconds: 600,
            weak_areas: ['Problem Solving'],
            strong_areas: ['Communication', 'Mathematics'],
            growth_rate_vs_previous: 5,
            forecast_7day: 80,
            forecast_14day: 85,
            created_at: new Date().toISOString()
          }
          setData({
            latestAssessment: mockAssessment,
            allAssessments: [mockAssessment],
            readinessScore: 78,
            growthRate: 5,
            weeklyStreak: 3,
            department: 'Computer Science',
            proficiencyLevel: 66,
            level: 5,
            chartData: [
              { date: 'Mon', score: 65 },
              { date: 'Tue', score: 70 },
              { date: 'Wed', score: 78 }
            ]
          })
          setLoading(false)
          return
        }

        const { data: assessments, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('student_id', userId)
          .order('created_at', { ascending: false })

        if (assessmentError) throw assessmentError

        const typedAssessments = assessments as Assessment[]
        const latest = typedAssessments[0] || null

        let readinessScore = 0
        if (latest && latest.skill_categories) {
          const categoryScores = Object.values(latest.skill_categories as Record<string, number>)
          if (categoryScores.length > 0) {
            readinessScore = Math.round(categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length)
          }
        }

        let growthRate = 0
        if (typedAssessments.length >= 2) {
          const latestScore = latest?.score || 0
          const previousScore = typedAssessments[1]?.score || 0
          growthRate = latestScore - previousScore
        }

        const weeklyStreak = Math.max(1, Math.ceil(typedAssessments.length / 2))

        let department = null
        let classification = 'Beginner'
        if (userId.startsWith('mock-')) {
          department = localStorage.getItem('user_department') || 'Computer Science'
          classification = localStorage.getItem('user_level') || 'Intermediate'
        } else {
          const { data: studentData } = await supabase
            .from('students')
            .select('department, classification_level')
            .eq('user_id', userId)
            .single()
          department = studentData?.department || null
          classification = studentData?.classification_level || 'Beginner'
        }

        const levelMap: Record<string, number> = { 'Beginner': 33, 'Intermediate': 66, 'Advanced': 100 }
        const proficiencyLevel = levelMap[classification] || 33

        const chartData = typedAssessments.slice(0, 7).reverse().map(a => ({
          date: new Date(a.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
          score: a.score
        }))

        if (chartData.length === 0) {
          chartData.push({ date: 'Today', score: readinessScore })
        }

        setData({
          latestAssessment: latest,
          allAssessments: typedAssessments,
          readinessScore,
          growthRate,
          weeklyStreak,
          department,
          proficiencyLevel,
          level: Math.max(1, typedAssessments.length),
          chartData
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load dashboard data'))
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [userId, supabase])

  return { data, loading, error }
}
