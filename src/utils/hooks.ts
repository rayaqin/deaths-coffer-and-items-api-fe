import { useQuery, UseQueryResult } from "react-query";
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

async function fetchItemsData(requestBody: DeathsCofferRequestBody | null) {
  const response = await fetch(
    `${import.meta.env.VITE_DEATHS_COFFER_API_URL}calculate/deathsCoffer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody==null ? "{}" : JSON.stringify(requestBody),
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export const useCalculateDeathsCofferQuery = (initialRequestBody: DeathsCofferRequestBody | null): {
  data: Offering[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: (requestBody?: DeathsCofferRequestBody | null) => void;
} => {
  const [requestBody, setRequestBody] = useState<DeathsCofferRequestBody | null>(initialRequestBody);

  const { data, isLoading, error, refetch: refetchQuery } = useQuery<any, Error>(
    ["fetchItemsData", requestBody],
    () => fetchItemsData(requestBody),
    {
      enabled: !!requestBody,
    }
  );

  const refetch = (newRequestBody?: DeathsCofferRequestBody | null) => {
    setRequestBody(newRequestBody ?? null);
    refetchQuery();
  };

  return { data: data?.bestOfferings, isLoading, error, refetch };
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
