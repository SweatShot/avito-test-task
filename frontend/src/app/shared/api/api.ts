import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
// import { BASE_URL } from "../../../constants"

const baseQuery = fetchBaseQuery({
  baseUrl: `/api/v1`, // если с прокси то `${BASE_URL}/api/v1`
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 })

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  refetchOnMountOrArgChange: true,
  tagTypes: ["Ads", "Stats", "Moderator"],
  endpoints: () => ({}),
})
