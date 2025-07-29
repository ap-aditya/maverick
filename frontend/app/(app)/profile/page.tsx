export const dynamic = 'force-dynamic';
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const profile = await db.query.userProfile.findFirst();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your professional information and preferences
            </p>
          </div>
        </header>
        <section>
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    Professional Information
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your profile details
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ProfileForm profile={profile ?? null} />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
