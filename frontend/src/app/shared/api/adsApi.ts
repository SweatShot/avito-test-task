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
    // Получить список объявлений
    getAds: builder.query<GetAdsResponse, GetAdsQuery | void>({
      query: params => ({
        url: `/ads`,
        method: "GET",
        params: params ?? {},
      }),
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
      invalidatesTags: [{ type: "Ads" }],
    }),

    // Отклонить объявление
    rejectAd: builder.mutation<
      RejectAdResponse,
      { id: number } & RejectAdRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/ads/${id}/reject`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Ads" }],
    }),

    // Запросить изменения
    requestChanges: builder.mutation<
      RequestChangesResponse,
      { id: number } & RequestChangesRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/ads/${id}/request-changes`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Ads" }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAdsQuery,
  useGetAdByIdQuery,
  useApproveAdMutation,
  useRejectAdMutation,
  useRequestChangesMutation,
} = adsApi
