# DreamSpace PM - Frontend

Modern Next.js 14 frontend for the DreamSpace Project Management platform. A complete interior design and artisan marketplace application.

## 🚀 Features

### For Designers
- **Project Management**: Create and manage renovation projects with full CRUD operations
- **Task Tracking**: Kanban-style task board with drag-and-drop, priority levels, and status tracking
- **Visual Moodboards**: Create interactive moodboards with drag-and-drop image positioning
- **Artisan Marketplace**: Browse, filter, and connect with verified artisans by category and rating
- **Review System**: Rate and review artisans based on project experience

### For Artisans
- **Professional Profile**: Showcase business info, experience, and contact details
- **Portfolio Management**: Upload and manage portfolio items with images
- **Review Dashboard**: View ratings, feedback, and client testimonials
- **Marketplace Visibility**: Get discovered by designers searching for services

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Date Utilities**: date-fns

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend server running at `http://127.0.0.1:8000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (already configured):
   `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**: Navigate to `http://localhost:3000`

## 🔐 Authentication

JWT token-based authentication with automatic token refresh:

- **Login**: `/login` - Designer or artisan login
- **Register**: `/register` - Create new account (choose role)
- **Auto-redirect**: Unauthenticated users redirected to login
- **Token Storage**: Secure localStorage with auto-refresh

### User Roles
- `designer`: Projects, tasks, moodboards, marketplace access
- `artisan`: Profile, portfolio, reviews, marketplace visibility

## 📡 API Endpoints

All endpoints integrated via `lib/api.ts`:

- Auth, Projects, Tasks, Moodboards, Moodboard Items
- Service Categories, Artisans, Portfolio, Reviews

## 🎨 Design

- **Theme**: Purple (#8B5CF6) to Blue gradient
- **Components**: Headless UI (modals, dropdowns)
- **Responsive**: Mobile-first design
- **Icons**: Heroicons outline/solid

## 📁 Key Pages

- `/` - Homepage (marketing)
- `/login` - Login page
- `/register` - Registration
- `/dashboard` - Dashboard home
- `/dashboard/projects` - Project management
- `/dashboard/tasks` - Task kanban
- `/dashboard/moodboards` - Moodboards
- `/dashboard/marketplace` - Browse artisans
- `/dashboard/portfolio` - Artisan portfolio (artisans only)
- `/dashboard/profile` - Artisan profile (artisans only)
- `/dashboard/reviews` - Reviews (artisans only)

## 🚀 Production Build

```bash
npm run build
npm start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
