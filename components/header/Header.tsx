import Link from "next/link";
import { Suspense } from "react";
import { Lightbulb, Loader2Icon, PowerIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { auth, signOut } from "@/auth";


export const Header = async () => {
  const session = await auth();

  const user = session?.user;

  return (
    <nav className="border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/home" className="flex items-center gap-2 text-xl">
            <Lightbulb />
            <span className="hidden md:block">APP</span>
          </Link>

          {user && (
            <button className="flex text-white items-center gap-2">
              <Link href="/dashboard">Dashboard</Link>
            </button>
          )}
        </div>

        <div className="flex items-center gap-5">
          <ThemeToggle />

          <Suspense
            fallback={
              <div className="flex w-40 items-center justify-center">
                <Loader2Icon className="h-4 w-4 animate-spin" />
              </div>
            }
          >
            {!user ? (
              <button className="flex items-center gap-2">
                <Link href="/api/auth/signin">Sign In</Link>
              </button>
            ) : (
              <form action={async () => {
                "use server"
                await signOut()
              }}>
                <button className="flex w-full items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                  <PowerIcon className="w-6" />
                  <div className="hidden md:block">Sign Out</div>
                </button>
              </form>
            )}
          </Suspense>
        </div>
      </div>
    </nav>
  );
}

