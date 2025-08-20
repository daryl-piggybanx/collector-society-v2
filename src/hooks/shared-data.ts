import { useQueryClient } from '@tanstack/react-query';

export function useSharedFormData(key?: string) {
	const queryClient = useQueryClient();
	
	// configurable key, fallback to default
	const QUERY_KEY = key ? [key] : ['form-data'];
	const STORAGE_KEY = key || 'form-data';
	
	const setSharedData = (data: any) => {
		queryClient.setQueryData(QUERY_KEY, data);
		
		
		// only access localStorage on client side
		if (typeof window !== 'undefined') {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify({
					data,
					timestamp: Date.now()
				}));
			} catch (error) {
				console.warn('Failed to persist data to localStorage:', error);
			}
		}
	}
	
	const getSharedData = () => {
		let data = queryClient.getQueryData(QUERY_KEY);
		
		// only try localStorage if on client and don't have cached data
		if (!data && typeof window !== 'undefined') {
			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored) {
					const parsed = JSON.parse(stored)
					
					// check expiration 7 days
					const isExpired = Date.now() - parsed.timestamp > (7 * 24 * 60 * 60 * 1000);
					if (!isExpired) {
						data = parsed.data;
						// restore to query cache
						queryClient.setQueryData(QUERY_KEY, data);
					} else {
						localStorage.removeItem(STORAGE_KEY);
					}
				}
			} catch (error) {
				console.warn('Failed to parse cached data:', error);
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	
		return data;
	}
	
	const clearSharedData = () => {
		queryClient.removeQueries({ queryKey: QUERY_KEY });
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
	
	// return data directly, undefined on server, data on client
	const sharedData = getSharedData();
	
  return {
    sharedData, // direct access to shared data
    setSharedData,
    clearSharedData,
    hasSharedData: Boolean(sharedData) // convenience flag
  }
}
