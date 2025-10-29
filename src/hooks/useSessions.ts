import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockSessions = [
  {
    _id: '1',
    userId: 'user1',
    profileId: '1',
    deviceId: 'device1',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T10:30:00Z',
    status: 'completed',
    measurements: {
      heartRate: 75,
      bloodPressure: '120/80',
      temperature: 36.6,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    userId: 'user1',
    profileId: '1',
    deviceId: 'device2',
    startTime: '2024-01-16T14:00:00Z',
    endTime: null,
    status: 'active',
    measurements: {},
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z',
  },
];

type SessionStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';

export function useSessions(status?: SessionStatus) {
  return useQuery({
    queryKey: ['sessions', status],
    queryFn: async () => {
      // Mock API call - return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return { sessions: mockSessions };
    },
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: async () => {
      // Mock API call - return mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      const session = mockSessions.find(s => s._id === id);
      if (!session) throw new Error('Session not found');
      return { session };
    },
    enabled: !!id,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { session: { ...data, _id: Date.now().toString() } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: 'Session created successfully (mock)',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create session',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { session: { ...data, _id: id } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: 'Session updated successfully (mock)',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update session',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Session deleted successfully' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Success',
        description: 'Session deleted successfully (mock)',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete session',
        variant: 'destructive',
      });
    },
  });
}
