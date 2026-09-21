import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { ImpactDraw, DrawEntry } from '../types';

export const useImpactDraws = () => {
  const [activeDraw, setActiveDraw] = useState<ImpactDraw | null>(null);
  const [userEntries, setUserEntries] = useState<DrawEntry[]>([]);
  const [drawHistory, setDrawHistory] = useState<ImpactDraw[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 1. Fetch Active Draw Details
   * Fetches the upcoming draw, its date, and the dynamic prize pool.
   */
  const fetchActiveDraw = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/impact-draws/active');
      setActiveDraw(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync with active draw.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 2. Fetch User Participation
   * Checks if the logged-in user has already entered the current or past draws.
   */
  const fetchUserEntries = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/impact-draws/my-entries');
      setUserEntries(response.data);
    } catch (err) {
      console.error('Entry sync failed');
    }
  }, []);

  /**
   * 3. Fetch Historical Data
   * Retrieves past winning numbers and published results for the "History" UI.
   */
  const fetchHistory = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/impact-draws/history');
      setDrawHistory(response.data);
    } catch (err) {
      console.error('History sync failed');
    }
  }, []);

  /**
   * 4. Enter Current Draw
   * Submits the user's 5-number selection. 
   * PRD Check: Validates that exactly 5 numbers are chosen.
   */
  const enterDraw = async (drawId: string, numbers: number[]) => {
    if (numbers.length !== 5) {
      throw new Error('You must select exactly 5 numbers to participate.');
    }

    // Ensure numbers are within the 1-45 range as per PRD logic
    const isValidRange = numbers.every(n => n >= 1 && n <= 45);
    if (!isValidRange) {
      throw new Error('Draw numbers must be between 1 and 45.');
    }

    try {
      const response = await axiosInstance.post('/impact-draws/enter', { drawId, numbers });
      // Refresh entries local state after successful submission
      await fetchUserEntries();
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Entry rejected. Please check subscription status.';
      throw new Error(msg);
    }
  };

  // Initial Platform Sync
  useEffect(() => {
    fetchActiveDraw();
    fetchUserEntries();
    fetchHistory();
  }, [fetchActiveDraw, fetchUserEntries, fetchHistory]);

  return {
    activeDraw,
    userEntries,
    drawHistory,
    isLoading,
    error,
    enterDraw,
    refresh: () => {
      fetchActiveDraw();
      fetchUserEntries();
      fetchHistory();
    }
  };
};