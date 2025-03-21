
import { useQuery } from "@tanstack/react-query";

// This function fetches the exchange rate from an API
const fetchExchangeRate = async (): Promise<number> => {
  try {
    // In a real application, this would fetch from an actual currency API
    // Example: https://api.exchangerate-api.com/v4/latest/USD or similar service
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();
    
    // Return the BRL exchange rate
    return data.rates.BRL;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    // Fallback to a default value if the API fails
    return 5.15; // Default approximate value
  }
};

export const useExchangeRate = () => {
  const { data: exchangeRate, isLoading, error } = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: fetchExchangeRate,
    // Cache the exchange rate for 1 hour
    staleTime: 60 * 60 * 1000,
    // If fetching fails, use fallback value
    placeholderData: 5.15,
  });

  return {
    exchangeRate: exchangeRate || 5.15,
    isLoading,
    error,
  };
};
