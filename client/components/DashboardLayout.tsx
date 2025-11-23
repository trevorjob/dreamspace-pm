'use client';

import { Fragment, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  FolderIcon,
  CheckCircleIcon,
  PhotoIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/lib/store';
import { clsx } from 'clsx';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderIcon },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckCircleIcon },
  { name: 'Moodboards', href: '/dashboard/moodboards', icon: PhotoIcon },
  { name: 'Marketplace', href: '/dashboard/marketplace', icon: ShoppingBagIcon },
];

const artisanNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: PhotoIcon },
  { name: 'Reviews', href: '/dashboard/reviews', icon: UserGroupIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  const nav = user.role === 'artisan' ? artisanNavigation : navigation;
  return (
    <div className="min-h-screen bg-zinc-950">
      <Disclosure as="nav" className="bg-zinc-900 border-b border-zinc-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/dashboard">
                      <span className="text-2xl font-bold text-zinc-50">
                        DreamSpace PM
                      </span>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {nav.map((item) => {
                      const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            isActive
                              ? 'border-zinc-50 text-zinc-50'
                              : 'border-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200',
                            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors'
                          )}
                        >
                          <item.icon className="mr-2 h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-50 font-semibold">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                      </Menu.Button>
                    </div>                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-800 py-1 shadow-lg ring-1 ring-zinc-700 focus:outline-none">
                        <div className="px-4 py-2 text-sm text-zinc-200 border-b border-zinc-700">
                          <p className="font-semibold">{user.first_name} {user.last_name}</p>
                          <p className="text-zinc-400 truncate">{user.email}</p>
                          <p className="text-xs text-zinc-300 mt-1 capitalize">{user.role}</p>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/dashboard/settings"
                              className={clsx(
                                active ? 'bg-zinc-700' : '',
                                'block px-4 py-2 text-sm text-zinc-200 transition-colors'
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={clsx(
                                active ? 'bg-zinc-700' : '',
                                'block w-full text-left px-4 py-2 text-sm text-zinc-200 transition-colors'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden bg-zinc-900 border-b border-zinc-800">              <div className="space-y-1 pb-3 pt-2">
                {nav.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={clsx(
                        isActive
                          ? 'border-zinc-50 bg-zinc-800 text-zinc-50'
                          : 'border-transparent text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200',
                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </div>
                    </Disclosure.Button>
                  );
                })}
              </div>
              <div className="border-t border-zinc-800 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-50 font-semibold">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-zinc-200">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm font-medium text-zinc-400">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    Settings
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
