"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
export function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };
    return (<div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased">
      <Sidebar userRole={session?.user?.role || "CANDIDATE"} userName={session?.user?.name || "Candidate"} onSignOut={handleSignOut} isLoggedIn={status === "authenticated"}/>

      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>);
}
