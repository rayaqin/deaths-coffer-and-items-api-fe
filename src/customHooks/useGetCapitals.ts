import { useEffect, useState } from 'react';
import { CapitalCity, CapitalData } from '../utils/types';

const capitalApiUrl: string = import.meta.env.VITE_CAPITAL_API_URL;

const useGetCapitals = () => {
  const [capitals, setCapitals] = useState<CapitalCity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCapitals = async () => {
      try {
        const response = await fetch(capitalApiUrl);
        const capitalsResponse = await response.json();
        setCapitals(
          capitalsResponse.data
            .map(
              (capitalData: CapitalData) =>
                ({
                  name: capitalData.capital.trim(),
                } as CapitalCity)
            )
            .filter((capital: CapitalCity) => capital.name !== '')
        );
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchCapitals();
  }, []);

  return { capitals, error, loading };
};

export default useGetCapitals;
