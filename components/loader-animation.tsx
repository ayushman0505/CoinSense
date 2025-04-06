"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, DollarSign, Smartphone } from "lucide-react"

export default function LoaderAnimation() {
  const [currentIcon, setCurrentIcon] = useState(0)
  const icons = [
    { component: DollarSign, color: "text-emerald-400" },
    { component: CreditCard, color: "text-violet-400" },
    { component: Smartphone, color: "text-amber-400" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative h-32 w-32">
        <motion.div
          animate={{
            rotate: 360,
            borderRadius: ["25%", "50%", "25%"],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0 border-t-2 border-r-2 border-primary/50 rounded-full"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIcon}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {(() => {
              const Icon = icons[currentIcon].component
              return (
                <Icon
                  className={`h-20 w-20 ${icons[currentIcon].color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                />
              )
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="h-1 bg-primary/70 rounded-full mt-8 max-w-[200px]"
      />
    </div>
  )
}

