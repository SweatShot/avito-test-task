import { useMemo } from "react"

export type ActivityItem = {
  date: string
  type: string 
  value: number
}

export type ActivityChartData = {
  date: string
  Одобрено: number
  Отклонено: number
  "На доработку": number
}

export function useActivityChartData(activityData: ActivityItem[]): ActivityChartData[] {
  return useMemo(() => {
    const map: Record<string, ActivityChartData> = {}

    activityData.forEach(item => {
      if (!map[item.date]) map[item.date] = { date: item.date, Одобрено: 0, Отклонено: 0, "На доработку": 0 }

      if (item.type === "Одобрено" || item.type === "Отклонено" || item.type === "На доработку") {
        map[item.date][item.type] = item.value
      }
    })

    return Object.values(map)
  }, [activityData])
}
