// src/components/ProtectedRoutes.tsx

import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { useGeneralStore } from "../stores/generalStore";

// ProtectedRoutes 컴포넌트 정의
const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  // 전역적으로 관리되는 사용자 상태 및 전역 상태 훅 사용
  const user = useUserStore((state) => state);
  const navigate = useNavigate();
  const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen);

  // useEffect를 사용하여 컴포넌트가 마운트될 때와 user.id 상태가 변경될 때 실행
  useEffect(() => {
    // 사용자가 인증되어 있지 않으면 홈 페이지로 리디렉션하고 로그인 모달 열기
    if (!user.id) {
      navigate("/"); // or your login page
      setLoginIsOpen(true);
    }
  }, [user.id, navigate, setLoginIsOpen]); // user.id 상태가 변경될 때마다 실행

  // 사용자가 인증되어 있지 않은 경우 "No Access" 반환, 그렇지 않은 경우 자식 요소들 반환
  if (!user.id) {
    return <>No Access</>;
  }

  return <>{children}</>; // children은 해당 컴포넌트로 전달된 자식 요소들을 나타냄
};

export default ProtectedRoutes;
