import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="relative">
                  <Skeleton className="h-12 w-12 rounded bg-gradient-to-br from-blue-50 to-blue-100" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="relative">
                  <Skeleton className="h-12 w-12 rounded bg-gradient-to-br from-green-50 to-green-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="relative">
                  <Skeleton className="h-12 w-12 rounded bg-gradient-to-br from-purple-50 to-purple-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="relative">
                  <Skeleton className="h-12 w-12 rounded bg-gradient-to-br from-yellow-50 to-yellow-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-8 w-40" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="relative overflow-hidden transition-shadow duration-200 hover:shadow-lg cursor-pointer border border-gray-200 bg-white"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>

                    <div className="p-6">
                      <div className="pb-3">
                        <Skeleton className="h-6 w-48 mb-2 pr-16" />
                        <div className="flex items-center pt-1">
                          <Skeleton className="h-4 w-4 mr-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>

                      <div className="pb-4">
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-4 mr-2" />
                          <Skeleton className="h-4 w-40" />
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 bg-gray-50/50">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
