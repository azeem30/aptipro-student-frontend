"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"

interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct_option: string;
  difficulty: string;
  subject: string;
}

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

interface QuestionResponse extends Question {
  selected_option: string | null;
}

interface SubmissionData {
  user: any; 
  test: Test;
  responses: QuestionResponse[];
}

export default function TestPage({ params }: { params: { testId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false)
  const [test, setTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestAndQuestions = async () => {
      try {
        setLoading(true)
        setError(null)
        const testDataParam = searchParams.get('testData')
        if (!testDataParam) {
          throw new Error("Test data not provided")
        }
        const parsedTest = JSON.parse(testDataParam)
        setTest(parsedTest)
        setTimeLeft(parsedTest.duration * 60)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/questions?` +
          `subject=${encodeURIComponent(parsedTest.subject)}&` +
          `difficulty=${encodeURIComponent(parsedTest.difficulty)}&` +
          `limit=${parsedTest.questions_count}`, 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
    
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status}`)
        }
    
        const data = await response.json()
        if (!Array.isArray(data.mcq)) {
          throw new Error("Invalid questions data format")
        }
        const filteredQuestions = data.mcq.slice(0, parsedTest.questions_count)
        setQuestions(filteredQuestions)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTestAndQuestions()
  }, [searchParams])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (!test || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsTimeUpDialogOpen(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [test, timeLeft])

  // Handle option selection
  const handleOptionSelect = (questionId: number, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  // Navigation functions
  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const goToNextQuestion = () => {
    if (test && currentQuestion < test.questions_count - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index)
  }

  // Handle test submission
  // Handle test submission
  const handleSubmit = async () => {
    if (!test) return;
    const userDataString = localStorage.getItem("aptipro-user");
    if (!userDataString) {
      setError("User data not found. Please login again.");
      return;
    }
    const user = JSON.parse(userDataString);
    const responses = questions.map((question) => ({
      ...question,
      selected_option: selectedOptions[question.id] || null,
    }));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          test,
          responses,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to submit test: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit test");
      console.error("Submission error:", err);
    }
  };

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

  // Transform question options to consistent format
  const getQuestionOptions = (question: Question) => {
    return [
      { id: "A", text: question.optionA },
      { id: "B", text: question.optionB },
      { id: "C", text: question.optionC },
      { id: "D", text: question.optionD },
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Error loading test</h2>
            <p className="text-muted-foreground mt-2">
              {error || "The test you're looking for couldn't be loaded."}
            </p>
            <Button className="mt-4" onClick={() => router.push('/tests')}>
              Back to Tests
            </Button>
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
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline">#{test.id}</Badge>
                <Badge className={getDifficultyColor(test.difficulty)}>{test.difficulty}</Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{test.name}</h1>
              <p className="text-muted-foreground">
                {test.subject} • {test.questions_count} Questions • {test.marks} Marks
              </p>
            </div>

            <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Question navigation sidebar */}
            <Card className="md:w-64 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Questions</CardTitle>
                <CardDescription>
                  {Object.keys(selectedOptions).length} of {test.questions_count} answered
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-5 gap-2">
                {Array.from({ length: test.questions_count }).map((_, index) => (
                  <Button
                    key={index}
                    variant={
                      currentQuestion === index ? "default" : selectedOptions[index + 1] ? "secondary" : "outline"
                    }
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => jumpToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Question and options */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {questions[currentQuestion] && (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                            Question {currentQuestion + 1}
                          </span>
                        </CardTitle>
                        <CardDescription className="text-lg font-medium text-foreground pt-2">
                          {questions[currentQuestion].question}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getQuestionOptions(questions[currentQuestion]).map((option) => (
                          <div
                            key={option.id}
                            className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                              selectedOptions[questions[currentQuestion].id] === option.id
                                ? "border-primary bg-primary/5"
                                : "border-muted hover:border-primary/50 hover:bg-muted"
                            }`}
                            onClick={() => handleOptionSelect(questions[currentQuestion].id, option.id)}
                          >
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                                selectedOptions[questions[currentQuestion].id] === option.id
                                  ? "border-primary"
                                  : "border-muted-foreground"
                              }`}
                            >
                              <span className="text-sm font-medium">{option.id}</span>
                            </div>
                            <div className="text-base">{option.text}</div>
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter className="flex justify-between border-t p-4">
                        <Button variant="outline" onClick={goToPrevQuestion} disabled={currentQuestion === 0}>
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>

                        {currentQuestion === test.questions_count - 1 ? (
                          <Button onClick={() => setIsSubmitDialogOpen(true)}>
                            Submit Test
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button onClick={goToNextQuestion}>
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Submit confirmation dialog */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {Object.keys(selectedOptions).length} out of {test.questions_count} questions.
              {Object.keys(selectedOptions).length < test.questions_count && (
                <div className="mt-2 flex items-center gap-2 text-yellow-500">
                  <AlertTriangle className="h-4 w-4" />
                  <span>You have unanswered questions.</span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time up dialog */}
      <AlertDialog open={isTimeUpDialogOpen} onOpenChange={setIsTimeUpDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
        <AlertDialogTitle>Time's Up!</AlertDialogTitle>
        <AlertDialogDescription>
          Your test time has expired. Your answers will be automatically submitted.
        </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
        <AlertDialogAction onClick={handleSubmit}>View Results</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}