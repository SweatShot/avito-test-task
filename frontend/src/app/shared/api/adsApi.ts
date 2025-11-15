import { api } from "./api"
import {
  GetAdsResponse,
  GetAdByIdResponse,
  ApproveAdResponse,
  RejectAdResponse,
  RequestChangesResponse,
  GetAdsQuery,
  RejectAdRequest,
  RequestChangesRequest,
} from "../../../types/apiTypes"

export const adsApi = api.injectEndpoints({
  endpoints: builder => ({
    // Получить список объявлений с пагинацией/фильтрами
    getAds: builder.query<GetAdsResponse, GetAdsQuery | void>({
      query: params => ({
        url: `/ads`,
        method: "GET",
        params: params ?? {},
      }),
      providesTags: [{ type: "Ads" }],
    }),

    // Получить все ID объявлений для навигации
    getAllIds: builder.query<number[], void>({
      query: () => ({
        url: "/ads",
        params: { limit: 10000, fields: "id" },
      }),
      transformResponse: (response: any) => response.ads.map((ad: any) => ad.id),
      providesTags: [{ type: "Ads" }],
    }),

    // Получить объявление по ID
    getAdById: builder.query<GetAdByIdResponse, number>({
      query: id => ({
        url: `/ads/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Ads", id }],
    }),

    // Одобрить объявление
    approveAd: builder.mutation<ApproveAdResponse, number>({
      query: id => ({
        url: `/ads/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Ads", id }],
    }),

    // Отклонить объявление
    rejectAd: builder.mutation<RejectAdResponse, { id: number } & RejectAdRequest>({
      query: ({ id, ...body }) => ({
        url: `/ads/${id}/reject`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Ads", id }],
    }),

    // Запросить доработки
    requestChanges: builder.mutation<RequestChangesResponse, { id: number } & RequestChangesRequest>({
      query: ({ id, ...body }) => ({
        url: `/ads/${id}/request-changes`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Ads", id }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAdsQuery,
  useGetAdByIdQuery,
  useGetAllIdsQuery,
  useApproveAdMutation,
  useRejectAdMutation,
  useRequestChangesMutation,
} = adsApi
