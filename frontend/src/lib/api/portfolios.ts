import api from '@/lib/axios'
import { FeedType, FieldType, FeedResponse } from '@/types'

export const portfolioApi = {

  getFeed: async (
    feed:    FeedType,
    field:   FieldType,
    cursor?: string
  ): Promise<FeedResponse> => {
    const params = new URLSearchParams({
      feed,
      field,
      limit: '12',
      ...(cursor ? { cursor } : {})
    })

    const { data } = await api.get(`/portfolios?${params}`)
    return data.data
  }
}