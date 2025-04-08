import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, FileText, Info, AlertCircle, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">About Toronto Cypress</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>Empowering citizens to improve Toronto</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-7">
                  Toronto Cypress is a citizen-centric platform designed to streamline communication between residents
                  and city services. Our mission is to transform the traditional, cumbersome reporting process into a
                  modern, elegant, and interactive experience.
                </p>
                <p className="leading-7 mt-4">
                  By enabling citizens to easily report and track local infrastructure issues, we aim to create a more
                  responsive, transparent, and efficient system for addressing community concerns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Simple steps to report and track issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="font-medium">Report an Issue</p>
                      <p className="text-sm text-muted-foreground">
                        Pinpoint the exact location on our interactive map and provide details about the problem.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="font-medium">Track Progress</p>
                      <p className="text-sm text-muted-foreground">
                        Monitor the status of your report as it moves through the resolution process.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="font-medium">Stay Informed</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates on your reports and view other issues in your area.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>What makes Toronto Cypress special</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <MapPin className="mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Interactive Mapping</h3>
                      <p className="text-sm text-muted-foreground">
                        Pinpoint exact locations and view reported issues in your area.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <FileText className="mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Detailed Problem Reporting</h3>
                      <p className="text-sm text-muted-foreground">
                        Submit comprehensive reports with photos and descriptions.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <AlertCircle className="mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Real-Time Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitor the status of your reports from submission to resolution.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <CheckCircle className="mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Duplicate Detection</h3>
                      <p className="text-sm text-muted-foreground">
                        Smart system identifies similar reports to prevent duplication.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <Info className="mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">User Dashboard</h3>
                      <p className="text-sm text-muted-foreground">
                        Personalized view of your submitted reports and city-wide issues.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Get in touch with our team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="leading-7">
                    We value your feedback and suggestions. If you have any questions or need assistance, please don't
                    hesitate to contact us.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> support@torontocypress.ca
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> (416) 555-0123
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Address:</span> 100 Queen Street West, Toronto, ON M5H 2N2
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
