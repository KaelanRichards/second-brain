import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { type InvokeArgs, invoke } from '@tauri-apps/api/core';

// Custom hook for Tauri queries
export function useTauriQuery<T>(
  command: string,
  args?: InvokeArgs,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey: ['tauri', command, args],
    queryFn: () => invoke<T>(command, args),
    ...options,
  });
}

// Custom hook for Tauri mutations
export function useTauriMutation<TData = unknown, TVariables = void>(
  command: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables) => invoke<TData>(command, variables as Record<string, unknown>),
    ...options,
  });
}
