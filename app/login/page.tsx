import { AuthForm } from "@/components/auth-form"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Login to your account to report and track issues</p>
          </div>

          <AuthForm mode="login" />

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-toronto-blue hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
