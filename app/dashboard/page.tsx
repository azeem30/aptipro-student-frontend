"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Award, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to AptiPro</h1>
            <p className="text-muted-foreground">Enhance your aptitude skills with our comprehensive test platform</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/tests">
                <Card className="h-full overflow-hidden border-primary/20 transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-8">
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      Give Tests
                    </CardTitle>
                    <CardDescription>Take aptitude tests to improve your skills</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p>
                        Access a variety of tests designed to challenge and enhance your aptitude skills. Tests are
                        available in different difficulty levels and subjects.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm">Tests available</span>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                          View Tests
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/results">
                <Card className="h-full overflow-hidden border-primary/20 transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-8">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Check Results
                    </CardTitle>
                    <CardDescription>View your performance and track progress</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p>
                        Review your test results, analyze your performance, and identify areas for improvement. Track
                        your progress over time with detailed analytics.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Results available</span>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                          View Results
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">Ready to test your skills?</h3>
                <p className="text-muted-foreground">Start with a test now to assess your current aptitude level</p>
              </div>
              <Button asChild>
                <Link href="/tests">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

