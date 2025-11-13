import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../../../constants"

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1`,
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 })

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  refetchOnMountOrArgChange: true,
  // 👇 вот это ключевая строка
  tagTypes: ["Ads", "Stats", "Moderator"],
  endpoints: () => ({}),
})
