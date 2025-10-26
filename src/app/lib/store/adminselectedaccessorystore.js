import { create } from 'zustand';

const useAdminSelectedAccessoryStore = create((set) => ({
  adminselectedaccessory: null,
  setadminselectedaccessory: (accessory) => set({ adminselectedaccessory: accessory }),
  clearadminselectedaccessory: () => set({ adminselectedaccessory: null }),
}));

export { useAdminSelectedAccessoryStore };

