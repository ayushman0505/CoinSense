"use client"

import {
  Chart,
  ChartArea,
  ChartContainer,
  ChartGrid,
  ChartLine,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Vibrant colors
const INCOME_COLOR = "#4BC0C0"
const EXPENSE_COLOR = "#FF6384"

interface MonthlyExpenseChartProps {
  expenseData: number[]
  incomeData: number[]
}

export default function MonthlyExpenseChart({ expenseData = [], incomeData = [] }: MonthlyExpenseChartProps) {
  // If no data, show a message
  if ((!expenseData || expenseData.length === 0) && (!incomeData || incomeData.length === 0)) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No monthly data available</p>
      </div>
    )
  }

  // Format data for the chart
  const data = MONTHS.map((month, index) => ({
    month,
    expenses: expenseData[index] || 0,
    income: incomeData[index] || 0,
  }))

  // Custom tooltip content
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="h-full">
      <ChartContainer className="h-full w-full">
        <Chart data={data} className="h-full w-full">
          <ChartGrid strokeDasharray="3 3" />
          <ChartXAxis dataKey="month" tick={{ fill: "#888888" }} tickLine={{ stroke: "#888888" }} />
          <ChartYAxis
            tick={{ fill: "#888888" }}
            tickLine={{ stroke: "#888888" }}
            tickFormatter={(value) => formatCurrency(value).replace("₹", "")}
          />
          <ChartTooltip content={<CustomTooltipContent />} />
          <ChartArea
            type="monotone"
            dataKey="income"
            stroke={INCOME_COLOR}
            fill={INCOME_COLOR}
            fillOpacity={0.2}
            activeDot={{ r: 8, strokeWidth: 0, fill: INCOME_COLOR }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <ChartLine
            type="monotone"
            dataKey="expenses"
            stroke={EXPENSE_COLOR}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 0, fill: EXPENSE_COLOR }}
            activeDot={{ r: 8, strokeWidth: 0, fill: EXPENSE_COLOR }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </Chart>
      </ChartContainer>
    </motion.div>
  )
}

