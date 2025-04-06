"use client"

import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur py-6 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CoinSense. All rights reserved.
            </p>
            <div className="flex items-center mt-1">
              <p className="text-sm text-muted-foreground">Made with</p>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 0.5,
                }}
                className="mx-1"
              >
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              </motion.div>
              <p className="text-sm text-muted-foreground">by CoinSense Team</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="text-sm text-muted-foreground hover:text-foreground">Feedback</button>
            <button className="text-sm text-muted-foreground hover:text-foreground">Contact Us</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

