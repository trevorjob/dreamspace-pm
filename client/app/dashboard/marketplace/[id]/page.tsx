'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { ArtisanProfile, PortfolioItem, Review } from '@/lib/types';
import {
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDate, getExperienceLabel, getRatingStars } from '@/lib/utils';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Comment is required'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ArtisanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const artisanId = parseInt(params.id as string);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const currentRating = watch('rating', 5);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router, artisanId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artisanData, portfolioData, reviewsData] = await Promise.all([
        api.artisans.getById(artisanId),
        api.portfolio.getAll(artisanId),
        api.reviews.getAll(artisanId),
      ]);
      setArtisan(artisanData);
      setPortfolio(portfolioData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to fetch artisan data:', error);
      router.push('/dashboard/marketplace');
    } finally {
      setLoading(false);
    }
  };
  const onSubmitReview = async (data: ReviewFormData) => {
    try {
      await api.reviews.create({
        ...data,
        artisan: artisanId,
      });
      await fetchData();
      closeReviewModal();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const openReviewModal = () => {
    reset({ rating: 5 });
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    reset();
  };
  const renderStars = (rating: string | number, interactive = false, onChange?: (rating: number) => void) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            {star <= numRating ? (
              <StarIconSolid className={`h-5 w-5 ${interactive ? 'text-yellow-400 hover:text-yellow-500' : 'text-yellow-400'}`} />
            ) : (
              <StarIcon className={`h-5 w-5 ${interactive ? 'text-gray-300 hover:text-gray-400' : 'text-gray-300'}`} />
            )}
          </button>
        ))}
      </div>
    );
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

  if (!artisan) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/marketplace"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {artisan.business_name}
            </h1>            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                {renderStars(artisan.average_rating)}
                <span className="ml-2">({artisan.total_reviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                {artisan.services.length > 0 ? artisan.services[0].name : 'Service Provider'}
              </div>
              <div className="flex items-center">
                {artisan.years_of_experience} years experience
              </div>
            </div>
          </div>
          {user?.role === 'designer' && (
            <button
              onClick={openReviewModal}
              className="px-4 py-2 bg-zinc-50 text-white rounded-lg hover:bg-zinc-200 font-medium"
            >
              Write Review
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">            {/* About */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              {artisan.description ? (
                <p className="text-gray-700 whitespace-pre-line">{artisan.description}</p>
              ) : (
                <p className="text-gray-500 italic">No description provided</p>
              )}
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
              {portfolio.length === 0 ? (
                <p className="text-gray-500 italic">No portfolio items yet</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">                  {portfolio.map((item) => (
                    <div key={item.id} className="group relative">                      <img
                        src={item.image || ''}
                        alt={item.title}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-end p-3">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {review.reviewer_name}
                            </span>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {artisan.email && (
                  <div className="flex items-center text-sm">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={`mailto:${artisan.email}`}
                      className="text-zinc-700 hover:text-zinc-800"
                    >
                      {artisan.email}
                    </a>
                  </div>
                )}
                {artisan.phone && (
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={`tel:${artisan.phone}`}
                      className="text-zinc-700 hover:text-zinc-800"
                    >
                      {artisan.phone}
                    </a>
                  </div>
                )}
                {(artisan.city || artisan.state) && (
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      {[artisan.city, artisan.state, artisan.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                {artisan.website && (
                  <div className="flex items-center text-sm">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={artisan.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-700 hover:text-zinc-800"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-medium text-gray-900">
                    {(typeof artisan.average_rating === 'string' 
                      ? parseFloat(artisan.average_rating) 
                      : Number(artisan.average_rating)).toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-medium text-gray-900">
                    {artisan.total_reviews}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Portfolio Items</span>
                  <span className="font-medium text-gray-900">
                    {portfolio.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">
                    {artisan.years_of_experience} years
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Transition appear show={isReviewModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeReviewModal}>
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
                    Write a Review for {artisan.business_name}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                      </label>
                      <input type="hidden" {...register('rating', { valueAsNumber: true })} />
                      {renderStars(
                        currentRating,
                        true,
                        (rating) => {
                          setValue('rating', rating);
                        }
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comment *
                      </label>
                      <textarea
                        {...register('comment')}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                        placeholder="Share your experience working with this artisan..."
                      />
                      {errors.comment && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.comment.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-zinc-50 text-white rounded-lg hover:bg-zinc-200 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={closeReviewModal}
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
