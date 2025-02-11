
import Link from "next/link";
import { Suspense } from "react";
import { Lightbulb, Loader2Icon } from "lucide-react";

let user;

export async function Header() {


  return (
    <nav className="border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/home" className="flex items-center gap-2 text-xl">
            <Lightbulb />
            <span className="hidden md:block">APP</span>
          </Link>

          {user && (
            <button className="flex items-center gap-2">
              <Link href="/dashboard">
                Dashboard
              </Link>
            </button>
          )}
        </div>

        <div className="flex items-center gap-5">
          <Suspense
            fallback={
              <div className="flex w-40 items-center justify-center">
                <Loader2Icon className="h-4 w-4 animate-spin" />
              </div>
            }
          >
            <NavActions />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}

async function NavActions() {

  return user ? (
    <>
      <div className="hidden md:block">
        {/* <ModeToggle /> */}
      </div>
      {/* <UserDropdown /> */}
      <div className="md:hidden">
        {/* <MenuButton /> */}
      </div>
    </>
  ) : (
    <>
      {/* <ModeToggle /> */}
      <button className="flex items-center gap-2">
        <Link href="/sign-in">Sign In</Link>
      </button>
    </>
  );
}

