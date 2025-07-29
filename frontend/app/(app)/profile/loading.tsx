import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-16 w-72 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </header>
        <div className="space-y-8">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-48 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-3 w-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-5 w-20 ml-auto rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full rounded bg-gray-50" />
                <Skeleton className="h-3 w-96" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-36 mb-1" />
                  <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-5 w-20 ml-auto rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-48 w-full rounded bg-gray-50" />
                <Skeleton className="h-3 w-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-20 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-5 w-20 ml-auto rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-48 w-full rounded bg-gray-50" />
                <Skeleton className="h-3 w-88" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-24 mb-1" />
                  <Skeleton className="h-4 w-68" />
                </div>
                <Skeleton className="h-5 w-20 ml-auto rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-48 w-full rounded bg-gray-50" />
                <Skeleton className="h-3 w-92" />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card className="shadow-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="border-b border-blue-100">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-40 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
