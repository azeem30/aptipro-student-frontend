"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Award, Loader2 } from "lucide-react"

interface Result {
  id: number;
  name: string;
  marks: number;
  total_marks: number;
  difficulty: string;
  subject: string;
  student_email: string;
  teacher_email: string;
  data: Array<{
    id: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    selected_option: string;
    correct_option: string;
    subject: string;
    difficulty: string;
  }>;
  test_id: number;
}

export default function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError(null)

        const userDataString = localStorage.getItem("aptipro-user")
        if (!userDataString) {
          throw new Error("User data not found. Please login again.")
        }
        const user = JSON.parse(userDataString)
        if (!user?.email) {
          throw new Error("User email not found.")
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/results?email=${encodeURIComponent(user.email)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch results: ${response.status}`)
        }
        const data = await response.json()
        setResults(data.results || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch results")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const filteredResults = results.filter((result) => {
    return (
      result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${result.test_id}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Calculate percentage
  const calculatePercentage = (scored: number, total: number) => {
    return Math.round((scored / total) * 100)
  }

  // Get badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "hard":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20"
    }
  }

  // Get color based on score percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-yellow-500"
    if (percentage >= 40) return "text-orange-500"
    return "text-red-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Error loading results</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
      </div>
    )
  }

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Your Results</h1>
              <p className="text-muted-foreground">
                {results.length} test{results.length !== 1 ? 's' : ''} completed
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search results..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">
                {results.length === 0 ? 'No results available' : 'No matching results found'}
              </h3>
              <p className="text-muted-foreground mt-1">
                {results.length === 0
                  ? 'You haven\'t completed any tests yet.'
                  : 'Try adjusting your search to find what you\'re looking for.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{result.test_id}</Badge>
                            <Badge className={getDifficultyColor(result.difficulty)}>
                              {result.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{result.name}</CardTitle>
                          <CardDescription>{result.subject}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-2xl font-bold">
                            <span className={getScoreColor(calculatePercentage(result.marks, result.total_marks))}>
                              {result.marks}
                            </span>
                            <span className="text-muted-foreground">/{result.total_marks}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {calculatePercentage(result.marks, result.total_marks)}%
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 py-3">
                      <Link href={
                        {
                          pathname: `/results/${result.id}`,
                          query: { resultData: JSON.stringify(result) },
                        }
                      } className="w-full">
                        <Button variant="outline" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}