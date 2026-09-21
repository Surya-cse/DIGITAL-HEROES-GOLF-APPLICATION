import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { PerformanceScore } from '../types';

/**
 * usePerformanceTracker Hook
 * Manages the "Top 5" performance scores logic as per PRD.
 */
export const usePerformanceTracker = () => {
  const [scores, setScores] = useState<PerformanceScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 1. Fetch Performance History
   * Retrieves the top 5 scores from the backend.
   * Backend logic ensures only 5 are returned and they are sorted by date desc.
   */
  const fetchScores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Endpoint matches our CorePlatform.ts route: /api/performance
      const response = await axiosInstance.get('/performance');
      setScores(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load performance metrics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 2. Record New Performance
   * Validates input (1-45) and sends data to backend.
   * Re-fetches history immediately to handle the "Automatic 6th Score Deletion" rule.
   */
  const recordScore = async (value: number, date: string) => {
    // Client-side validation for instant feedback (PRD requirement: Score 1-45)
    if (value < 1 || value > 45) {
      throw new Error('Performance scores must be within the 1 to 45 range.');
    }

    if (!date) {
      throw new Error('A valid performance date is required.');
    }

    try {
      const response = await axiosInstance.post('/performance', { value, date });
      
      /** 
       * PRD RULE: "When a 6th score is added, automatically remove the oldest score"
       * We re-fetch here so the UI instantly updates to show the correct 5 scores.
       */
      await fetchScores();
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to sync performance entry.';
      throw new Error(msg);
    }
  };

  /**
   * 3. Remove Performance Entry
   * Allows user to delete an entry as specified in PRD.
   */
  const removeScore = async (id: string) => {
    try {
      await axiosInstance.delete(`/performance/${id}`);
      // Optimistic UI update: remove it from local state immediately
      setScores(prev => prev.filter(score => score.id !== id));
    } catch (err: any) {
      throw new Error('Removal failed. Please try again.');
    }
  };

  // Initial Sync on Component Mount
  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return {
    scores,
    isLoading,
    error,
    recordScore,
    removeScore,
    refresh: fetchScores
  };
};