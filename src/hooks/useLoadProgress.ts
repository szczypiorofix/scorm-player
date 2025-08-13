import { useState, useEffect } from 'react';

import { API_PROGRESS_URL } from '../shared/constants';
import type { IScormApi2004, IScormApi_1_2 } from '../shared/types';

interface UseLoadProgressProps {
  userId: string;
  courseId: string;
}

export const useLoadProgress = ({ userId, courseId }: UseLoadProgressProps) => {
  const [data, setData] = useState<Partial<IScormApi_1_2 | IScormApi2004> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !courseId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      const url = `${API_PROGRESS_URL}${userId}/${courseId}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 404) {
            console.log("No previous data detected. Starting new session");
            setData(null); 
            return;
          }
          throw new Error('Network error or server not available.');
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (err: unknown) {
        setError(err as Error);
        console.error('An error occurred while retrieving data from server: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, courseId]);

  return { data: data, isLoading, error };
};
