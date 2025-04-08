import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MapPin, FileText, Info, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-toronto-blue to-toronto-darkBlue text-white hero-section">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Toronto Citizen Reporting & Tracking System
                </h1>
                <p className="max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Empowering citizens to report and track local infrastructure issues. Together, we can make Toronto
                  better.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-white text-toronto-blue hover:bg-gray-100">
                    <Link href="/report">
                      Report an Issue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-toronto-blue hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/map">View Map</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <img
                  alt="Toronto Skyline"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  src="https://images.unsplash.com/photo-1517090504586-fde19ea6066f?q=80&w=1000&auto=format&fit=crop"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform makes it easy to report issues and track their progress
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-toronto-blue text-white">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Report an Issue</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Easily pinpoint the location of the problem on our interactive map and provide details.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-toronto-blue text-white">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Follow the status of your reports and receive updates as they progress toward resolution.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-toronto-blue text-white">
                  <Info className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Stay Informed</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  View all reported issues in your area and contribute to making Toronto better.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Make a Difference?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of Toronto citizens who are helping to improve our city
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/report">Report an Issue</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/map">Explore the Map</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
