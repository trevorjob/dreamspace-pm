'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Moodboard, Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  PlusIcon,
  PhotoIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const moodboardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  project: z.number().min(1, 'Project is required'),
});

type MoodboardFormData = z.infer<typeof moodboardSchema>;

export default function MoodboardsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MoodboardFormData>({
    resolver: zodResolver(moodboardSchema),
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [moodboardsData, projectsData] = await Promise.all([
        api.moodboards.getAll(),
        api.projects.getAll(),
      ]);
      setMoodboards(moodboardsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MoodboardFormData) => {
    try {
      const newMoodboard = await api.moodboards.create(data);
      await fetchData();
      closeModal();
      // Navigate to the newly created moodboard
      router.push(`/dashboard/moodboards/${newMoodboard.id}`);
    } catch (error) {
      console.error('Failed to create moodboard:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this moodboard?')) return;
    try {
      await api.moodboards.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete moodboard:', error);
    }
  };

  const openCreateModal = () => {
    reset();
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    reset();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-300"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Moodboards</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create visual inspiration boards for your projects
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Moodboard
          </button>
        </div>

        {/* Moodboards Grid */}
        {moodboards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No moodboards yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new moodboard
            </p>
            <div className="mt-6">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Moodboard
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moodboards.map((moodboard) => {
              const project = projects.find((p) => p.id === moodboard.project);
              return (
                <div
                  key={moodboard.id}
                  className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                    <PhotoIcon className="h-16 w-16 text-zinc-200" />
                  </div>                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {moodboard.title}
                    </h3>
                    {moodboard.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {moodboard.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{project?.name || 'Unknown Project'}</span>
                      <span>{formatDate(moodboard.created_at)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/moodboards/${moodboard.id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-400 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(moodboard.id)}
                        className="px-3 py-2 border border-red-600 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Moodboard Modal */}
      <Transition appear show={isCreateModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Create New Moodboard
                  </Dialog.Title>                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        {...register('title')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                        placeholder="e.g., Living Room Inspiration"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                        placeholder="Describe your vision..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project *
                      </label>
                      <select
                        {...register('project', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                      >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                      {errors.project && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.project.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-zinc-50 text-white rounded-lg hover:bg-zinc-200 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Creating...' : 'Create Moodboard'}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DashboardLayout>
  );
}
