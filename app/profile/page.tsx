"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, BookOpen, BarChart3, Settings, LogOut } from "lucide-react"

export default function ProfilePage() {
  
  const userData = localStorage.getItem("aptipro-user")
  const user = userData ? JSON.parse(userData) : null

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
                      <div className="text-2xl font-bold text-primary">{user.average_score}%</div>
                      <div className="text-xs text-muted-foreground">Average Score</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t flex justify-between">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm">
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
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input id="first-name" defaultValue="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input id="last-name" defaultValue="Doe" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user.email} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select defaultValue={user.department.toLowerCase().replace(" ", "")}>
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select your department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mechanical">Mechanical</SelectItem>
                              <SelectItem value="electrical">Electrical</SelectItem>
                              <SelectItem value="extc">EXTC</SelectItem>
                              <SelectItem value="computer">Computer Science</SelectItem>
                              <SelectItem value="it">Information Technology</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">New Password</Label>
                          <Input id="password" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                      <Button>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="performance" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Analytics</CardTitle>
                      <CardDescription>View your test performance and progress over time</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-lg border p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">Score Distribution</h3>
                          <Badge variant="outline" className="font-mono">
                            <BarChart3 className="mr-1 h-3 w-3" />
                            Last 10 Tests
                          </Badge>
                        </div>
                        <div className="h-[200px] flex items-end gap-2">
                          {[65, 72, 58, 80, 75, 90, 85, 78, 82, 88].map((score, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className={`w-full rounded-t-sm ${
                                  score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ height: `${score * 1.8}px` }}
                              ></div>
                              <span className="text-xs text-muted-foreground">{score}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-lg border p-6">
                          <h3 className="text-lg font-medium mb-4">Subject Performance</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Mathematics</span>
                                <span className="font-medium">85%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-green-500 w-[85%]"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Logic</span>
                                <span className="font-medium">78%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[78%]"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>General Aptitude</span>
                                <span className="font-medium">92%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-green-500 w-[92%]"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Computer Science</span>
                                <span className="font-medium">65%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[65%]"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-6">
                          <h3 className="text-lg font-medium mb-4">Difficulty Analysis</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Easy</span>
                                <span className="font-medium">95%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-green-500 w-[95%]"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Medium</span>
                                <span className="font-medium">82%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-green-500 w-[82%]"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Hard</span>
                                <span className="font-medium">68%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[68%]"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                      <Button variant="outline">Download Report</Button>
                    </CardFooter>
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

