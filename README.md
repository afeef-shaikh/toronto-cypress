# Toronto Cypress: Citizen Infrastructure Reporting System

![Toronto Cypress Homepage](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wMZrya387OPJtRQruRSANmMWOjsWZs.png)

## 📋 Project Overview

Toronto Cypress is a modern, user-friendly platform designed to streamline communication between Toronto residents and city services. This web application enables citizens to report and track local infrastructure issues such as potholes, street light outages, graffiti, and more, creating a more responsive and transparent system for addressing community concerns.

## ✨ Key Features

- **Interactive Mapping**: Pinpoint exact locations of issues on an integrated Google Maps interface
- **Comprehensive Reporting System**: Submit detailed reports with descriptions, photos, and precise locations
- **Real-time Status Tracking**: Monitor the progress of submitted reports from pending to resolution
- **Dual User Roles**: Separate interfaces for citizens and administrators
- **Responsive Design**: Fully functional on both desktop and mobile devices
- **Dark/Light Mode**: Support for user preference with theme switching
- **Notifications System**: Keep users informed about updates to their reports

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Maps Integration**: Google Maps API with secure server-side implementation
- **State Management**: React Context API
- **Authentication**: Custom authentication system with role-based access
- **Data Storage**: Client-side storage with localStorage (can be replaced with a database in production)

## 📱 Application Modules

### Citizen Interface

![Citizen Login](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rQxUtLYPOIdx4tKKSAJBelnJxsA4oU.png)

- **User Authentication**: Register and login functionality with role selection
- **Report Submission**: Intuitive form with map integration for precise location selection
- **My Reports**: Personal dashboard to track and manage submitted reports
- **Report Details**: Comprehensive view of report status, history, and updates

### Administrator Interface

![Admin Dashboard](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gBDEFj3d6RvIiJrcf16opk3jfzIOp8.png)

- **Admin Dashboard**: Overview of all reports with key metrics and statistics
- **Report Management**: Update status, add notes, and manage citizen reports
- **Analytics**: Visual representation of reporting trends and resolution rates
- **System Configuration**: Manage report categories and system settings

### Mapping System

![Reports Map](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HG5oWbZ80JquoSkXMl1N7Cr5aG9qvk.png)

- **Interactive Map**: View all reported issues across Toronto
- **Filtering Options**: Filter reports by status, type, and location
- **Report Markers**: Color-coded markers indicating report status
- **Location Selection**: Click-to-select functionality for report submission

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn package manager
- Google Maps API key (for development and production)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/toronto-cypress.git
   cd toronto-cypress

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## 📊 Data Flow

### 1. **Report Submission**:

1. User selects location on map
2. User fills out report details and uploads images
3. System creates report with "pending" status
4. Notification is generated for administrators

![Report Submission Interface](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iv6WvZjkFqYhto1qw59BHgRaNO2MZe.png)

The Report Submission interface provides an intuitive form alongside an interactive map. Users can precisely pinpoint the location of an issue by clicking directly on the map, which automatically captures the coordinates. The form allows selection of problem type (pothole, street light, graffiti, etc.), detailed description, and photo uploads to provide visual evidence of the issue. This dual-panel approach ensures accurate location reporting while collecting all necessary details for city services to address the problem efficiently.

### 2. **Report Processing**:

1. Administrators review submitted reports
2. Status is updated to "in-progress" when work begins
3. Citizens receive notifications about status changes
4. Report is marked "resolved" when the issue is fixed

![Admin Dashboard](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gBDEFj3d6RvIiJrcf16opk3jfzIOp8.png)

The Administrator Dashboard provides city officials with a comprehensive overview of all citizen reports. The interface displays key metrics at the top, showing total reports and their distribution across different statuses (pending, in progress, resolved). The main table presents all reports with essential details including ID, type, location, status, and submission date. Administrators can filter reports by status and type, search for specific issues, and access quick actions for each report. This centralized management system enables efficient processing of citizen-reported issues, ensuring timely responses and resolution tracking.

### 3. **Report Tracking**:

1. Citizens can view all their submitted reports
2. Reports are filterable by status and type
3. Timeline shows the history of each report
4. Citizens can add additional information to existing reports

![My Reports Dashboard](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lQ1lmJP74i5qkZ95EkD98Qa3QV0miV.png)

The My Reports dashboard gives citizens a personalized view of all their submitted issues. Reports are organized in a clean, card-based layout with clear status indicators (color-coded badges for pending, in progress, and resolved). Users can filter their reports by status using the tab navigation at the top, making it easy to focus on active issues or view their resolution history. Each report card displays the essential information at a glance, with the option to view full details. This dashboard empowers citizens to stay informed about the status of infrastructure issues they've reported without needing to contact city services directly.

## 🎨 UI/UX Design

![About Page](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9umlSEhE6mbm7kDidFM1wcEgzeeKYl.png)

Toronto Cypress features a clean, modern interface designed with both aesthetics and usability in mind. The design system employs:

- **Consistent Color Palette**: Toronto's official blue serves as the primary color, creating brand recognition while ensuring accessibility with proper contrast ratios
- **Card-Based Layout**: Information is organized in clear, distinct cards with consistent spacing and typography
- **Intuitive Navigation**: The main navigation bar remains fixed at the top, providing easy access to all key sections
- **Responsive Components**: All elements adapt seamlessly to different screen sizes, from mobile to desktop
- **Visual Hierarchy**: Important information and actions are emphasized through size, color, and positioning
- **Iconography**: Custom icons provide visual cues that complement text labels for improved comprehension
- **Whitespace Utilization**: Generous spacing between elements reduces cognitive load and improves readability

The About page exemplifies these principles, presenting the platform's mission and features in a structured, easily scannable format. Feature descriptions are accompanied by relevant icons, and the content is organized in logical sections with clear headings. This thoughtful design approach extends throughout the application, ensuring a consistent and intuitive user experience.

<div align="center" style="margin-top: 50px; margin-bottom: 50px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 18px; color: #0077C0;">
  <p>Built with ❤️ for the citizens of Toronto</p>
</div>
