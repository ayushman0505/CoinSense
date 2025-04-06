import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

// Database helper functions
export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("expense_tracker")
  return { client, db }
}

// User functions
export async function findUserByEmail(email: string) {
  const { db } = await connectToDatabase()
  return db.collection("users").findOne({ email })
}

export async function createUser(userData: any) {
  const { db } = await connectToDatabase()
  return db.collection("users").insertOne(userData)
}

export async function updateUser(userId: string, updateData: any) {
  const { db } = await connectToDatabase()
  return db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updateData })
}

export async function getUserById(userId: string) {
  const { db } = await connectToDatabase()
  return db.collection("users").findOne({ _id: new ObjectId(userId) })
}

// Expense functions
export async function getExpenses(userId: string) {
  const { db } = await connectToDatabase()
  return db.collection("expenses").find({ userId }).sort({ date: -1 }).toArray()
}

export async function addExpense(expenseData: any) {
  const { db } = await connectToDatabase()
  return db.collection("expenses").insertOne(expenseData)
}

export async function updateExpense(expenseId: string, updateData: any) {
  const { db } = await connectToDatabase()
  return db.collection("expenses").updateOne({ _id: new ObjectId(expenseId) }, { $set: updateData })
}

export async function deleteExpense(expenseId: string) {
  const { db } = await connectToDatabase()
  return db.collection("expenses").deleteOne({ _id: new ObjectId(expenseId) })
}

// Income functions
export async function getIncomes(userId: string) {
  const { db } = await connectToDatabase()
  return db.collection("incomes").find({ userId }).sort({ date: -1 }).toArray()
}

export async function addIncome(incomeData: any) {
  const { db } = await connectToDatabase()
  return db.collection("incomes").insertOne(incomeData)
}

export async function updateIncome(incomeId: string, updateData: any) {
  const { db } = await connectToDatabase()
  return db.collection("incomes").updateOne({ _id: new ObjectId(incomeId) }, { $set: updateData })
}

export async function deleteIncome(incomeId: string) {
  const { db } = await connectToDatabase()
  return db.collection("incomes").deleteOne({ _id: new ObjectId(incomeId) })
}

// Analytics functions
export async function getMonthlyExpenses(userId: string) {
  const { db } = await connectToDatabase()
  const currentYear = new Date().getFullYear()

  const startDate = new Date(currentYear, 0, 1) // Jan 1 of current year
  const endDate = new Date(currentYear, 11, 31) // Dec 31 of current year

  const expenses = await db
    .collection("expenses")
    .find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    })
    .toArray()

  // Group by month
  const monthlyData = Array(12).fill(0)

  expenses.forEach((expense) => {
    const date = new Date(expense.date)
    const month = date.getMonth()
    monthlyData[month] += expense.amount
  })

  return monthlyData
}

export async function getMonthlyIncomes(userId: string) {
  const { db } = await connectToDatabase()
  const currentYear = new Date().getFullYear()

  const startDate = new Date(currentYear, 0, 1)
  const endDate = new Date(currentYear, 11, 31)

  const incomes = await db
    .collection("incomes")
    .find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    })
    .toArray()

  // Group by month
  const monthlyData = Array(12).fill(0)

  incomes.forEach((income) => {
    const date = new Date(income.date)
    const month = date.getMonth()
    monthlyData[month] += income.amount
  })

  return monthlyData
}

export async function getExpensesByCategory(userId: string) {
  const { db } = await connectToDatabase()

  // Get current month expenses
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const expenses = await db
    .collection("expenses")
    .find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    })
    .toArray()

  // Group by category
  const categories: Record<string, number> = {}

  expenses.forEach((expense) => {
    const category = expense.category
    if (!categories[category]) {
      categories[category] = 0
    }
    categories[category] += expense.amount
  })

  return Object.entries(categories).map(([name, value]) => ({ name, value }))
}

export async function detectAnomalies(userId: string) {
  const { db } = await connectToDatabase()

  // Get all expenses
  const expenses = await db.collection("expenses").find({ userId }).toArray()

  // Group by category
  const categorySums: Record<string, number[]> = {}
  const categoryDates: Record<string, Date[]> = {}

  expenses.forEach((expense) => {
    const category = expense.category
    if (!categorySums[category]) {
      categorySums[category] = []
      categoryDates[category] = []
    }
    categorySums[category].push(expense.amount)
    categoryDates[category].push(new Date(expense.date))
  })

  // Detect anomalies (expenses that are 50% higher than the average for that category)
  const anomalies = []

  for (const category in categorySums) {
    const amounts = categorySums[category]
    const dates = categoryDates[category]

    if (amounts.length < 3) continue // Need at least 3 data points

    const average = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const threshold = average * 1.5

    for (let i = 0; i < amounts.length; i++) {
      if (amounts[i] > threshold) {
        anomalies.push({
          id: i,
          category,
          amount: amounts[i],
          date: dates[i],
          averageAmount: Math.round(average),
          percentageIncrease: Math.round((amounts[i] / average - 1) * 100),
          description: `Unusual spending in ${category} category`,
        })
      }
    }
  }

  return anomalies.slice(0, 5) // Return top 5 anomalies
}

export async function getTotalBalance(userId: string) {
  const { db } = await connectToDatabase()

  const incomes = await db.collection("incomes").find({ userId }).toArray()
  const expenses = await db.collection("expenses").find({ userId }).toArray()

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return totalIncome - totalExpense
}

export async function getCurrentMonthStats(userId: string) {
  const { db } = await connectToDatabase()

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
  const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)
  const startOfPreviousMonth = new Date(previousMonthYear, previousMonth, 1)
  const endOfPreviousMonth = new Date(previousMonthYear, previousMonth + 1, 0)

  // Current month data
  const currentMonthIncomes = await db
    .collection("incomes")
    .find({
      userId,
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    })
    .toArray()

  const currentMonthExpenses = await db
    .collection("expenses")
    .find({
      userId,
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    })
    .toArray()

  // Previous month data
  const previousMonthIncomes = await db
    .collection("incomes")
    .find({
      userId,
      date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    })
    .toArray()

  const previousMonthExpenses = await db
    .collection("expenses")
    .find({
      userId,
      date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    })
    .toArray()

  // Calculate totals
  const currentIncome = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0)
  const currentExpense = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const previousIncome = previousMonthIncomes.reduce((sum, income) => sum + income.amount, 0)
  const previousExpense = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate percentage changes
  const incomeChange = previousIncome === 0 ? 100 : ((currentIncome - previousIncome) / previousIncome) * 100
  const expenseChange = previousExpense === 0 ? -100 : ((currentExpense - previousExpense) / previousExpense) * 100

  return {
    currentIncome,
    currentExpense,
    incomeChange: Math.round(incomeChange * 10) / 10, // Round to 1 decimal place
    expenseChange: Math.round(expenseChange * 10) / 10,
  }
}

