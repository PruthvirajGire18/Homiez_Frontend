import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await api.post('/auth/logout') // optional
    } catch (error) {}

    // 🔥 MAGIC LINE — refresh ki zarurat khatam
    queryClient.setQueryData(['authUser'], null)

    localStorage.removeItem('token')

    navigate('/login', { replace: true })
  }

  return logout
}

export default useLogout