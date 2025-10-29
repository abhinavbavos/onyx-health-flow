import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockProfiles = [
  {
    _id: '1',
    userId: 'user1',
    name: 'John Doe',
    dob: '1990-01-01',
    height: 175,
    weight: 70,
    blood_group: 'A+',
    phone_number: ['+1', '1234567890'],
    email: 'john@example.com',
    bmi: 22.86,
    status: 'active',
    age: 34,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: '2',
    userId: 'user2',
    name: 'Jane Smith',
    dob: '1985-05-15',
    height: 165,
    weight: 60,
    blood_group: 'B+',
    phone_number: ['+1', '9876543210'],
    email: 'jane@example.com',
    bmi: 22.04,
    status: 'active',
    age: 39,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // Mock API call - return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return { profiles: mockProfiles };
    },
  });
}

export function useProfile(id: string) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      // Mock API call - return mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      const profile = mockProfiles.find(p => p._id === id);
      if (!profile) throw new Error('Profile not found');
      return { profile };
    },
    enabled: !!id,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { profile: { ...data, _id: Date.now().toString() } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: 'Success',
        description: 'Profile created successfully (mock)',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create profile',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { profile: { ...data, _id: id } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: 'Success',
        description: 'Profile updated successfully (mock)',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Profile deleted successfully' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: 'Success',
        description: 'Profile deleted successfully (mock)',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete profile',
        variant: 'destructive',
      });
    },
  });
}
