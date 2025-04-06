"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginAnimation() {
  const { data: session } = useSession()
  const router = useRouter()
  const [quotes, setQuotes] = useState([
    "Analyzing your financial data...",
    "Calculating your spending patterns...",
    "Preparing your dashboard...",
    "Almost there...",
  ])
  const [currentQuote, setCurrentQuote] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!session) return

    // Update progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    // Change quotes
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 1500)

    // Redirect after animation completes
    const redirectTimeout = setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(quoteInterval)
      clearTimeout(redirectTimeout)
    }
  }, [session, router, quotes])

  if (!session) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-2">Hello, {session.user?.name || "there"}!</h2>
          <p className="text-muted-foreground mb-8">Wait while I load your transactions...</p>

          <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-purple-600 rounded-full"
            />
          </div>

          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-muted-foreground">{quotes[currentQuote]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

