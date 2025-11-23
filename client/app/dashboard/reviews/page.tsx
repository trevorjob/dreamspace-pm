'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Review, ArtisanProfile } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  StarIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function ReviewsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'artisan') {
      router.push('/dashboard');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileData = await api.artisans.getMyProfile();
      setProfile(profileData);
      const reviewsData = await api.reviews.getAll(profileData.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      // If no profile exists, redirect to profile creation
      router.push('/dashboard/profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const ratingDistribution = reviews.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">My Reviews</h1>
          <p className="mt-1 text-sm text-zinc-400">
            See what clients are saying about your work
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">          <div className="bg-zinc-900 rounded-lg shadow border border-zinc-800 p-6">            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Average Rating</p>
                <p className="text-3xl font-bold text-zinc-50 mt-2">
                  {parseFloat(String(profile?.average_rating ?? 0)).toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-zinc-800 rounded-full">
                <StarIconSolid className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4">
              {renderStars(Math.round(parseFloat(String(profile?.average_rating || 0))))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg shadow border border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Total Reviews</p>
                <p className="text-3xl font-bold text-zinc-50 mt-2">
                  {profile?.total_reviews || 0}
                </p>
              </div>
              <div className="p-3 bg-zinc-800 rounded-full">
                <ChatBubbleLeftIcon className="h-8 w-8 text-zinc-400" />
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              From satisfied clients
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg shadow border border-zinc-800 p-6">
            <p className="text-sm font-medium text-zinc-400 mb-4">Rating Breakdown</p>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400 w-8">{rating}★</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? ((ratingDistribution[rating] || 0) / reviews.length) * 100 : 0}%`,
                      }}
                    />                  </div>
                  <span className="text-sm text-zinc-400 w-8 text-right">
                    {ratingDistribution[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-zinc-900 rounded-lg shadow border border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-zinc-50 mb-6">All Reviews</h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-zinc-600" />
              <h3 className="mt-2 text-sm font-medium text-zinc-200">
                No reviews yet
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                Keep doing great work and clients will start leaving reviews
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-zinc-800 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-zinc-50">
                          {review.reviewer_name}
                        </span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-zinc-400">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
