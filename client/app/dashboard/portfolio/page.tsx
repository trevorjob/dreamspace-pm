'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { PortfolioItem } from '@/lib/types';
import {
  PlusIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

export default function PortfolioPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [artisanProfileId, setArtisanProfileId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'artisan') {
      router.push('/dashboard');
      return;
    }
    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profile = await api.artisans.getMyProfile();
      setArtisanProfileId(profile.id);
      await fetchPortfolio(profile.id);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // If no profile exists, redirect to profile creation
      router.push('/dashboard/profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolio = async (profileId: number) => {
    try {
      const data = await api.portfolio.getAll(profileId);
      setPortfolio(data);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const onSubmit = async (data: PortfolioFormData) => {
    if (!selectedFile || !artisanProfileId) return;

    setUploading(true);
    try {      const formData = new FormData();
      formData.append('artisan', String(artisanProfileId));
      formData.append('image', selectedFile);
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      
      await api.portfolio.create(formData);
      await fetchPortfolio(artisanProfileId);
      closeModal();
    } catch (error) {
      console.error('Failed to upload portfolio item:', error);
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?') || !artisanProfileId) return;
    try {
      await api.portfolio.delete(itemId);
      await fetchPortfolio(artisanProfileId);
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
    }
  };

  const openUploadModal = () => {
    reset();
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const closeModal = () => {
    setIsUploadModalOpen(false);
    reset();
    setSelectedFile(null);
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
            <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
            <p className="mt-1 text-sm text-gray-500">
              Showcase your best work to attract clients
            </p>
          </div>
          <button
            onClick={openUploadModal}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>

        {/* Portfolio Grid */}
        {portfolio.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No portfolio items yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start showcasing your work by adding your first portfolio item
            </p>
            <div className="mt-6">
              <button
                onClick={openUploadModal}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add First Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >                <div className="aspect-square relative">                  <img
                    src={item.image || ''}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Transition appear show={isUploadModalOpen} as={Fragment}>
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
                    Add Portfolio Item
                  </Dialog.Title>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                      />
                      {selectedFile && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <PhotoIcon className="h-4 w-4 mr-1" />
                          {selectedFile.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        {...register('title')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                        placeholder="e.g., Modern Kitchen Renovation"
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
                        placeholder="Describe this project..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={!selectedFile || uploading}
                        className="flex-1 px-4 py-2 bg-zinc-50 text-white rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Uploading...' : 'Add to Portfolio'}
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
