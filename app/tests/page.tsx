"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock, BookOpen, User, ArrowRight, Award, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface Test {
  id: number;
  name: string;
  marks: number;
  questions_count: number;
  duration: number;
  difficulty: string;
  subject: string;
  scheduled_at: string;
  teacher: string;
  dept_name: string;
}

export default function TestsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const userData = localStorage.getItem("aptipro-user")
        if (!userData) {
          router.push("/login")
          return
        }

        const user = JSON.parse(userData)
        if (!user?.department) {
          throw new Error("Department information missing")
        }

        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tests`)
        url.searchParams.append("department", user.department)

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch tests: ${response.status}`)
        }

        const data = await response.json()
        if (!Array.isArray(data.tests)) {
          throw new Error("Invalid data format received")
        }

        setTests(data.tests)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [router])

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toString().includes(searchQuery)
  
    const matchesDifficulty = 
      difficultyFilter === "all" || 
      difficultyFilter === "" || 
      test.difficulty === difficultyFilter
  
    const matchesSubject = 
      subjectFilter === "all" || 
      subjectFilter === "" || 
      test.subject === subjectFilter
  
    return matchesSearch && matchesDifficulty && matchesSubject
  })

  const subjects = Array.from(new Set(tests.map((test) => test.subject).filter(Boolean)))

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      const utcHours = date.getUTCHours();
      const utcMinutes = date.getUTCMinutes();
      const ampm = utcHours >= 12 ? 'PM' : 'AM';
      const hours12 = utcHours % 12 || 12;
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weekday = weekdays[date.getUTCDay()];
      const month = months[date.getUTCMonth()];
      const day = date.getUTCDate();  
      return `${weekday}, ${month} ${day}, ${hours12}:${utcMinutes.toString().padStart(2, '0')} ${ampm} UTC`;
    } catch {
      return "Invalid date";
    }
  }

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

  const isTestAvailable = (test: Test) => {
    try {
      const scheduledUTC = new Date(test.scheduled_at).getTime();
      const currentUTC = Date.now();
      const currentIST = currentUTC + (5.5 * 60 * 60 * 1000);
      return scheduledUTC <= currentIST;
    } catch (err) {
      console.error('Date parsing error:', err);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <Skeleton className="h-10 w-[250px]" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[220px]" />
          </div>
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center gap-4">
          <div className="text-center text-red-500">
            <p className="font-medium">Error loading tests</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
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
              <h1 className="text-3xl font-bold tracking-tight">Scheduled Tests</h1>
              <p className="text-muted-foreground">View and take tests to improve your aptitude skills</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tests..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredTests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No tests found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {isTestAvailable(test) ? (
                    <Link
                      href={{
                        pathname: `/tests/${test.id}`,
                        query: {
                          testData: JSON.stringify(test),
                        },
                      }}
                    >
                      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">#{test.id}</Badge>
                                <Badge className={getDifficultyColor(test.difficulty)}>
                                  {test.difficulty}
                                </Badge>
                              </div>
                              <CardTitle className="text-xl">{test.name}</CardTitle>
                              <CardDescription>{test.subject}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{test.questions_count} Questions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{test.duration} Minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{test.marks} Marks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{test.teacher || "Unknown"}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/50 py-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Scheduled for {formatDate(test.scheduled_at)}</span>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="overflow-hidden opacity-75">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">#{test.id}</Badge>
                              <Badge className={getDifficultyColor(test.difficulty)}>
                                {test.difficulty}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              {test.name}
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>{test.subject}</CardDescription>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full" disabled>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{test.questions_count} Questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{test.duration} Minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{test.marks} Marks</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{test.teacher || "Unknown"}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 py-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Available from {formatDate(test.scheduled_at)}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}