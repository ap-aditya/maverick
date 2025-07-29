"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateUserProfile, reanalyzeAllJobs } from "@/lib/actions";
import { useTransition } from "react";
import {
  Loader2,
  Sparkles,
  User,
  Code,
  Briefcase,
  FolderOpen,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { userProfile } from "@/lib/schema";
import { toast } from "sonner";

type UserProfile = typeof userProfile.$inferSelect;

const formSchema = z.object({
  full_name: z.string().optional(),
  summary: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  projects: z.string().optional(),
  skills: z.string().optional(),
});

export function ProfileForm({ profile }: { profile: UserProfile | null }) {
  const [isSaving, startSavingTransition] = useTransition();
  const [isAnalyzing, startAnalyzingTransition] = useTransition();

  const getJsonString = (value: string | null | undefined) => {
    try {
      return value ? JSON.stringify(JSON.parse(value), null, 2) : "";
    } catch {
      return value || "";
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      summary: profile?.summary || "",
      experience: getJsonString(profile?.experience),
      education: getJsonString(profile?.education),
      projects: getJsonString(profile?.projects),
      skills: getJsonString(profile?.skills),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startSavingTransition(async () => {
      const result = await updateUserProfile(values);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
      }
    });
  }

  function handleReanalyzeClick() {
    startAnalyzingTransition(() => {
      toast.promise(reanalyzeAllJobs(), {
        loading: "Starting re-analysis... This may take several minutes.",
        success: (data) => data.success || "Re-analysis complete!",
        error: (data) => data.error || "An unknown error occurred.",
      });
    });
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Basic Information
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Personal details and professional summary
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Professional Summary
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A concise 2-3 sentence professional summary highlighting your key strengths and career focus..."
                        className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      This summary helps the AI understand your professional
                      focus and career goals.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Code className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Technical Skills
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Programming languages, frameworks, and tools
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">
                  JSON Format
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Skills Array
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px] font-mono text-sm bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder='["Python", "JavaScript", "React", "Node.js", "SQL", "Git"]'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Enter as a JSON array of strings. Include programming
                      languages, frameworks, and tools.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Work Experience
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Professional work history and achievements
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">
                  JSON Format
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Experience Details
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[200px] font-mono text-sm bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder='[{"company": "Company Name", "position": "Job Title", "duration": "Jan 2020 - Present", "responsibilities": ["Responsibility 1", "Responsibility 2"]}]'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Enter as a JSON array of objects with company, position,
                      duration, and responsibilities.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Projects
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Personal and professional projects
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">
                  JSON Format
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="projects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Project Details
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[200px] font-mono text-sm bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder='[{"name": "Project Name", "description": "Brief description", "technologies": ["Tech1", "Tech2"], "url": "https://project-url.com"}]'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Enter as a JSON array of objects with name, description,
                      technologies, and optional URL.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Education
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Academic background and qualifications
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">
                  JSON Format
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Education Details
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[200px] font-mono text-sm bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder='[{"institution": "University Name", "degree": "Bachelor of Science", "field": "Computer Science", "graduation": "2020"}]'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Enter as a JSON array of objects with institution, degree,
                      field, and graduation year.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 px-8"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </form>
      </Form>

      <Card className="shadow-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">
                Job Score Re-analysis
              </CardTitle>
              <p className="text-sm text-blue-700 mt-1">
                Update match scores for all jobs based on your profile changes
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                After updating your profile, re-analyze all jobs to recalculate
                match scores based on your new information. This process may
                take several minutes to complete.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleReanalyzeClick}
              disabled={isAnalyzing}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-200 flex-shrink-0"
            >
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Sparkles className="mr-2 h-4 w-4" />
              Re-analyze All Jobs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
