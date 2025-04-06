import { compare, hash } from "bcryptjs"
import { findUserByEmail, createUser } from "./db"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export async function hashPassword(password: string) {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email)

  if (!user) {
    throw new Error("No user found with this email")
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    throw new Error("Invalid password")
  }

  return { id: user._id.toString(), email: user.email, name: user.name }
}

export async function registerUser(name: string, email: string, password: string) {
  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  const hashedPassword = await hashPassword(password)

  const result = await createUser({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  })

  return { id: result.insertedId.toString(), email, name }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await authenticateUser(credentials.email, credentials.password)
          return user
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

