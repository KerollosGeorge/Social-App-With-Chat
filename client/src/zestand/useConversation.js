import { create } from "zustand";
export const useConversation = create((set) => ({
  selectedUser: null,
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
