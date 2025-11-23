'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  role: z.enum(['designer', 'client', 'artisan']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = data;
      await register({
        ...registerData,
        password2: data.password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (typeof errorData === 'object') {
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(errorMessages);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-center text-zinc-50">
            DreamSpace PM
          </h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-50">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-zinc-300 hover:text-zinc-50"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-950 border border-red-800 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-zinc-300 mb-1">
                  First Name                </label>
                <input
                  {...registerField('first_name')}
                  id="first_name"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-zinc-700 bg-zinc-900 placeholder-zinc-500 text-zinc-50 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                  placeholder="John"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-400">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-zinc-300 mb-1">
                  Last Name
                </label>
                <input
                  {...registerField('last_name')}
                  id="last_name"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-zinc-700 bg-zinc-900 placeholder-zinc-500 text-zinc-50 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                  placeholder="Doe"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-400">{errors.last_name.message}</p>
                )}              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                Email address
              </label>
              <input
                {...registerField('email')}
                id="email"
                type="email"
                autoComplete="email"
                className="appearance-none relative block w-full px-3 py-2 border border-zinc-700 bg-zinc-900 placeholder-zinc-500 text-zinc-50 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-zinc-300 mb-1">
                I am a...
              </label>
              <select
                {...registerField('role')}
                id="role"
                className="appearance-none relative block w-full px-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-50 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
              >
                <option value="">Select your role</option>
                <option value="designer">Designer (Interior Designer)</option>
                <option value="client">Client (Looking for design services)</option>
                <option value="artisan">Artisan (Service Provider)</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
                  Password
                </label>
                <input
                  {...registerField('password')}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 border border-zinc-700 bg-zinc-900 placeholder-zinc-500 text-zinc-50 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1">
                  Confirm Password
                </label>
                <input
                  {...registerField('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 border border-zinc-700 bg-zinc-900 placeholder-zinc-500 text-zinc-50 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-zinc-900 bg-zinc-50 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
