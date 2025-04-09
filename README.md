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

5. 5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

