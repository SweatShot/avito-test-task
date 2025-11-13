import { api } from "./api"
import {
  StatsSummaryResponse,
  ActivityChartResponse,
  DecisionsChartResponse,
  CategoriesChartResponse,
  StatsQuery,
} from "../../../types/apiTypes"

export const statsApi = api.injectEndpoints({
  endpoints: builder => ({
    // Общая статистика
    getSummaryStats: builder.query<StatsSummaryResponse, StatsQuery | void>({
      query: params => ({
        url: `/stats/summary`,
        method: "GET",
        params: params ?? {},
      }),
      providesTags: [{ type: "Stats" }],
    }),

    // График активности
    getActivityChart: builder.query<ActivityChartResponse, StatsQuery | void>({
      query: params => ({
        url: `/stats/chart/activity`,
        method: "GET",
        params: params ?? {},
      }),
      providesTags: [{ type: "Stats" }],
    }),

    // График решений
    getDecisionsChart: builder.query<DecisionsChartResponse, StatsQuery | void>(
      {
        query: params => ({
          url: `/stats/chart/decisions`,
          method: "GET",
          params: params ?? {},
        }),
        providesTags: [{ type: "Stats" }],
      },
    ),

    // График категорий
    getCategoriesChart: builder.query<
      CategoriesChartResponse,
      StatsQuery | void
    >({
      query: params => ({
        url: `/stats/chart/categories`,
        method: "GET",
        params: params ?? {},
      }),
      providesTags: [{ type: "Stats" }],
    }),
  }),
})

export const {
  useGetSummaryStatsQuery,
  useGetActivityChartQuery,
  useGetDecisionsChartQuery,
  useGetCategoriesChartQuery,
} = statsApi
