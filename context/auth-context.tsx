"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "citizen" | "admin"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole = "citizen") => {
    // Mock login - in a real app, this would call an API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password) {
          const mockUser = {
            id: "user_" + Math.random().toString(36).substr(2, 9),
            name: email.split("@")[0],
            email,
            role,
          }
          setUser(mockUser)
          localStorage.setItem("user", JSON.stringify(mockUser))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 500)
    })
  }

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - in a real app, this would call an API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (name && email && password) {
          const mockUser = {
            id: "user_" + Math.random().toString(36).substr(2, 9),
            name,
            email,
            role: "citizen" as UserRole,
          }
          setUser(mockUser)
          localStorage.setItem("user", JSON.stringify(mockUser))
          resolve()
        } else {
          reject(new Error("Invalid registration details"))
        }
      }, 500)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
