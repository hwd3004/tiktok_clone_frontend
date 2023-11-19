// src/components/AuthModal.tsx

import { useState } from "react";
import { useGeneralStore } from "../stores/generalStore";
import { ImCross } from "react-icons/im";
import Login from "./Login";
import Register from "./Register";

function AuthModal() {
  // 사용자가 등록 또는 로그인 양식 중 어느 것을 보고 있는지를 관리하는 지역 상태
  const [isRegistered, setIsRegistered] = useState(false);

  // 전역 상태에서 상태 및 상태 수정 함수에 액세스
  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen);
  const isLoginOpen = useGeneralStore((state) => state.isLoginOpen);

  return (
    // 화면 전체를 덮는 모달 오버레이
    <div
      id="AuthModal"
      className="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
    >
      {/* 모달 내용 */}
      <div className="relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg">
        {/* 우측 상단에 위치한 닫기 버튼 */}
        <div className="w-full flex justify-end">
          <button
            onClick={() => setIsLoginOpen(!isLoginOpen)}
            className="p-1.5 rounded-full bg-gray-100"
          >
            <ImCross color="#000000" size="26" />
          </button>
        </div>

        {/* 로그인 또는 등록 양식을 지역 상태에 따라 렌더링 */}
        {isRegistered ? <Login /> : <Register />}

        {/* 로그인 및 등록 양식 간 전환 */}
        <div className="absolute flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
          <span className="text-[14px] text-gray-600">
            Don't have an account?
          </span>
          <button
            onClick={() => setIsRegistered(!isRegistered)}
            className="text-[14px] text-[#F02C56] font-semibold pl-1"
          >
            {isRegistered ? <span>Sign up</span> : <span>Log in </span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
