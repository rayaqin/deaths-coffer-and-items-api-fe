import { useQuery, UseQueryResult } from "react-query";
import itemsDummyResponse from './itemsDummyResponse.json';
import { ItemsResponse } from "./types";

export const useItemsQuery = (url: string): UseQueryResult<unknown, Error> => {
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

export const useItemsDummyQuery = (url: string): UseQueryResult<ItemsResponse, Error> => {
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