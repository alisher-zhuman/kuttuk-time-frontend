import { create } from "zustand";

// The website's stand-in for Telegram's MainButton: useMainButton puts the
// screen's action here, the layout draws it at the bottom.
export interface WebMainButton {
  text: string;
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export interface WebMainButtonState {
  button: WebMainButton | null;
  setButton: (button: WebMainButton | null) => void;
}

export const useWebMainButtonStore = create<WebMainButtonState>((set) => ({
  button: null,
  setButton: (button) => set({ button })
}));
