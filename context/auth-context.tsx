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
  authError: string | null
  clearAuthError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const clearAuthError = () => {
    setAuthError(null)
  }

  const login = async (email: string, password: string, role: UserRole = "citizen") => {
    // Mock login - in a real app, this would call an API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password) {
          // Check if credentials match any stored user
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const userExists = users.find((u: any) => u.email === email)

          if (userExists) {
            // In a real app, you would verify password hash
            // For mock purposes, we'll just check if a user with this email exists
            const mockUser = {
              id: userExists.id,
              name: userExists.name,
              email,
              role,
            }
            setUser(mockUser)
            localStorage.setItem("user", JSON.stringify(mockUser))
            setAuthError(null)
            resolve()
          } else {
            setAuthError("Invalid email or password")
            reject(new Error("Invalid email or password"))
          }
        } else {
          setAuthError("Invalid credentials")
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
          // Check if user already exists
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const emailExists = users.some((user: any) => user.email === email)

          if (emailExists) {
            setAuthError("An account with this email already exists")
            reject(new Error("An account with this email already exists"))
            return
          }

          const mockUser = {
            id: "user_" + Math.random().toString(36).substr(2, 9),
            name,
            email,
            role: "citizen" as UserRole,
            password, // In a real app, this would be hashed
          }

          // Save user to "database"
          users.push(mockUser)
          localStorage.setItem("users", JSON.stringify(users))

          // Log user in automatically
          setUser({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
          })
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: mockUser.id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
            }),
          )
          setAuthError(null)
          resolve()
        } else {
          setAuthError("Invalid registration details")
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
        authError,
        clearAuthError,
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
