"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function AnimatedThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark")
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }, 150)
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative h-10 w-16 rounded-full bg-gray-200 p-1 transition-colors duration-300 dark:bg-gray-700 ${
        isAnimating ? "animate-pulse" : ""
      }`}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 dark:bg-amber-400 ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="h-8 w-8 p-1.5 text-gray-800" />
        ) : (
          <Sun className="h-8 w-8 p-1.5 text-amber-500" />
        )}
      </div>
    </button>
  )
}

