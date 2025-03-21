
import { useState, useEffect } from 'react';

interface ExchangeRateResponse {
  rates: {
    BRL: number;
  };
  base: string;
  date: string;
}

export const useExchangeRate = () => {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have a cached exchange rate
        const cachedRate = localStorage.getItem('exchange_rate_cache');
        const cachedTimestamp = localStorage.getItem('exchange_rate_timestamp');
        
        // Use cached rate if it's less than 1 hour old
        if (cachedRate && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp);
          const now = Date.now();
          
          // If cache is less than 1 hour old
          if (now - timestamp < 60 * 60 * 1000) {
            setRate(parseFloat(cachedRate));
            setIsLoading(false);
            return;
          }
        }
        
        // In real implementation, fetch from API like:
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data: ExchangeRateResponse = await response.json();
        
        // For now, using a mock response
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const mockRate = 5.21; // Mock BRL to USD exchange rate
        
        // Cache the rate
        localStorage.setItem('exchange_rate_cache', mockRate.toString());
        localStorage.setItem('exchange_rate_timestamp', Date.now().toString());
        
        setRate(mockRate);
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // Fallback to a default rate in case of error
        setRate(5.0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExchangeRate();
  }, []);
  
  return { rate, isLoading, error };
};
