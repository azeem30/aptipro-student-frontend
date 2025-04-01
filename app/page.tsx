"use client"

import Link from "next/link"
import { ArrowRight, Brain, CheckCircle, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AptiPro</h1>
        </div>
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Give MCQ-based tests to enhance your aptitude
            </h1>
            <p className="text-xl text-muted-foreground">
              AptiPro helps students improve their aptitude skills through interactive MCQ tests. Practice regularly,
              track your progress, and excel in your academic and professional journey.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold">Comprehensive Test Library</h3>
                  <p>Access a wide range of aptitude tests across various subjects and difficulty levels</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold">Detailed Performance Analytics</h3>
                  <p>Get insights into your strengths and areas for improvement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold">Department-Specific Content</h3>
                  <p>Tests tailored to your field of study for targeted practice</p>
                </div>
              </div>
            </div>
            <Link href="/signup">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-secondary blur-lg opacity-75"></div>
              <div className="relative bg-background rounded-lg p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">Sample Question</h3>
                      <p className="text-muted-foreground">Try solving this!</p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium mb-4">
                      If a train travels at a speed of 80 km/hr and crosses a platform in 45 seconds, what is the length
                      of the platform if the train is 250 meters long?
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <div className="h-5 w-5 rounded-full border border-input flex items-center justify-center">
                          <span className="text-xs">A</span>
                        </div>
                        <span>750 meters</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <div className="h-5 w-5 rounded-full border border-input flex items-center justify-center">
                          <span className="text-xs">B</span>
                        </div>
                        <span>850 meters</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <div className="h-5 w-5 rounded-full border border-input flex items-center justify-center">
                          <span className="text-xs">C</span>
                        </div>
                        <span>950 meters</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <div className="h-5 w-5 rounded-full border border-input flex items-center justify-center">
                          <span className="text-xs">D</span>
                        </div>
                        <span>1000 meters</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

