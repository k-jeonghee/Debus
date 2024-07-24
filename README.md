# Debus(디버스) - [🔗 프로젝트 바로가기](https://debus-project.vercel.app/)

개발자 스터디 팀 매칭을 위한 오픈 채팅 서비스

### \*테스트 안내사항

`로그인` 을 누르면 익명으로 로그인 되어 다른 인증 없이 테스트가 가능합니다.

---

## 프로젝트 소개

모각코&스터디 팀 모집을 위해 분산된 기능들을 하나로 모아 제공하는 플랫폼을 만드는 것을 목표로 그 중 핵심 기능인 오픈 채팅을 구현했습니다.

## 프로젝트 목표

- 코드 리뷰를 통해 프로덕션 수준의 기능 구현을 위한 **프로그래밍 실력** 향상
- 동작 여부보다 **어떻게 개선할 수 있을지**에 대한 고민과 **이유 있는 코드 작성**에 집중하기
- **재사용 가능한 컴포넌트 분리**와 확장성을 위한 추상화
- 상황에 적합한 **에러 핸들링**으로 사용성 개선

## 기술 스택

- **코어**: Typescript, React, PostCSS
- **상태관리**: Jotai | Context API | TanStack-Query v5
- **서버&DB**: Firebase
- **배포**: Vercel

## 기술 선정 이유

1. **PostCSS:** CSS in JS와 Tailwind를 경험해 보고 기본 CSS가 잘 되어야 어떤 방법도 무리없이 사용할 수 있다고 판단
2. **Jotai:** 이전 프로젝트에서 Redux를 사용하여 Atom패턴의 상태 관리를 쓰고 싶었고, 한번도 테스트 해보지 못한 라이브러리 선택
3. **TanStack Query:** 서로 연관이 많은 데이터 구조에서 서버 상태 관리 경험이 부족해 효율적인 query key 관리와 캐싱 데이터 사용 방법을 습득하고자 함

## 미리보기

- light/dark 모드
- 실시간 데이터 동기화
  ![sync](https://github.com/user-attachments/assets/bf891c22-2828-4abc-a07d-025903e859f3)

- 채팅방별 닉네임 설정
  ![nickname](https://github.com/user-attachments/assets/faf300d5-328b-4453-b1e4-b2eb0138aba0)

- 사용자별 참여중인 채팅방 모아보기
  ![operation](https://github.com/user-attachments/assets/24a11f41-66c0-46fc-a960-9377c6e97f31)

- 비동기 처리가 가능한 전역 모달
  ![modal1](https://github.com/user-attachments/assets/4a54a889-1e8f-4343-ae34-8c663079f89e)

- 마이페이지 정보 수정
  ![mypage](https://github.com/user-attachments/assets/ce0a13f7-b167-4597-bd24-0cbbe49d1e4d)
