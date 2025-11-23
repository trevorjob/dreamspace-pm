'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { ArtisanProfile, ServiceCategory } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  description: z.string().optional(),
  service_categories: z.array(z.number()).min(1, 'At least one service category is required'),
  years_of_experience: z.number().min(0, 'Years of experience must be at least 0'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
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
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesData, profileData] = await Promise.all([
        api.serviceCategories.getAll(),
        api.artisans.getMyProfile().catch(() => null),
      ]);
      setCategories(categoriesData);
        if (profileData) {
        setProfile(profileData);
        setIsEditing(false);
        reset({
          business_name: profileData.business_name,
          description: profileData.description || '',
          service_categories: profileData.services.map(s => s.id),
          years_of_experience: profileData.years_of_experience,
          city: profileData.city || '',
          state: profileData.state || '',
          country: profileData.country || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          website: profileData.website || '',
        });
      } else {
        // No profile exists, show the form
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (profile) {
        await api.artisans.update(profile.id, data);
      } else {
        await api.artisans.create(data);
      }
      await fetchData();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
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
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile ? 'My Profile' : 'Create Your Profile'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {profile
                ? 'Manage your artisan profile information'
                : 'Set up your artisan profile to start receiving work'}
            </p>
          </div>
          {profile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-zinc-50 text-white rounded-lg hover:bg-zinc-200 font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          {!isEditing && profile ? (
            // View Mode
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Business Name</h3>
                <p className="mt-1 text-lg text-gray-900">{profile.business_name}</p>
              </div>              {profile.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">{profile.description}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Services</h3>
                  <p className="mt-1 text-gray-900">
                    {profile.services.map(s => s.name).join(', ')}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Years of Experience</h3>
                  <p className="mt-1 text-gray-900">{profile.years_of_experience} years</p>
                </div>

                {(profile.city || profile.state || profile.country) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 text-gray-900">
                      {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}

                {profile.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1 text-gray-900">{profile.phone}</p>
                  </div>
                )}

                {profile.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                  </div>
                )}

                {profile.website && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Website</h3>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-zinc-700 hover:text-zinc-800"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200">                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {parseFloat(String(profile.average_rating)).toFixed(1)} / 5.0
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {profile.total_reviews}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  {...register('business_name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                  placeholder="e.g., Smith Carpentry"
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.business_name.message}
                  </p>
                )}
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                  placeholder="Tell clients about your experience and expertise..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Categories * (Hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    {...register('service_categories', { 
                      setValueAs: (value) => Array.isArray(value) ? value.map(Number) : [Number(value)] 
                    })}
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                    size={5}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.service_categories && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.service_categories.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience *
                  </label>
                  <input
                    {...register('years_of_experience', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                  />
                  {errors.years_of_experience && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.years_of_experience.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    {...register('city')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                    placeholder="e.g., New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    {...register('state')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                    placeholder="e.g., NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    {...register('country')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                    placeholder="e.g., USA"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                    placeholder="e.g., (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                    placeholder="contact@business.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  {...register('website')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-zinc-300"
                  placeholder="https://www.yourbusiness.com"
                />                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.website.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-zinc-50 text-white rounded-lg hover:bg-zinc-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : profile ? 'Create Profile' : 'Create Profile'}
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {!profile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You need to create your artisan profile before you can manage
              your portfolio or receive reviews.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
