"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, User, Mail, Award, ChevronLeft, ChevronRight } from "lucide-react"

interface Question {
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
}

interface Result {
  id: number;
  name: string;
  marks: number;
  total_marks: number;
  difficulty: string;
  subject: string;
  student_email: string;
  teacher_email: string;
  data: string; // Stored as JSON string
  test_id: number;
}

interface TransformedQuestion {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  selectedOption: string;
  correctOption: string;
  marksScored: number;
}

interface TransformedResult {
  id: string;
  testId: string;
  title: string;
  marksScored: number;
  totalMarks: number;
  difficulty: string;
  subject: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  questions: TransformedQuestion[];
}

export default function DetailedResultPage({ params }: { params: { resultId: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const searchParams = useSearchParams()
  
  const resultData = searchParams.get('resultData')
  let result: Result | null = null
  const userData = localStorage.getItem("aptipro-user")
  const user = userData ? JSON.parse(userData) : null

  try {
    if (resultData) {
      result = JSON.parse(resultData)
    }
  } catch (error) {
    console.error("Error parsing result data:", error)
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Result not found</h2>
            <p className="text-muted-foreground mt-2">
              The requested result could not be loaded. Please go back and try again.
            </p>
          </div>
        </main>
      </div>
    )
  }

  let parsedQuestions: Question[] = [];
  try {
    parsedQuestions = JSON.parse(result.data) as Question[];
  } catch (error) {
    console.error("Error parsing question data:", error);
    parsedQuestions = [];
  }
  
  const transformedResult: TransformedResult = {
    id: result.id.toString(),
    testId: result.test_id.toString(),
    title: result.name,
    marksScored: result.marks,
    totalMarks: result.total_marks,
    difficulty: result.difficulty,
    subject: result.subject,
    studentId: user.id,
    studentName: user.name,
    studentEmail: result.student_email,
    questions: parsedQuestions.map((question) => ({
      id: question.id,
      text: question.question,
      options: [
        { id: "A", text: question.optionA },
        { id: "B", text: question.optionB },
        { id: "C", text: question.optionC },
        { id: "D", text: question.optionD },
      ],
      selectedOption: question.selected_option,
      correctOption: question.correct_option,
      marksScored: question.selected_option === question.correct_option ? 1 : 0,
    }))
  }

  // Calculate percentage
  const calculatePercentage = (scored: number, total: number) => {
    return total > 0 ? Math.round((scored / total) * 100) : 0;
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

  // Navigate to previous question
  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestion < transformedResult.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  // Jump to specific question
  const jumpToQuestion = (index: number) => {
    if (index >= 0 && index < transformedResult.questions.length) {
      setCurrentQuestion(index)
    }
  }

  // Guard against empty questions array
  if (transformedResult.questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">No Questions Found</h2>
            <p className="text-muted-foreground mt-2">
              This test doesn't contain any questions.
            </p>
          </div>
        </main>
      </div>
    )
  }

  const currentQ = transformedResult.questions[currentQuestion]

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
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{transformedResult.testId}</Badge>
                    <Badge className={getDifficultyColor(transformedResult.difficulty)}>
                      {transformedResult.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{transformedResult.title}</CardTitle>
                  <CardDescription>{transformedResult.subject}</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-bold">
                    <span
                      className={getScoreColor(
                        calculatePercentage(transformedResult.marksScored, transformedResult.totalMarks),
                      )}
                    >
                      {transformedResult.marksScored}
                    </span>
                    <span className="text-muted-foreground">/{transformedResult.totalMarks}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {calculatePercentage(transformedResult.marksScored, transformedResult.totalMarks)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Student ID</div>
                    <div className="font-medium">{transformedResult.studentId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Student Name</div>
                    <div className="font-medium">{transformedResult.studentName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Student Email</div>
                    <div className="font-medium">{transformedResult.studentEmail}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Question navigation sidebar */}
            <Card className="md:w-64 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Questions</CardTitle>
                <CardDescription>Navigate through questions</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-5 gap-2">
                {transformedResult.questions.map((question, index) => (
                  <Button
                    key={question.id}
                    variant={currentQuestion === index ? "default" : "outline"}
                    size="sm"
                    className={`h-10 w-10 p-0 ${
                      question.marksScored > 0 ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                    }`}
                    onClick={() => jumpToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Question and options */}
            <div className="flex-1">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-primary/20">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                          Question {currentQuestion + 1}
                        </span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {currentQ.marksScored > 0 ? (
                          <Badge className="bg-green-500/10 text-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Incorrect
                          </Badge>
                        )}
                        <Badge variant="outline">
                          <Award className="mr-1 h-3 w-3" />
                          {currentQ.marksScored} Mark
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-lg font-medium text-foreground pt-2">
                      {currentQ.text}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentQ.options.map((option) => {
                      const isSelected = currentQ.selectedOption === option.id
                      const isCorrect = currentQ.correctOption === option.id

                      let optionClass = "border-muted"
                      if (isSelected && isCorrect) {
                        optionClass = "border-green-500 bg-green-500/10"
                      } else if (isSelected && !isCorrect) {
                        optionClass = "border-red-500 bg-red-500/10"
                      } else if (isCorrect) {
                        optionClass = "border-green-500 bg-green-500/5"
                      }

                      return (
                        <div key={option.id} className={`flex items-start gap-3 p-3 rounded-md border ${optionClass}`}>
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? isCorrect
                                  ? "border-green-500"
                                  : "border-red-500"
                                : isCorrect
                                  ? "border-green-500"
                                  : "border-muted-foreground"
                            }`}
                          >
                            <span className="text-sm font-medium">{option.id}</span>
                          </div>
                          <div className="text-base">{option.text}</div>
                          {isSelected && (
                            <div className="ml-auto">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                          {!isSelected && isCorrect && (
                            <div className="ml-auto">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-4">
                    <Button variant="outline" onClick={goToPrevQuestion} disabled={currentQuestion === 0}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      onClick={goToNextQuestion}
                      disabled={currentQuestion === transformedResult.questions.length - 1}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}