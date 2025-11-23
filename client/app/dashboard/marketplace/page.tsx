'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { ArtisanProfileList, ServiceCategory } from '@/lib/types';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  MapPinIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { getExperienceLabel } from '@/lib/utils';

export default function MarketplacePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [artisans, setArtisans] = useState<ArtisanProfileList[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number | ''>('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCategories();
  }, [user, router]);

  useEffect(() => {
    fetchArtisans();
  }, [selectedCategory, minRating]);

  const fetchCategories = async () => {
    try {
      const data = await api.serviceCategories.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArtisans = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory) params.service_category = selectedCategory;
      if (minRating) params.min_rating = minRating;

      const data = await api.artisans.getAll(params);
      setArtisans(data);
    } catch (error) {
      console.error('Failed to fetch artisans:', error);
    } finally {
      setLoading(false);
    }
  };
  const filteredArtisans = artisans.filter((artisan) =>
    artisan.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artisan.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artisan.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artisan.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRatingStars = (rating: string | number) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= Math.round(numRating) ? (
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-300" />
            )}
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({numRating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading && artisans.length === 0) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artisan Marketplace</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover and connect with skilled professionals for your projects
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                />
              </div>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredArtisans.length} artisan{filteredArtisans.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Artisans Grid */}
        {filteredArtisans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No artisans found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map((artisan) => (
              <Link
                key={artisan.id}
                href={`/dashboard/marketplace/${artisan.id}`}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                  <BriefcaseIcon className="h-16 w-16 text-zinc-200" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {artisan.business_name}
                  </h3>
                    <div className="mb-2">
                    {renderRatingStars(artisan.average_rating)}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <BriefcaseIcon className="h-4 w-4 mr-1" />
                    {artisan.services.length > 0 ? artisan.services[0].name : 'Service Provider'}
                  </div>

                  {(artisan.city || artisan.state) && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {[artisan.city, artisan.state].filter(Boolean).join(', ')}
                    </div>
                  )}

                  {artisan.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {artisan.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{artisan.total_reviews} review{artisan.total_reviews !== 1 ? 's' : ''}</span>
                    <span className="text-zinc-700 font-medium">View Profile →</span>
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
