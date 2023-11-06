// src/utils/apolloClient.ts

import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink,
} from "@apollo/client";
// The Observable class in @apollo/client has the following functionality that we need:
// - subscribe() method to subscribe to updates
// - unsubscribe() method to unsubscribe from updates
// - next() method to send updates to subscribers
// - error() method to send errors to subscribers
// - complete() method to send completion messages to subscribers

import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";

// 새로운 액세스 토큰을 얻는 비동기 함수
async function refreshToken(
  client: ApolloClient<NormalizedCacheObject>
) {
  try {
    // GraphQL 뮤테이션을 사용하여 새로운 액세스 토큰을 요청
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `,
    });

    // 새로운 액세스 토큰을 받아옴
    const newAccessToken = data?.refreshToken;
    console.trace("newAccessToken", newAccessToken);

    if (!newAccessToken) {
      throw new Error("New access token not received.");
    }

    // 새로운 액세스 토큰을 로컬 스토리지에 저장
    localStorage.setItem("accessToken", newAccessToken);

    // 액세스 토큰을 Bearer 토큰 형식으로 반환
    return `Bearer ${newAccessToken}`;
  } catch (err) {
    console.trace(err);
    throw new Error("Error getting a new access token.");
  }
}

// 토큰 재시도 횟수 및 최대 재시도 횟수 설정
let retryCount = 0;
const maxRetry = 3;

// 오류 처리를 담당하는 Apollo Link
const errorLink = onError(
  ({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // "UNAUTHENTICATED" 오류와 재시도 횟수가 최대 재시도 횟수보다 적을 경우
        if (
          err.extensions.code === "UNAUTHENTICATED" &&
          retryCount < maxRetry
        ) {
          retryCount++;

          return new Observable((observer) => {
            // Promise를 사용하지 않고 Observable을 사용하는 이유는
            // Promise는 하나의 값으로 resolve되는 반면,
            // Observable은 하나의 값이 아니라 여러 값을 처리할 수 있는 데이터 스트림을
            // 나타낸다는 점 때문이다.
            // 하나의 값이 아니라 여러 값을 다루어야 하므로 Observable을 사용하고,
            // 여러 번 시도해야 할 수도 있기 때문에 단순한 단일 값이 아니라 여러 값을 처리할 수 있어야 한다.

            console.trace("observer", observer);

            // 새로운 액세스 토큰을 얻어오고, 헤더에 추가한 후 원래 요청 다시 보내기
            refreshToken(client)
              .then((token) => {
                console.trace("token", token);
                operation.setContext(
                  (previousContext: any) => ({
                    headers: {
                      ...previousContext.headers,
                      authorization: token,
                    },
                  })
                );
                const forward$ = forward(operation);
                forward$.subscribe(observer);
              })
              .catch((error) => observer.error(error));
          });
        }
      }
    }
  }
);

// 파일 업로드를 지원하는 Apollo Link
const uploadLink = createUploadLink({
  uri: "http://localhost:3000/graphql", // GraphQL 서버 URI
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});

// Apollo Client 인스턴스 생성
export const client = new ApolloClient({
  uri: "http://localhost:3000/graphql", // GraphQL 서버 URI
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getCommentsByPostId: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  // Apollo Link를 사용하여 오류 처리 및 파일 업로드 기능 추가
  link: ApolloLink.from([errorLink, uploadLink]),
});
