import { useMemo } from "react"
import { ActivityItem } from "../types/stats"

export type Period = "today" | "week" | "month"

export function useFilteredActivity(activityData: ActivityItem[], period: Period) {
  return useMemo(() => {
    const now = new Date()
    let startDate: Date

    if (period === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    } else if (period === "week") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
    }

    return activityData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate
    })
  }, [activityData, period])
}
