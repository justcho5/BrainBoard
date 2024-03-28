import { create } from "zustand";

export const useStore = create((set) => ({
  user: null,
  updateUser: (user) => set({ user }),

  errorMessage: null,
  updateErrorMessage: (errorMessage) => set({ errorMessage }),

  successMessage: null,
  updateSuccessMessage: (successMessage) => set({ successMessage }),
}));
