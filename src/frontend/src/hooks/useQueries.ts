import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Thread } from "../backend.d";
import { useSearchStore } from "../store/searchStore";
import { generateMockAnswer } from "../utils/mockData";
import { useActor } from "./useActor";

export function useGetMyThreads() {
  const { actor, isFetching } = useActor();
  return useQuery<Thread[]>({
    queryKey: ["threads"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMyThreads();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetThread(threadId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Thread | null>({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      if (!actor || !threadId) return null;
      try {
        return await actor.getThread(threadId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!threadId,
    staleTime: 10_000,
  });
}

export function useCreateThread() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("No actor");
      return actor.createThread(title);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });
}

export function useDeleteThread() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteThread(threadId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });
}

export function useSearch() {
  const { setIsLoading, setCurrentResults, setIsDemoMode } = useSearchStore();
  const { actor } = useActor();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      threadId,
      query,
      model,
      focusMode,
    }: {
      threadId: string;
      query: string;
      model: string;
      focusMode: string;
    }) => {
      setIsLoading(true);
      setIsDemoMode(false);
      try {
        if (!actor) throw new Error("No actor available");
        const result = await actor.search(threadId, query, model, focusMode);
        setIsDemoMode(false);
        return result;
      } catch {
        setIsDemoMode(true);
        await new Promise((r) => setTimeout(r, 1200));
        return generateMockAnswer(query);
      }
    },
    onSuccess: (result) => {
      setCurrentResults(result);
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
}
