import { api } from "./api"
import { ModeratorMeResponse } from "../../../types/apiTypes"

export const moderatorsApi = api.injectEndpoints({
  endpoints: builder => ({
    // Получить текущего модератора
    getCurrentModerator: builder.query<ModeratorMeResponse, void>({
      query: () => ({
        url: `/moderators/me`,
        method: "GET",
      }),
      providesTags: [{ type: "Moderator" }],
    }),
  }),
  overrideExisting: false,
})

export const { useGetCurrentModeratorQuery } = moderatorsApi
