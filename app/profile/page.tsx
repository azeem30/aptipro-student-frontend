"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, BookOpen, BarChart3, Settings, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("aptipro-user") 
    router.push("/login") 
  }

  useEffect(() => {
    const userData = localStorage.getItem("aptipro-user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      console.log(parsedUser.recent_results)
      setUser(parsedUser)
      const [firstName, ...lastNameParts] = parsedUser.name.split(" ")
      setFormData({
        firstName,
        lastName: lastNameParts.join(" "),
        email: parsedUser.email,
        department: parsedUser.department,
        password: "",
        confirmPassword: ""
      })
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      department: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update_profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          department: formData.department,
          password: formData.password || undefined 
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      const updatedUser = {
        ...user,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        department: formData.department
      }
      
      localStorage.setItem("aptipro-user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }))

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 flex items-center justify-center">
        <div>Loading...</div>
      </main>
    </div>
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
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Profile</CardTitle>
                    <Badge variant="outline">{user.id}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-3 pt-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      <AvatarFallback className="text-2xl">
                        {user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-center">
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.department}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Student ID</div>
                        <div className="font-medium">{user.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Department</div>
                        <div className="font-medium">{user.department}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.tests_done}</div>
                      <div className="text-xs text-muted-foreground">Tests Completed</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.average_score / 100}%</div>
                      <div className="text-xs text-muted-foreground">Average Score</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Account Settings</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Update your account information and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First name</Label>
                              <Input 
                                id="firstName" 
                                value={formData.firstName} 
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last name</Label>
                              <Input 
                                id="lastName" 
                                value={formData.lastName} 
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={formData.email} 
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select 
                              value={formData.department} 
                              onValueChange={handleDepartmentChange}
                            >
                              <SelectTrigger id="department">
                                <SelectValue placeholder="Select your department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mechanical">Mechanical</SelectItem>
                                <SelectItem value="Electrical">Electrical</SelectItem>
                                <SelectItem value="EXTC">EXTC</SelectItem>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                <SelectItem value="Information Technology">Information Technology</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input 
                              id="password" 
                              type="password" 
                              value={formData.password} 
                              onChange={handleInputChange}
                              placeholder="Leave blank to keep current password"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input 
                              id="confirmPassword" 
                              type="password" 
                              value={formData.confirmPassword} 
                              onChange={handleInputChange}
                              placeholder="Leave blank to keep current password"
                            />
                          </div>
                        </div>
                        <CardFooter className="border-t pt-6 px-0 pb-0">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                          </Button>
                        </CardFooter>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="performance" className="mt-6">
                  <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>View your test performance and progress over time</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {user.recent_results && user.recent_results.length > 0 ? (
                    <>
                      <div className="rounded-lg border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Recent Test Scores</h3>
                        <Badge variant="outline" className="font-mono">
                        <BarChart3 className="mr-1 h-3 w-3" />
                        Last {user.recent_results.length} Tests
                        </Badge>
                      </div>
                      <div className="h-[200px] flex items-end gap-2">
                        {user.recent_results.map((result: any, i: number) => {
                        const percentage = (result.marks / 30) * 100; // Assuming max marks is 30
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t-sm ${
                            percentage >= 80
                              ? "bg-green-500"
                              : percentage >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            }`}
                            style={{ height: `${percentage * 1.8}px` }}
                          ></div>
                          <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
                          <span className="text-xs text-muted-foreground truncate max-w-full">
                            {result.name}
                          </span>
                          </div>
                        );
                        })}
                      </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                      <div className="rounded-lg border p-6">
                        <h3 className="text-lg font-medium mb-4">Subject Performance</h3>
                        <div className="space-y-4">
                        {user.recent_results.map((result: any) => {
                          const percentage = (result.marks / 30) * 100;
                          return (
                          <div key={result.name} className="space-y-2">
                            <div className="flex justify-between text-sm">
                            <span>{result.name}</span>
                            <span className="font-medium">{Math.round(percentage)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full ${
                              percentage >= 80
                                ? "bg-green-500"
                                : percentage >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                            </div>
                          </div>
                          );
                        })}
                        </div>
                      </div>

                      <div className="rounded-lg border p-6">
                        <h3 className="text-lg font-medium mb-4">Test Summary</h3>
                        <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Tests Taken</span>
                          <span className="font-medium">{user.recent_results.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Average Score</span>
                          <span className="font-medium">
                          {Math.round(
                            user.recent_results.reduce(
                            (sum: number, result: any) => sum + (result.marks / 30) * 100,
                            0
                            ) / user.recent_results.length
                          )}
                          %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Highest Score</span>
                          <span className="font-medium">
                          {Math.round(
                            Math.max(
                            ...user.recent_results.map(
                              (result: any) => (result.marks / 30) * 100
                            )
                            )
                          )}
                          %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Lowest Score</span>
                          <span className="font-medium">
                          {Math.round(
                            Math.min(
                            ...user.recent_results.map(
                              (result: any) => (result.marks / 30) * 100
                            )
                            )
                          )}
                          %
                          </span>
                        </div>
                        </div>
                      </div>
                      </div>
                    </>
                    ) : (
                    <div className="rounded-lg border p-6 text-center">
                      <p className="text-muted-foreground">No test results available yet.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                      Take some tests to see your performance analytics here.
                      </p>
                    </div>
                    )}
                  </CardContent>
                  {user.recent_results && user.recent_results.length > 0 && (
                    <CardFooter className="border-t pt-6">
                    <Button variant="outline">Download Report</Button>
                    </CardFooter>
                  )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}