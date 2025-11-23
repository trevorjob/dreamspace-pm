'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Moodboard, MoodboardItem } from '@/lib/types';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function MoodboardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const [moodboard, setMoodboard] = useState<Moodboard | null>(null);
  const [items, setItems] = useState<MoodboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [draggingItem, setDraggingItem] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const moodboardId = parseInt(params.id as string);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router, moodboardId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [moodboardData, itemsData] = await Promise.all([
        api.moodboards.getById(moodboardId),
        api.moodboardItems.getAll(moodboardId),
      ]);
      console.log('Moodboard Items:', itemsData);
      console.log('First item image URL:', itemsData[0]?.image);
      setMoodboard(moodboardData);
      setItems(itemsData);
    } catch (error) {
      console.error('Failed to fetch moodboard:', error);
      router.push('/dashboard/moodboards');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('moodboard', String(moodboardId));
      formData.append('image', selectedFile);
      formData.append('title', uploadNotes || 'Untitled');
      formData.append('description', '');
      formData.append('x', '100');
      formData.append('y', '100');
      
      await api.moodboardItems.create(formData);
      await fetchData();
      closeUploadModal();
    } catch (error) {
      console.error('Failed to upload item:', error);
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (itemId: number) => {
    if (!confirm('Remove this item from the moodboard?')) return;
    try {
      await api.moodboardItems.delete(itemId);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleDragStart = (itemId: number) => {
    setDraggingItem(itemId);
  };

  const handleDrag = async (itemId: number, e: React.DragEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
    try {
      await api.moodboardItems.update(itemId, {
        x: x,
        y: y,
      });
      // Update local state for immediate feedback
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? { ...item, x: x, y: y }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const openUploadModal = () => {
    setSelectedFile(null);
    setUploadNotes('');
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setUploadNotes('');
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

  if (!moodboard) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/moodboards"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {moodboard.title}
            </h1>
            {moodboard.description && (
              <p className="mt-1 text-sm text-gray-500">
                {moodboard.description}
              </p>
            )}
          </div>
          </div>
          <button
            onClick={openUploadModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
          style={{ minHeight: '600px', height: '70vh' }}
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <PhotoIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your moodboard is empty
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Start adding images to visualize your design ideas
              </p>
              <button
                onClick={openUploadModal}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add First Item
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDrag={(e) => handleDrag(item.id, e)}                onDragEnd={handleDragEnd}
                className="absolute group cursor-move"
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                }}
              >                <div className="relative">
                  <img
                    src={item.image || ''}
                    alt="Moodboard item"
                    className="w-48 h-48 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                    draggable={false}
                    onError={(e) => {
                      console.error('Failed to load image:', item.image);
                      e.currentTarget.style.border = '2px solid red';
                    }}
                  />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Drag and drop items to arrange them on your moodboard.
            Click the trash icon to remove an item.
          </p>
        </div>
      </div>

      {/* Upload Item Modal */}
      <Transition appear show={isUploadModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeUploadModal}>
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
                    Add Item to Moodboard
                  </Dialog.Title>

                  <div className="space-y-4">
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
                        Notes (optional)
                      </label>
                      <textarea
                        value={uploadNotes}
                        onChange={(e) => setUploadNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                        placeholder="Add notes about this image..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="flex-1 px-4 py-2 bg-zinc-50 text-white rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Uploading...' : 'Add to Moodboard'}
                      </button>
                      <button
                        onClick={closeUploadModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DashboardLayout>
  );
}
