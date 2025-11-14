import { useMemo } from "react"
import {
  useGetSummaryStatsQuery,
  useGetActivityChartQuery,
  useGetDecisionsChartQuery,
  useGetCategoriesChartQuery,
} from "../app/shared/api/statsApi"

export function useStats() {
  const periods = ["today", "week", "month"] as const

  // Запросы по периодам
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
  const { data: activity, isLoading: loadingActivity } =
    useGetActivityChartQuery({ period: "week" })
  const { data: decisions, isLoading: loadingDecisions } =
    useGetDecisionsChartQuery({ period: "week" })
  const { data: categories, isLoading: loadingCategories } =
    useGetCategoriesChartQuery({ period: "week" })

  const loading = loadingSummary || loadingActivity || loadingDecisions || loadingCategories

  // Подготовка данных графиков с useMemo
  const activityData = useMemo(() => {
    if (!activity) return []
    return activity.flatMap(day => [
      { date: day.date, type: "Одобрено", value: day.approved },
      { date: day.date, type: "Отклонено", value: day.rejected },
      { date: day.date, type: "На доработку", value: day.requestChanges },
    ])
  }, [activity])

  const decisionsData = useMemo(() => {
    if (!decisions) return []
    return [
      { type: "Одобрено", value: decisions.approved },
      { type: "Отклонено", value: decisions.rejected },
      { type: "На доработку", value: decisions.requestChanges },
    ]
  }, [decisions])

  const categoriesData = useMemo(() => {
    if (!categories) return []
    return Object.entries(categories).map(([name, value]) => ({
      type: name || "Без категории",
      value,
    }))
  }, [categories])

  // Среднее время проверки сегодня
  const formattedAverageTime = useMemo(() => {
    const avg = summary.today?.averageReviewTime
    if (!avg) return "–"
    const totalMinutes = Math.floor(avg / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`
  }, [summary.today])

  return {
    summary,
    activityData,
    decisionsData,
    categoriesData,
    formattedAverageTime,
    loading,
  }
}
