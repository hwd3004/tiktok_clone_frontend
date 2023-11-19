// // src/components/Register.tsx

import { useMutation } from "@apollo/client";
import { RegisterUserMutation } from "../gql/graphql";
import { REGISTER_USER } from "../graphql/mutations/register";
import { useUserStore } from "../stores/userStore";
import { useGeneralStore } from "../stores/generalStore";
import { useState } from "react";
import { GraphQLErrorExtensions } from "graphql";
import Input from "./Input";

function Register() {
  // useMutation 훅으로 REGISTER_USER 뮤테이션을 호출하고 결과를 받아온다.
  const [registerUser, { data, loading, error }] =
    useMutation<RegisterUserMutation>(REGISTER_USER);

  // useUserStore와 useGeneralStore 훅을 사용하여 전역 상태 및 액션을 가져온다.
  const setUser = useUserStore((state) => state.setUser);
  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen);

  // 서버에서 반환된 GraphQL 에러를 저장할 상태와 초기값을 설정한다.
  const [errors, setErrors] = useState<GraphQLErrorExtensions>({});

  // 회원가입 폼 데이터를 담을 상태와 초기값을 설정한다.
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });

  // 회원가입 버튼 클릭 시 실행되는 함수
  const handleRegister = async () => {
    // 기존 에러를 초기화한다.
    setErrors({});

    // useMutation 훅으로 REGISTER_USER 뮤테이션을 호출한다.
    // 호출 시, 회원가입 폼 데이터를 변수로 전달한다.
    await registerUser({
      variables: {
        email: registerData.email,
        password: registerData.password,
        fullname: registerData.fullName,
        confirmPassword: registerData.confirmPassword,
      },
    }).catch((err) => {
      console.trace(err.graphQLErrors);

      // GraphQL 에러가 발생하면 해당 에러를 상태에 저장한다.
      setErrors(err.graphQLErrors[0].extensions);
    });

    // 회원가입이 성공하면 반환된 사용자 정보로 전역 상태를 업데이트한다.
    if (data?.register.user) {
      console.trace(data.register.user);
      setUser({
        id: String(data?.register.user.id),
        email: data?.register.user.email,
        fullname: data?.register.user.fullname,
      });
    }

    // 로그인 모달을 닫는다.
    setIsLoginOpen(false);
  };

  return (
    <>
      {/* 회원가입 폼 UI */}
      <div className="text-center text-[28px] mb-4 font-bold">Sign up</div>

      {/* Full name, Email, Password, Confirm Password에 대한 Input 컴포넌트들을 생성한다. */}

      <div className="px-6 pb-2">
        <Input
          max={64}
          placeHolder="Full name"
          onChange={(e) =>
            setRegisterData({ ...registerData, fullName: e.target.value })
          }
          inputType="text"
          autoFocus={true}
          error={errors?.fullname as string}
        ></Input>
      </div>

      <div className="px-6 pb-2">
        <Input
          max={64}
          placeHolder="Email"
          onChange={(e) =>
            setRegisterData({ ...registerData, email: e.target.value })
          }
          inputType="email"
          autoFocus={true}
          error={errors?.email as string}
        ></Input>
      </div>

      <div className="px-6 pb-2">
        <Input
          max={64}
          placeHolder="Password"
          onChange={(e) =>
            setRegisterData({ ...registerData, password: e.target.value })
          }
          inputType="password"
          autoFocus={true}
          error={errors?.password as string}
        ></Input>
      </div>

      <div className="px-6 pb-2">
        <Input
          max={64}
          placeHolder="Confirm password"
          onChange={(e) =>
            setRegisterData({
              ...registerData,
              confirmPassword: e.target.value,
            })
          }
          inputType="password"
          autoFocus={true}
          error={errors?.confirmPassword as string}
        ></Input>
      </div>

      <div className="px-6 mt-6">
        {/* 회원가입 버튼 */}
        <button
          onClick={handleRegister}
          disabled={
            !registerData.email ||
            !registerData.password ||
            !registerData.fullName ||
            !registerData.confirmPassword
          }
          className={[
            "w-full text-[17px] font-semibold text-white py-3 rounded-sm",
            !registerData.email ||
            !registerData.password ||
            !registerData.fullName ||
            !registerData.confirmPassword
              ? "bg-gray-200"
              : "bg-[#F02C56]",
          ].join(" ")}
        >
          Register
        </button>
      </div>
    </>
  );
}

export default Register;
