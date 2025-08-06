import { useState, useCallback } from 'react';

import { API_PROGRESS_URL } from '../shared/constants';
import type { IScormApi2004, IScormApi_21 } from '../shared/types';

interface UseSaveProgressProps {
  userId: string;
  courseId: string;
}

export const useSaveProgress = ({ userId, courseId }: UseSaveProgressProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<IScormApi_21 | IScormApi2004 | null>(null);

  const saveProgress = useCallback(async (scormData: unknown) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const url = `${API_PROGRESS_URL}${userId}/${courseId}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scormData),
      });

      if (!response.ok) {
        throw new Error('An error occurred while saving date on backend server.');
      }

      const responseData = await response.json();
      setData(responseData);
      console.log('Data saved successfully: ', responseData);
    } catch (err: unknown) {
      setError(err as Error);
      console.error('An error occurred while sending data: ', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, courseId]);

  return { saveProgress, isLoading, error, data };
};
