import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Bot,
  GitBranch,
  BarChart3,
  ExternalLink,
  ArrowRight,
  Star,
  CheckCircle,
  Briefcase,
  Zap,
  LogIn,
  Shield,
  Brain,
  Search,
  FileText,
  Clock,
  Building2,
  Filter,
  Info,
  Edit,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <section className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-20">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <Bot className="h-10 w-10 text-white animate-bounce" />
              </div>
            </div>

            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium">
                <Shield className="h-4 w-4 mr-2" />
                Personal AI Career Agent
              </Badge>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Maverick
                </span>
                <br />
                <span className="text-gray-900 text-3xl md:text-4xl lg:text-5xl">
                  AI-Powered Career Intelligence
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                A sophisticated personal dashboard for discovering, analyzing,
                and tracking job opportunities with intelligent automation
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="text-lg px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Link href="/login">
                  <LogIn className="mr-3 h-5 w-5" />
                  Access System
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-12 py-6 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 group"
              >
                <a
                  href={process.env.GITHUB_REPO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitBranch className="mr-3 h-5 w-5" />
                  View Source Code
                  <ExternalLink className="ml-3 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI
                </div>
                <div className="text-sm text-gray-600 mt-1">Powered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-sm text-gray-600 mt-1">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Personal
                </div>
                <div className="text-sm text-gray-600 mt-1">System</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                See Maverick in Action
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 border-b">
                    <div className="text-center space-y-2">
                      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Dashboard
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Your personal career agent&apos;s latest insights
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative overflow-hidden border-l-4 border-l-blue-500 bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Total Jobs Found
                            </p>
                            <p className="text-lg font-bold tracking-tight">
                              247
                            </p>
                            <p className="text-xs text-muted-foreground">
                              From 23 companies
                            </p>
                          </div>
                          <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      </div>

                      <div className="relative overflow-hidden border-l-4 border-l-green-500 bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              Quality Matches
                              <Info className="h-3 w-3 text-blue-500" />
                            </p>
                            <p className="text-lg font-bold tracking-tight">
                              42
                            </p>
                            <p className="text-xs text-muted-foreground">
                              8.7/10 avg score
                            </p>
                          </div>
                          <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded">
                            <Star className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          Recent Jobs
                        </h4>
                        <Badge variant="outline">5 new</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">
                                Senior Software Engineer
                              </p>
                              <p className="text-xs text-gray-600">
                                Google • Remote
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border border-green-200">
                            <Star className="h-3 w-3 mr-1" />
                            9/10
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">
                                Full Stack Developer
                              </p>
                              <p className="text-xs text-gray-600">
                                Microsoft • Seattle, WA
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            7/10
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 border-b">
                    <div className="text-center space-y-2">
                      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Analytics
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Track your job search progress and insights
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Filter className="h-4 w-4 text-blue-600" />
                        <Badge variant="outline">Last 30 Days</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Search className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold">
                          Search & Filter
                        </span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          156 of 247 jobs
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white rounded border px-2 py-1">
                          <span className="text-xs text-gray-500">Search</span>
                        </div>
                        <div className="bg-white rounded border px-2 py-1">
                          <span className="text-xs text-gray-500">Status</span>
                        </div>
                        <div className="bg-white rounded border px-2 py-1">
                          <span className="text-xs text-gray-500">
                            Score 8+
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          Top Companies
                        </h4>
                        <Badge variant="outline">8 companies shown</Badge>
                      </div>

                      <div className="flex items-center justify-center mb-4">
                        <div className="relative w-24 h-24">
                          <div
                            className="absolute inset-0 rounded-full border-8 border-blue-500"
                            style={{
                              clipPath:
                                "polygon(50% 50%, 50% 0%, 100% 0%, 100% 38%, 50% 50%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-green-500"
                            style={{
                              clipPath:
                                "polygon(50% 50%, 100% 38%, 100% 75%, 50% 50%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-yellow-500"
                            style={{
                              clipPath:
                                "polygon(50% 50%, 100% 75%, 85% 100%, 50% 50%)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-purple-500"
                            style={{
                              clipPath:
                                "polygon(50% 50%, 85% 100%, 15% 100%, 50% 50%)",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Google</span>
                          </div>
                          <span className="font-medium">12 jobs</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Microsoft</span>
                          </div>
                          <span className="font-medium">8 jobs</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Apple</span>
                          </div>
                          <span className="font-medium">6 jobs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 border-b">
                    <div className="text-center space-y-2">
                      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Application Tracker
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Monitor and manage your job applications
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 rounded-lg border border-gray-200 mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Search className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">
                          Filter Applications
                        </h3>
                        <Badge variant="outline" className="ml-auto">
                          23 of 45 applications
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            className="pl-10 w-full p-2 border rounded-lg text-sm"
                            placeholder="Company or job title..."
                          />
                        </div>
                        <select className="p-2 border rounded-lg text-sm">
                          <option>All Statuses</option>
                        </select>
                        <select className="p-2 border rounded-lg text-sm">
                          <option>Last 30 Days</option>
                        </select>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-900">
                          <span>Company</span>
                          <span>Job Title</span>
                          <span>Status</span>
                          <span>Date Applied</span>
                          <span>Actions</span>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="grid grid-cols-5 gap-4 items-center text-sm">
                            <span className="font-medium">Google</span>
                            <span>Senior Developer</span>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Interviewing
                              </Badge>
                              <Edit className="h-3 w-3 text-gray-400" />
                            </div>
                            <span>Dec 15, 2024</span>
                            <div className="flex gap-1">
                              <button className="h-8 w-8 p-0 hover:bg-blue-50 rounded">
                                <ExternalLink className="h-3 w-3" />
                              </button>
                              <button className="h-8 w-8 p-0 hover:bg-gray-50 rounded">
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="grid grid-cols-5 gap-4 items-center text-sm">
                            <span className="font-medium">Microsoft</span>
                            <span>Full Stack Engineer</span>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 border border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Offer
                              </Badge>
                              <Edit className="h-3 w-3 text-gray-400" />
                            </div>
                            <span>Dec 10, 2024</span>
                            <div className="flex gap-1">
                              <button className="h-8 w-8 p-0 hover:bg-blue-50 rounded">
                                <ExternalLink className="h-3 w-3" />
                              </button>
                              <button className="h-8 w-8 p-0 hover:bg-gray-50 rounded">
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                System Architecture
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A comprehensive career intelligence platform built with modern
                technologies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Intelligent Job Discovery
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Automated job scraping and discovery with AI-powered
                    relevance filtering based on your profile
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sophisticated matching algorithms that analyze job
                    descriptions against your skills and experience
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Advanced Analytics
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Comprehensive dashboards with insights, trends, and pipeline
                    tracking for data-driven decisions
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Application Tracking
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Complete application lifecycle management with status
                    tracking and progress monitoring
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-pink-50 to-rose-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Full Automation
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Autonomous agent that continuously monitors, analyzes, and
                    organizes opportunities
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-teal-50 to-cyan-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Personal Dashboard
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Centralized command center for managing your entire job
                    search process efficiently
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <GitBranch className="h-12 w-12" />
                  <h2 className="text-4xl md:text-5xl font-bold">
                    Open Source Project
                  </h2>
                </div>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Complete source code available for setting up your own
                  personal AI career intelligence system. Fully customizable and
                  deployable to your own infrastructure.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Modern Next.js architecture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>AI-agent</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Comprehensive analytics dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Complete setup documentation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Customizable AI prompts and scoring</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <a
                      href={process.env.GITHUB_REPO_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitBranch className="mr-3 h-5 w-5" />
                      View Repository
                      <ExternalLink className="ml-3 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="lg:pl-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="bg-black rounded-lg p-4 font-mono text-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="ml-2 text-gray-400">terminal</span>
                      </div>
                      <div className="space-y-2 text-green-400">
                        <p>
                          <span className="text-blue-400">$</span> git clone{" "}
                          {process.env.GITHUB_REPO_LINK}
                        </p>
                        <p>
                          <span className="text-blue-400">$</span> cd
                          maverick/frontend
                        </p>
                        <p>
                          <span className="text-blue-400">$</span> npm install
                        </p>
                        <p>
                          <span className="text-blue-400">$</span> cp
                          .env.example .env.local
                        </p>
                        <p className="text-gray-400">
                          # Configure your DB and API keys
                        </p>
                        <p>
                          <span className="text-blue-400">$</span> npm run dev
                        </p>
                        <p className="text-yellow-400">
                          ✓ Jobbot running on localhost:3000
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center items-center mb-6">
              <Bot className="h-8 w-8 text-blue-500 mr-3" />
              <span className="text-2xl font-bold text-gray-900">Maverick</span>
            </div>
            <p className="text-gray-600 mb-6">
              Personal AI career intelligence system for automated job discovery
              and analysis
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
              <Link
                href="/login"
                className="hover:text-blue-600 transition-colors"
              >
                System Access
              </Link>
              <span>•</span>
              <a
                href={process.env.GITHUB_REPO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                GitHub Repository
              </a>
              <span>•</span>
              <span>Built with Next.js</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
