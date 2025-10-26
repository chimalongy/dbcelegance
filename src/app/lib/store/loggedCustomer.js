import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export const useLoggedCustomerStore = create(
  persist(
    (set, get) => ({
      loggedCustomer: null,
      lastActivity: null,
      
      setLoggedCustomer: (loggedCustomer) => 
        set({ 
          loggedCustomer,
          lastActivity: Date.now() 
        }),
        
      updateLastActivity: () => 
        set({ lastActivity: Date.now() }),
        
      clearLoggedCustomer: () => 
        set({ 
          loggedCustomer: null, 
          lastActivity: null 
        }),
        
      isSessionExpired: () => {
        const { lastActivity } = get();
        return lastActivity && (Date.now() - lastActivity > SESSION_TIMEOUT);
      }
    }),
    {
      name: 'logged-customer-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        loggedCustomer: state.loggedCustomer,
        lastActivity: state.lastActivity,
      }),
    }
  )
);
