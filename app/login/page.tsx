
import LoginForm from '@/components/ui/login-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();
  // console.log("Session:", session)
  if (session) {
    // console.log("Session:", session)
    redirect("/home");
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            My-App
          </div>
        </div>
        {!session && <LoginForm />}
      </div>
    </main>
  );
}