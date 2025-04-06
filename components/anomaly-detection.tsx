"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ChevronDown, ChevronUp, Info } from "lucide-react"
import { Chart, ChartBar, ChartContainer, ChartGrid, ChartTooltip, ChartXAxis, ChartYAxis } from "@/components/ui/chart"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

interface Anomaly {
  id: number | string
  category: string
  amount: number
  date: string | Date
  averageAmount: number
  percentageIncrease: number
  description: string
}

interface AnomalyDetectionProps {
  anomalies: Anomaly[]
}

export default function AnomalyDetection({ anomalies = [] }: AnomalyDetectionProps) {
  const [expandedAnomalies, setExpandedAnomalies] = useState<(number | string)[]>([])

  const toggleExpand = (id: number | string) => {
    if (expandedAnomalies.includes(id)) {
      setExpandedAnomalies(expandedAnomalies.filter((anomalyId) => anomalyId !== id))
    } else {
      setExpandedAnomalies([...expandedAnomalies, id])
    }
  }

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

  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No anomalies detected in your spending</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {anomalies.map((anomaly) => {
        // Format date
        const formattedDate =
          typeof anomaly.date === "string"
            ? new Date(anomaly.date).toLocaleDateString()
            : (anomaly.date as Date).toLocaleDateString()

        // Generate chart data for this anomaly
        const chartData = [
          { name: "Normal", normal: anomaly.averageAmount, anomaly: 0 },
          { name: "Anomaly", normal: 0, anomaly: anomaly.amount },
        ]

        return (
          <Card key={anomaly.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">{anomaly.category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(anomaly.amount)} on {formattedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                    {anomaly.percentageIncrease}% higher than usual
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => toggleExpand(anomaly.id)}>
                    {expandedAnomalies.includes(anomaly.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {expandedAnomalies.includes(anomaly.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-4">
                      <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm">{anomaly.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Average spending: {formatCurrency(anomaly.averageAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="h-[200px] mt-4">
                      <ChartContainer className="h-full w-full">
                        <Chart data={chartData} className="h-full w-full">
                          <ChartGrid strokeDasharray="3 3" />
                          <ChartXAxis dataKey="name" />
                          <ChartYAxis tickFormatter={(value) => formatCurrency(value).replace("₹", "")} />
                          <ChartTooltip content={<CustomTooltipContent />} />
                          <ChartBar
                            dataKey="normal"
                            fill="#4BC0C0"
                            name="Normal Spending"
                            animationDuration={1000}
                            animationEasing="ease-out"
                          />
                          <ChartBar
                            dataKey="anomaly"
                            fill="#FF6384"
                            name="Anomaly"
                            animationDuration={1000}
                            animationEasing="ease-out"
                          />
                        </Chart>
                      </ChartContainer>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

