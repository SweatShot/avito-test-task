import { useMemo } from "react"
import {
  useGetSummaryStatsQuery,
  useGetActivityChartQuery,
  useGetDecisionsChartQuery,
  useGetCategoriesChartQuery,
} from "../app/shared/api/statsApi"

export function useStats() {
  const periods = ["today", "week", "month"] as const

  const summaryQueries = periods.map(period =>
    useGetSummaryStatsQuery({ period })
  )

  const summary = useMemo(() => {
    return periods.reduce((acc, period, idx) => {
      acc[period] = summaryQueries[idx].data
      return acc
    }, {} as Record<typeof periods[number], typeof summaryQueries[number]["data"]>)
  }, [summaryQueries])

  const loadingSummary = summaryQueries.some(q => q.isLoading)

  // Графики
  const { data: activity } = useGetActivityChartQuery({ period: "week" })
  const { data: decisions } = useGetDecisionsChartQuery({ period: "week" })
  const { data: categories } = useGetCategoriesChartQuery({ period: "week" })

  const loading = loadingSummary || !activity || !decisions || !categories

  // Типы графиков
  type ActivityItem = { date: string; type: string; value: number }
  type PieItem = { type: string; value: number }

  // Данные для BarChart
  const activityData: ActivityItem[] = useMemo(() => {
    if (!activity) return []
    return activity.flatMap(day => [
      { date: day.date, type: "Одобрено", value: day.approved },
      { date: day.date, type: "Отклонено", value: day.rejected },
      { date: day.date, type: "На доработку", value: day.requestChanges },
    ])
  }, [activity])

  // Проценты для карточек и PieChart
  const decisionsPercentages: PieItem[] = useMemo(() => {
    if (!decisions) return []

    const total =
      (decisions.approved ?? 0) +
      (decisions.rejected ?? 0) +
      (decisions.requestChanges ?? 0)
    if (total === 0) return []

    const approved = ((decisions.approved / total) * 100)
    const rejected = ((decisions.rejected / total) * 100)
    const requestChanges = ((decisions.requestChanges / total) * 100)

    return [
      { type: "Одобрено", value: approved },
      { type: "Отклонено", value: rejected },
      { type: "На доработку", value: requestChanges },
    ]
  }, [decisions])

  // Среднее время проверки (секунды или минуты)
  const formattedAverageTime = useMemo(() => {
    const avg = summary.today?.averageReviewTime
    if (!avg) return "–"

    if (avg < 60) {
      return `${avg} сек`
    } else {
      const minutes = Math.floor(avg / 360000)
      return `${minutes} мин`
    }
  }, [summary.today])

  return {
    summary,
    activityData,
    decisionsData: decisionsPercentages,
    categoriesData: useMemo(() => {
      if (!categories) return []
      return Object.entries(categories).map(([name, value]) => ({
        type: name || "Без категории",
        value,
      }))
    }, [categories]),
    formattedAverageTime,
    loading,
  }
}
