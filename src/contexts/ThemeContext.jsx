import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light'
    setTheme(storedTheme)
    setIsDarkMode(storedTheme === 'dark')
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme, isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev
      setTheme(newMode ? 'dark' : 'light')
      return newMode
    })
  }

  return (
    <ThemeContext.Provider
      value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
