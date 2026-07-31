'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Add 'system' to the Theme type
type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('afilas-theme') as Theme | null
    // Check if saved theme is valid, otherwise use 'system'
    const initialTheme = savedTheme && ['light', 'dark', 'system'].includes(savedTheme) 
      ? savedTheme 
      : 'system'
    setTheme(initialTheme)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    // Determine actual theme to apply
    let appliedTheme: 'light' | 'dark' = 'light'
    if (theme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      appliedTheme = theme
    }
    
    // Apply theme
    if (appliedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('afilas-theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
    })
  }

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement
        if (mediaQuery.matches) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    // Return default values if context is not available
    return {
      theme: 'system' as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }
  
  return context
}