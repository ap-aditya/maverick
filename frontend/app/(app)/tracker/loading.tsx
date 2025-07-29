export const dynamic = 'force-dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Skeleton className="h-10 w-40" />
          </div>
        </header>

        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-28 ml-auto rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="relative">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-5 gap-4">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="grid grid-cols-5 gap-4 items-center">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-36" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-3 w-3" />
                          </div>

                          <Skeleton className="h-4 w-20" />

                          <div className="flex items-center gap-1">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
