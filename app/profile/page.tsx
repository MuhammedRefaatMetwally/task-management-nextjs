'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/lib/hooks';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getInitials } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        }
      : undefined,
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
      },
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File must be an image');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    uploadAvatar(file, {
      onSuccess: (data) => {
        if (profile) {
          const updatedUser = { ...profile, avatar: data.url };
          setUser(updatedUser);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 m-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatarPreview || profile?.avatar} />
                <AvatarFallback className="text-2xl">
                  {profile ? getInitials(profile.firstName, profile.lastName) : 'U'}
                </AvatarFallback>
              </Avatar>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>

            <div className="w-full">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploading}
              >
                <Camera className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Change Avatar'}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              JPG, PNG or WEBP. Max size 5MB.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isUpdating} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isUpdating} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" disabled />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Account ID</span>
            <span className="font-mono">{profile?.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Role</span>
            <span className="capitalize">{profile?.role.toLowerCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member Since</span>
            <span>
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '-'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}