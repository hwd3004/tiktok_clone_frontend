// src/components/Input.tsx

import React from "react";
import { useEffect } from "react";

/**
 * Input 컴포넌트는 입력 필드를 렌더링하고, 포커스 및 에러 처리를 담당합니다.
 * @param {string} placeHolder - 입력 필드에 나타날 플레이스홀더 텍스트.
 * @param {string} inputType - 입력 필드의 타입 (예: "text", "password" 등).
 * @param {number} max - 입력 값의 최대 길이.
 * @param {string} error - 입력 필드와 연관된 오류 메시지.
 * @param {boolean} autoFocus - 페이지 로드 시 자동으로 입력 필드에 포커스 여부.
 * @param {function} onChange - 입력 필드 값이 변경될 때 호출되는 함수.
 * @param {string} value - 입력 필드의 현재 값.
 */
function Input({
  placeHolder,
  inputType,
  max,
  error,
  autoFocus,
  onChange,
  value,
}: {
  placeHolder: string;
  inputType: string;
  max: number;
  error: string;
  autoFocus: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}) {
  // autoFocus가 true인 경우, 페이지 로드 시 입력 필드에 포커스를 줌
  useEffect(() => {
    if (autoFocus) {
      const input = document.getElementById(`input-${placeHolder}`);
      input?.focus();
    }
  }, [autoFocus, placeHolder]);

  return (
    <div>
      {/* 입력 필드 */}
      <input
        value={value}
        id={`input-${placeHolder}`}
        placeholder={placeHolder}
        type={inputType}
        autoComplete="off"
        maxLength={max}
        onChange={onChange}
        className="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
      />
      {/* 오류 메시지 표시 */}
      {error && (
        <span className="text-red-500 text-[14px] font-semibold">{error}</span>
      )}
    </div>
  );
}

export default Input;
