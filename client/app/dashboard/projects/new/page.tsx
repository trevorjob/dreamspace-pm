'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { Project } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  client_name: z.string().min(1, 'Client name is required'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });
  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    setError('');
    try {
      const projectData: Partial<Project> = {
        name: data.name,
        description: data.description,
        client_name: data.client_name,
      };
      
      if (data.start_date) {
        projectData.start_date = data.start_date;
      }
      if (data.end_date) {
        projectData.end_date = data.end_date;
      }
      
      const response = await api.projects.create(projectData);
      router.push(`/dashboard/projects/${response.id}`);
    } catch (err: any) {
      setError('Failed to create project. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-1 text-sm text-gray-500">
            Start a new interior design project
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-400 focus:bg-zinc-300 sm:text-sm px-3 py-2 border"
              placeholder="e.g., Modern Living Room Redesign"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-400 focus:bg-zinc-300 sm:text-sm px-3 py-2 border"
              placeholder="Describe your project..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>            )}
          </div>

          <div>
            <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
              Client Name *
            </label>
            <input
              {...register('client_name')}
              type="text"
              id="client_name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-400 focus:bg-zinc-300 sm:text-sm px-3 py-2 border"
              placeholder="e.g., John Doe"
            />
            {errors.client_name && (
              <p className="mt-1 text-sm text-red-600">{errors.client_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                {...register('start_date')}
                type="date"
                id="start_date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-400 focus:bg-zinc-300 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                {...register('end_date')}
                type="date"
                id="end_date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-400 focus:bg-zinc-300 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
