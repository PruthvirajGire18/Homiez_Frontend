import { useQuery } from '@tanstack/react-query'
import api from '../api/api'

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me')

        // agar backend se user nahi aaya
        if (!res.data?.user) return null

        return res.data
      } catch (error) {
        // user logged out / token invalid
        return null
      }
    },
    retry: false,
  })

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.user || null,
  }
}

export default useAuthUser