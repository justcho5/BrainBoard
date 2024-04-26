import { create } from "zustand";
import noteService from "./services/notes";
export const useStore = create((set) => ({
  user: null,
  updateUser: (user) => set({ user }),

  errorMessage: null,
  updateErrorMessage: (errorMessage) => set({ errorMessage }),

  successMessage: null,
  updateSuccessMessage: (successMessage) => set({ successMessage }),

  notes: [],
  insertNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNotes: (notes) => set({ notes }),
  fetchNotes: async () => {
    const initialNotes = await noteService.getAll();
    set({ notes: initialNotes.reverse() });
  },
}));
