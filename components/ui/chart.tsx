import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export const ChartContainer = ResponsiveContainer
export const Chart = ComposedChart
export const ChartLine = Line
export const ChartArea = Area
export const ChartBar = Bar
export const ChartXAxis = XAxis
export const ChartYAxis = YAxis
export const ChartGrid = CartesianGrid
export const ChartTooltip = Tooltip
export const ChartLegend = Legend
export const ChartPie = Pie
export const ChartPieChart = PieChart
export const ChartTooltipContent = () => {
  return (
    <div className="rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
      <p className="text-sm font-semibold">Tooltip Content</p>
      <p className="text-xs text-muted-foreground">Add your custom content here</p>
    </div>
  )
}

// Add the missing ChartLegendContent component
export const ChartLegendContent = () => {
  return (
    <div className="flex flex-col gap-2 text-xs">{/* This is a placeholder that will be populated by Recharts */}</div>
  )
}

export {
  ResponsiveContainer as default,
  ComposedChart as ChartBase,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
}

