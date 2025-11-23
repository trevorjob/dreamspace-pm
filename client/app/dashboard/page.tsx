'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Project, Task } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.projects.getAll(),
          api.tasks.getAll(),
        ]);
        setProjects(projectsRes.slice(0, 5));
        setTasks(tasksRes.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (!user) return null;  const stats = [
    {
      name: 'Total Projects',
      value: projects.length,
      icon: FolderIcon,
      color: 'bg-zinc-700',
    },
    {
      name: 'Active Tasks',
      value: tasks.filter((t) => t.status !== 'done').length,
      icon: CheckCircleIcon,
      color: 'bg-zinc-700',
    },
    {
      name: 'Completed Tasks',
      value: tasks.filter((t) => t.status === 'done').length,
      icon: ClockIcon,
      color: 'bg-zinc-700',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">
            Welcome back, {user.first_name}!
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-5 shadow sm:p-6"
            >
              <div className="flex items-center">
                <div className={`rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-zinc-300" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-zinc-400">
                      {stat.name}
                    </dt>
                    <dd className="text-3xl font-semibold tracking-tight text-zinc-50">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>        {/* Recent Projects */}
        <div className="bg-zinc-900 border border-zinc-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-medium text-zinc-50">Recent Projects</h2>
            <Link
              href="/dashboard/projects"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-50"
            >
              View all
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <p className="text-zinc-400">Loading...</p>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderIcon className="mx-auto h-12 w-12 text-zinc-600" />
                <h3 className="mt-2 text-sm font-medium text-zinc-200">No projects</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Get started by creating a new project.
                </p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center rounded-md bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200"
                  >
                    New Project
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="block hover:bg-zinc-800 transition"
                    >
                      <div className="px-4 py-4 sm:px-6">                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-200 truncate">
                              {project.name}
                            </p>
                            {project.description && (
                              <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-5 flex-shrink-0">
                            <p className="text-sm text-zinc-400">
                              Client: {project.client_name}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-zinc-400">
                              Created {formatDate(project.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>        {/* Recent Tasks */}
        <div className="bg-zinc-900 border border-zinc-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-medium text-zinc-50">Recent Tasks</h2>
            <Link
              href="/dashboard/tasks"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-50"
            >
              View all
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <p className="text-zinc-400">Loading...</p>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-zinc-600" />
                <h3 className="mt-2 text-sm font-medium text-zinc-200">No tasks</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Tasks will appear here once you create them in your projects.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {tasks.map((task) => (
                  <li key={task.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="mt-1 text-sm text-zinc-400 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>                      <div className="ml-5 flex-shrink-0">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            task.status === 'done'
                              ? 'bg-green-950 text-green-300 border border-green-800'
                              : task.status === 'in_progress'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}
                        >
                          {task.status?.replace('_', ' ') || 'todo'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
