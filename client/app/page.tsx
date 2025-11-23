import Link from 'next/link';
import { 
  RocketLaunchIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  SparklesIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-zinc-50" />
              <span className="text-2xl font-bold text-zinc-50">
                DreamSpace PM
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-zinc-300 hover:text-zinc-50 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-zinc-50 text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-50 mb-6">
            The Complete Platform for
            <span className="block mt-2 text-zinc-50">
              Interior Designers & Artisans
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-10">
            Manage projects, discover skilled artisans, and bring beautiful spaces to life. 
            All in one powerful platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register?role=designer"
              className="bg-zinc-50 text-zinc-900 px-8 py-4 rounded-lg hover:bg-zinc-200 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              I'm a Designer
            </Link>
            <Link
              href="/register?role=artisan"
              className="bg-zinc-900 text-zinc-50 border-2 border-zinc-700 px-8 py-4 rounded-lg hover:bg-zinc-800 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              I'm an Artisan
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-zinc-400">
            Powerful tools for designers. Opportunities for artisans.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-zinc-800">
            <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <RocketLaunchIcon className="h-6 w-6 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Project Management
            </h3>
            <p className="text-zinc-400">
              Track projects from initiation to completion. Manage tasks, timelines, and budgets effortlessly.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-zinc-800">
            <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <UsersIcon className="h-6 w-6 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Artisan Marketplace
            </h3>
            <p className="text-zinc-400">
              Discover and connect with verified artisans. Browse portfolios, read reviews, and hire with confidence.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-zinc-800">
            <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BriefcaseIcon className="h-6 w-6 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Visual Moodboards
            </h3>
            <p className="text-zinc-400">
              Create beautiful moodboards to document your design vision and share with clients.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-zinc-800">
            <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Progress Tracking
            </h3>
            <p className="text-zinc-400">
              Monitor project progress in real-time. Keep clients informed and teams aligned.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-zinc-800">
            <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Rating & Reviews
            </h3>
            <p className="text-zinc-400">
              Build trust with verified reviews. Rate artisans and help others make informed decisions.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-zinc-800">
            <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <SparklesIcon className="h-6 w-6 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Portfolio Showcase
            </h3>
            <p className="text-zinc-400">
              Artisans can showcase their best work and attract more clients with stunning portfolios.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-zinc-900 border-y border-zinc-800 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join designers and artisans who are building beautiful spaces together.
          </p>
          <Link
            href="/register"
            className="bg-zinc-50 text-zinc-900 px-8 py-4 rounded-lg hover:bg-zinc-200 transition-colors font-semibold text-lg inline-block shadow-lg hover:shadow-xl"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <SparklesIcon className="h-6 w-6 text-zinc-400" />
              <span className="text-zinc-50 font-bold text-lg">DreamSpace PM</span>
            </div>
            <p className="text-sm">
              © 2025 DreamSpace PM. Built for interior designers and artisans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
