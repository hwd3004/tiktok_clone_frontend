// src/stores/generalStore.ts

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// 스토어 상태를 정의하는 인터페이스.
export interface GeneralStore {
  isLoginOpen: boolean;
  isEditProfileOpen: boolean;
  selectedPosts: null;
  ids: null;
  posts: null;
}

// 스토어에서 사용할 동작을 정의하는 인터페이스.
export interface GeneralActions {
  setLoginIsOpen: (isLoginOpen: boolean) => void;
  setIsEditProfileOpen: () => void;
}

// Zustand 스토어를 생성하고 설정.
export const useGeneralStore = create<
  GeneralStore & GeneralActions
>()(
  // 개발자 도구를 사용하기 위한 미들웨어.
  devtools(
    // 로컬 스토리지에 상태를 저장하고 복원하기 위한 미들웨어.
    persist(
      (set) => ({
        isLoginOpen: false,
        isEditProfileOpen: false,
        selectedPosts: null,
        ids: null,
        posts: null,
        setLoginIsOpen: (isLoginOpen) =>
          set({ isLoginOpen }),
        setIsEditProfileOpen: () => {
          return set((state) => ({
            isEditProfileOpen: !state.isEditProfileOpen,
          }));
        },
      }),
      {
        // 로컬 스토리지에 저장될 키 이름.
        name: "general-store",
      }
    )
  )
);
