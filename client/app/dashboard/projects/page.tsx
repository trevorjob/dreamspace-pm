'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);
  const fetchProjects = async () => {
    try {
      const response = await api.projects.getAll();
      setProjects(response);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all your interior design projects
            </p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-200"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Project
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new project.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-4000"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 hover:border-zinc-400"
              >                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FolderIcon className="h-8 w-8 text-zinc-700" />
                    <span className="text-xs font-medium text-gray-500">
                      {project.tasks_count || 0} tasks
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-zinc-700 transition">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {project.description}
                    </p>                  )}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>Created {formatDate(project.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
