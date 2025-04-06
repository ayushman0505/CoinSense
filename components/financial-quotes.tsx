"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const FINANCIAL_QUOTES = [
  {
    quote: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher",
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    quote: "The individual investor should act consistently as an investor and not as a speculator.",
    author: "Ben Graham",
  },
  {
    quote: "The four most dangerous words in investing are: 'this time it's different.'",
    author: "Sir John Templeton",
  },
  {
    quote: "The best investment you can make is in yourself.",
    author: "Warren Buffett",
  },
  {
    quote: "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
    author: "Ayn Rand",
  },
  {
    quote: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
    author: "Dave Ramsey",
  },
  {
    quote: "A budget is telling your money where to go instead of wondering where it went.",
    author: "John C. Maxwell",
  },
  {
    quote:
      "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
    author: "Robert Kiyosaki",
  },
  {
    quote:
      "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought.",
    author: "T.T. Munger",
  },
  {
    quote: "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett",
  },
  {
    quote: "Wealth is not about having a lot of money; it's about having a lot of options.",
    author: "Chris Rock",
  },
]

export default function FinancialQuotes() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % FINANCIAL_QUOTES.length)
        setIsChanging(false)
      }, 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const currentQuote = FINANCIAL_QUOTES[currentQuoteIndex]

  return (
    <div className="h-20 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!isChanging && (
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-lg text-muted-foreground italic">"{currentQuote.quote}"</p>
            <p className="text-sm text-muted-foreground mt-1">— {currentQuote.author}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

