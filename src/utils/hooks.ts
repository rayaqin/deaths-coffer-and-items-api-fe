import { useMutation, useQuery, UseQueryResult } from "react-query";
import itemsDummyResponse from './itemsDummyResponse.json';
import calculatedItemsDummyResponse from './calculatedItemsDummyResponse.json';
import { ItemsResponse, DeathsCofferRequestBody, CalculateDeathsCofferQueryResponse, Offering } from "./types";
import { useState } from "react";

export const useItemsQuery = (url: string): UseQueryResult<ItemsResponse, Error> => {
  return useQuery("posts", async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("An error occurred while fetching the data:", error);
      throw error;
    }
  });
}

export const useItemsQueryDummy = (url: string): UseQueryResult<ItemsResponse, Error> => {
  return useQuery(url, async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return itemsDummyResponse;
    } catch (error) {
      console.error("An error occurred while fetching the data:", error);
      throw error;
    }
  });
}

export const checkIfRequestBodyIsAllZeros = (requestBody: DeathsCofferRequestBody): boolean => {
  return Object.values(requestBody).every(value => value === 0);
}

export const useCalculateDeathsCofferQuery = () => {
  const [data, setData] = useState<CalculateDeathsCofferQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { mutate } = useMutation(
    (payload: DeathsCofferRequestBody) => {
      return fetch(`${import.meta.env.VITE_DEATHS_COFFER_API_URL}calculate/deathsCoffer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json());
    },
    {
      onSuccess: (data: CalculateDeathsCofferQueryResponse) => {
        setData(data);
        setIsLoading(false);
      },
      onError: (error) => {
        setError(new Error('Failed to fetch data'));
        setIsLoading(false);
      },
    }
  );

  const refetch = (payload: DeathsCofferRequestBody) => {
    setIsLoading(true);
    mutate(payload);
  };

  console.log("hook returning: ", data)

  return { data: data, isLoading, error, refetch };
};



export const useCalculateDeathsCofferQueryDummy = () => {
  const [data, setData] = useState<CalculateDeathsCofferQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setData(calculatedItemsDummyResponse);
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      setError(new Error('Failed to fetch data'));
      setIsLoading(false);
    }
  };

  return { data: data?.bestOfferings, isLoading, error, refetch };
};
