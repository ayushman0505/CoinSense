"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, X, Send, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface FinancialData {
  totalIncome: number
  totalExpenses: number
  balance: number
  topExpenseCategory?: string
  taxAmount?: number
  savingsRate?: number
}

export function MoneyBuddy() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm FinBEE, your personal financial assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [showFinancialSummary, setShowFinancialSummary] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchFinancialData()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchFinancialData = async () => {
    try {
      const response = await fetch("/api/chatbot/financial-data")
      if (!response.ok) throw new Error("Failed to fetch financial data")
      const data = await response.json()
      setFinancialData(data)
    } catch (error) {
      console.error("Error fetching financial data:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsLoading(false)
      }, 500) // Slight delay for natural feel
    } catch (error) {
      console.error("Error sending message:", error)

      // Fallback responses if API fails
      const fallbackResponses = [
        "Based on your spending patterns, I recommend setting aside 20% of your income for savings.",
        "You might want to consider reducing expenses in your top spending category to improve your financial health.",
        "Have you considered investing in mutual funds? They can be a good way to grow your money over time.",
        "Setting up an emergency fund covering 3-6 months of expenses is a good financial practice.",
        "Tax-saving investments like PPF or ELSS can help reduce your tax liability.",
        "Consider using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
        "Tracking your expenses regularly can help identify areas where you can cut back.",
        "Automating your savings by setting up automatic transfers on payday can help you save consistently.",
        "Paying yourself first is a good financial habit - set aside savings before spending on discretionary items.",
        "Diversifying your investments across different asset classes can help reduce risk.",
      ]

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleFinancialSummary = () => {
    setShowFinancialSummary(!showFinancialSummary)
  }

  const suggestedQuestions = [
    "How can I save more money?",
    "What are tax-saving investments?",
    "How to create a budget?",
    "Tips for reducing expenses",
    "How to invest in mutual funds?",
    "What is an emergency fund?",
    "How to pay off debt faster?",
    "Best investment options in India?",
  ]

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? <X className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-80 md:w-96"
          >
            <Card className="border-2 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-white text-amber-600">FB</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">FinBEE</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    AI Assistant
                  </Badge>
                </div>
              </CardHeader>

              {financialData && (
                <div className="px-4 py-2 bg-muted/30 border-b">
                  <button
                    onClick={toggleFinancialSummary}
                    className="w-full flex items-center justify-between text-sm font-medium"
                  >
                    Financial Summary
                    {showFinancialSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {showFinancialSummary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 space-y-2 text-xs"
                    >
                      <div className="flex justify-between">
                        <span>Total Income:</span>
                        <span className="font-medium">{formatCurrency(financialData.totalIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Expenses:</span>
                        <span className="font-medium">{formatCurrency(financialData.totalExpenses)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="font-medium">{formatCurrency(financialData.balance)}</span>
                      </div>
                      {financialData.topExpenseCategory && (
                        <div className="flex justify-between">
                          <span>Top Expense:</span>
                          <span className="font-medium">{financialData.topExpenseCategory}</span>
                        </div>
                      )}
                      {financialData.taxAmount !== undefined && (
                        <div className="flex justify-between">
                          <span>Estimated Tax:</span>
                          <span className="font-medium">{formatCurrency(financialData.taxAmount)}</span>
                        </div>
                      )}
                      {financialData.savingsRate !== undefined && (
                        <div className="flex justify-between">
                          <span>Savings Rate:</span>
                          <span className="font-medium">{financialData.savingsRate.toFixed(1)}%</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user" ? "bg-amber-500 text-white" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div
                          className="h-2 w-2 rounded-full bg-amber-500 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-amber-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-amber-500 animate-bounce"
                          style={{ animationDelay: "600ms" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-2 bg-muted/30">
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs py-1 h-auto"
                      onClick={() => {
                        setInput(question)
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              <CardFooter className="p-3 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Ask me anything about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="shrink-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Also add a default export for backward compatibility
export default function FinBEE() {
  return <MoneyBuddy />
}

