"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60"></div>

        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4 py-20">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </div>

            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Oops! Something Went Wrong
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    We encountered an unexpected error while processing your
                    request
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-left">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Error Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Message:</span>{" "}
                      {error.message || "An unexpected error occurred"}
                    </p>
                    {error.digest && (
                      <p>
                        <span className="font-medium">Error ID:</span>{" "}
                        {error.digest}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Suggestion:</span> This
                      might be a temporary issue. Please try refreshing the
                      page.
                    </p>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    What you can do:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-lg">
                      <RefreshCw className="h-6 w-6 text-blue-500" />
                      <span className="font-medium">Refresh the page</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-lg">
                      <ArrowLeft className="h-6 w-6 text-green-500" />
                      <span className="font-medium">Go back and try again</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 p-4 bg-purple-50 rounded-lg">
                      <Home className="h-6 w-6 text-purple-500" />
                      <span className="font-medium">Return to dashboard</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    onClick={() => reset()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                  >
                    <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    Try Again
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  >
                    <Link href="/dashboard">
                      <Home className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                If this problem persists, the issue might be temporary. Please
                try again in a few minutes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
