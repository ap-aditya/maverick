"use client";

import { useState, useTransition } from "react";
import { jobs } from "@/lib/schema";
import { generateResumeSuggestions, createApplication } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  BrainCircuit,
  Check,
  X,
  Loader2,
  Copy,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
type Job = typeof jobs.$inferSelect;

interface ResumeSuggestions {
  tailored_summary: string;
  suggested_bullet_points: string[];
}

const safeJsonParse = <T,>(jsonString: string | null): T | null => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
};

export function JobDetailView({ job }: { job: Job }) {
  const [isTailoring, setIsTailoring] = useState(false);
  const [isAdding, startAddingTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<ResumeSuggestions | null>(
    safeJsonParse<ResumeSuggestions>(job.tailored_suggestions)
  );
  const [error, setError] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    setIsTailoring(true);
    setError(null);
    const result = await generateResumeSuggestions(job.id);
    if (result.error) {
      setError(result.error);
    } else if (result.suggestions) {
      setSuggestions(result.suggestions as ResumeSuggestions);
    }
    setIsTailoring(false);
  };

  const handleAddToTracker = () => {
    startAddingTransition(async () => {
      await createApplication(
        job.title,
        job.company,
        null,
        null,
        job.match_summary
      );
    });
  };
  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const matchingSkills = safeJsonParse<string[]>(job.matching_skills) || [];
  const missingSkills = safeJsonParse<string[]>(job.missing_skills) || [];

  return (
    <DrawerContent className="max-h-[90vh]">
      <div className="mx-auto w-full max-w-4xl overflow-y-auto">
        <DrawerHeader className="text-left">
          <div className="flex justify-between items-start">
            <div>
              <DrawerTitle className="text-2xl font-bold">
                {job.title}
              </DrawerTitle>
              <DrawerDescription className="text-lg text-slate-600">
                {job.company}
              </DrawerDescription>
            </div>
            <Button onClick={handleAddToTracker} disabled={isAdding}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Tracker
            </Button>
          </div>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2 text-indigo-600" />
              AI Fit Analysis
            </h3>
            <p className="text-slate-700 italic">
              &ldquo;{job.match_summary}&rdquo;
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-700 flex items-center mb-2">
                  <Check className="h-4 w-4 mr-2" /> Matching Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(matchingSkills) &&
                    matchingSkills.map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 flex items-center mb-2">
                  <X className="h-4 w-4 mr-2" /> Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(missingSkills) &&
                    missingSkills.map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Bot className="h-5 w-5 mr-2 text-indigo-600" />
              Resume Tailoring (On-Demand)
            </h3>

            {!suggestions && (
              <>
                <p className="text-slate-600 mb-4">
                  Generate AI-powered suggestions to tailor your resume for this
                  specific role.
                </p>
                <Button onClick={handleGenerateClick} disabled={isTailoring}>
                  {isTailoring && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Resume Suggestions
                </Button>
              </>
            )}

            {suggestions && (
              <div className="space-y-4 text-slate-800 bg-slate-50 p-4 rounded-lg">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Tailored Summary:</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(suggestions.tailored_summary, "summary")
                      }
                    >
                      {copiedItem === "summary" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm">{suggestions.tailored_summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Suggested Bullet Points:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {Array.isArray(suggestions.suggested_bullet_points) &&
                      suggestions.suggested_bullet_points.map(
                        (point, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-start"
                          >
                            <span>{point}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopy(point, `point-${index}`)
                              }
                              className="ml-2 flex-shrink-0"
                            >
                              {copiedItem === `point-${index}` ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </li>
                        )
                      )}
                  </ul>
                </div>
              </div>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}
