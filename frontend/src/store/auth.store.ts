import { create } from "zustand"

interface User {
    id: string
    email: string
    name?: string | null
    username?: string | null
   avatarUrl?: string | null
   bio?: string | null
   field?: string | null
   isOnboarded: boolean
}

interface AuthState {
    user: User | null
    token: string | null
    isLoggedIn: boolean
    setAuth: (user: User, token: string) => void
    logout: () => void
    setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoggedIn: false,

   setAuth: (user: User, token: string) => {
    localStorage.setItem('token', token)
    set({ user, token, isLoggedIn: true})
   },

   logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isLoggedIn: false})
   },

   setUser: (user: User) => set({ user })

}))