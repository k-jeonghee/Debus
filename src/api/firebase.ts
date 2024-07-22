import { createChatRoomMutateType } from '@hooks/services/mutations/chat';
import { UserInfo, UserTypes } from '@store/atoms/auth';
import { MutationFunction } from '@tanstack/react-query';
import { initializeApp } from 'firebase/app';
import { User, deleteUser, getAuth, onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import {
  DataSnapshot,
  child,
  get,
  getDatabase,
  off,
  onChildAdded,
  onChildRemoved,
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import { getStorage } from 'firebase/storage';

import { ChatRoomInfoType, Message, chatUserInfo } from 'src/@types/chat';
import { assert } from 'src/utils/assert';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
export const storage = getStorage(app);

/**
 * 구글 로그인 시 필요한 provider
 */
// const provider = new GoogleAuthProvider();

const userRef = ref(db, 'users');
const chatRoomRef = ref(db, 'lines');
const messagesRef = ref(db, 'messages');

//>>>>>>>>>>>>>>>>>>>인증
export const login = async () => {
  const res = await signInAnonymously(auth);
  const user = res.user;

  const userOrNull: UserTypes | null = await getUserById(user.uid);
  if (!userOrNull) {
    return await createUser(user);
  }
  return userOrNull;
};

export const logout = () => signOut(auth);

export const onUserStateChange = (callback: (user: UserTypes | null) => void) =>
  onAuthStateChanged(auth, async (user) => {
    const updatedUser: UserTypes | null = user ? await getUserById(user.uid) : null;
    callback(updatedUser);
  });

export const getUserById = async (userId: string) => {
  const snapshot = await get(child(userRef, userId));
  return snapshot.exists() ? snapshot.val() : null;
};

const createUser = async (user: User) => {
  assert(user !== null, '사용자가 없습니다.');
  await set(child(userRef, user.uid), {
    id: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    chatRooms: [],
  });
  const userInfo: UserTypes = await getUserById(user.uid);
  return userInfo;
};

//사용자 정보 추가
type UserInfoMutateType = {
  userId: string;
  newInfo: UserInfo;
};
export const updateUserInfo: MutationFunction<void, UserInfoMutateType> = async ({ userId, newInfo }) => {
  const snapshot = await get(child(userRef, userId));
  const userInfo: UserTypes = snapshot.val();
  const newUserInfo = {
    ...userInfo,
    ...newInfo,
  };
  await update(child(userRef, userId), newUserInfo);
};

/**
firebase auth 인스턴스 초기화 시 null 할당 문제로 ProtectdRoute를 위함
 */
export const loader = async () => {
  await auth.authStateReady();
  return auth.currentUser;
};
//<<<<<<<<<<<<<<<<<<<인증

//회원탈퇴
export const deleteUserFromGoogle = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      await deleteUserFromDB(user.uid);
      await deleteUser(user);
      logout();
    } catch (error) {
      throw new Error('회원탈퇴 실패!');
    }
  }
};

const deleteUserFromDB = async (uid: string) => {
  await remove(child(userRef, uid));
};

//User: 참여한 채팅방 추가
const addChatRoomInfoToUser = async (userId: string, chatRoomId: string, nickName: string) => {
  const snapshot = await get(child(userRef, userId));
  const userInfo: UserTypes = snapshot.val();

  const chatRoomInfo = {
    id: chatRoomId,
    nickName,
  };
  const newUserInfo = {
    ...userInfo,
    chatRooms: [...(userInfo.chatRooms ?? []), chatRoomInfo],
  };
  await update(child(userRef, userId), newUserInfo);
};

//ChatRoom: 참여한 사용자 추가
const addUserIdToChatRoom = async (userId: string, chatRoomId: string, nickName: string) => {
  const snapshot = await get(child(chatRoomRef, chatRoomId));
  const chatRoomInfo: ChatRoomInfoType = snapshot.val();
  const userInfo = { userId, name: nickName, role: 'participant' };
  const newChatRoomInfo = {
    ...chatRoomInfo,
    members: [...chatRoomInfo.members, userInfo],
  };
  await update(child(chatRoomRef, chatRoomId), newChatRoomInfo);
};

//채팅방 입장 확인
export const checkUserInChatRoom = async (user: UserTypes, chatRoomId: string) => {
  const snapshot = await get(child(userRef, `/${user.id}/chatRooms`));
  //참여중인 채팅방이 1개 이상
  if (snapshot.exists()) {
    const userChatRoom: { id: string; nickName: string }[] = Object.values(snapshot.val());
    //이미 입장한 채팅방인지 확인
    //입장한 적이 없으면 false / 이미 참여중이면 true 반환
    const joinedChatRoom = userChatRoom.find(({ id }) => chatRoomId === id);
    return joinedChatRoom !== undefined;
  }
  //참여중인 채팅방 0개: false 반환
  return false;
};

export const bindUserAndChatRoom = async (userId: string, chatRoomId: string, nickName: string) => {
  //새로운 채팅방이면 양방향 저장
  await addChatRoomInfoToUser(userId, chatRoomId, nickName);
  await addUserIdToChatRoom(userId, chatRoomId, nickName);
};

export const createChatRoom: MutationFunction<string, createChatRoomMutateType> = async ({
  user,
  chatRoomInfo,
  nickName,
}) => {
  //chatRoomRef에 참조 추가
  const newChatRoomRef = push(chatRoomRef);
  //추가된 참조의 key값 얻기
  const id = newChatRoomRef.key;
  assert(id !== null, '채팅방 id가 존재하지 않습니다.');
  const newChatRoom: ChatRoomInfoType = {
    ...chatRoomInfo,
    id,
    options: chatRoomInfo.options.split(','),
    members: [
      {
        userId: user.id,
        name: nickName,
        role: 'owner',
      },
    ],
    createAt: new Date().getTime(),
    status: 'pending',
  };
  //새로 만들어둔 참조를 부모로 해서 새로운 데이터 추가
  await set(newChatRoomRef, newChatRoom);
  //user정보에 채팅방 id 추가
  await addChatRoomInfoToUser(user.id, id, nickName);
  return id;
};

//User - chatRooms: 참여한 채팅방 정보 삭제
const deleteChatRoomInfoToUser = async (userId: string, chatRoomId: string) => {
  const snapshot = await get(child(userRef, userId));
  const userInfo: UserTypes = snapshot.val();
  const newUserInfo = {
    ...userInfo,
    chatRooms: userInfo.chatRooms.filter(({ id }) => id !== chatRoomId),
  };
  await update(child(userRef, userId), newUserInfo);
};

//ChatRoom - members: 사용자 정보 삭제
const deleteUserIdToChatRoom = async (userId: string, chatRoomId: string) => {
  const snapshot = await get(child(chatRoomRef, chatRoomId));
  const chatRoomInfo: ChatRoomInfoType = snapshot.val();
  const newChatRoomInfo = {
    ...chatRoomInfo,
    members: chatRoomInfo.members.filter((member) => member.userId !== userId),
  };
  await update(child(chatRoomRef, chatRoomId), newChatRoomInfo);
};

//채팅방 삭제
const deleteChatRoom = async (chatRoomId: string) => {
  await remove(child(chatRoomRef, chatRoomId));
  await remove(child(messagesRef, chatRoomId));
};

//채팅방 나가기
export const exitChatRoom = async (userId: string, chatRoomId: string, isLastMember?: boolean) => {
  await deleteChatRoomInfoToUser(userId, chatRoomId);
  await deleteUserIdToChatRoom(userId, chatRoomId);

  if (isLastMember) {
    await deleteChatRoom(chatRoomId);
  }
};

//채팅방 참여 멤버 변경
export const updateMemberListener = (chatRoomId: string, callback: () => void) => {
  const chatRoomMembersRef = child(chatRoomRef, `${chatRoomId}/members`);
  onChildAdded(chatRoomMembersRef, (snapshot) => {
    if (snapshot.exists()) callback();
  });
  onChildRemoved(chatRoomMembersRef, (snapshot) => {
    if (snapshot.exists()) callback();
  });

  return () => off(chatRoomMembersRef);
};

//전체 채팅방 조회
export const getChatRooms = async (): Promise<ChatRoomInfoType[]> => {
  const snapshot = await get(chatRoomRef);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

//ID에 맞는 채팅방 조회
export const getChatRoom = async (id: string): Promise<ChatRoomInfoType> => {
  const snapshot: DataSnapshot = await get(child(chatRoomRef, id));
  return snapshot.exists() ? snapshot.val() : [];
};

//사용자가 참여중인 채팅방 조회: id만 담은 배열 반환
export const getChatRoomsByUser = async (userId: string) => {
  const snapshot = await get(child(userRef, `${userId}/chatRooms`));
  if (snapshot.exists()) {
    const origin: chatUserInfo[] = snapshot.val();
    const userChatRoomIds = origin.map((chatRoom) => chatRoom.id);
    return userChatRoomIds;
  }
  return [];
};

//메시지 추가
export const addNewMessage: MutationFunction<
  Message,
  { chatRoomId: string; message: Omit<Message, 'id' | 'timestamp'> }
> = async ({ chatRoomId, message }) => {
  // 이미 존재하는 채팅방의 참조를 가져와 해당 채팅방의 하위에 새로운 메시지를 추가한다.
  const newMessageRef = push(child(messagesRef, chatRoomId)); // 메시지를 messagesRef에 추가
  const id = newMessageRef.key;
  assert(id !== null, '메세지 id가 존재하지 않습니다.');
  const newMessage: Message = {
    ...message,
    id,
    timestamp: serverTimestamp(),
  };
  await set(newMessageRef, newMessage); // chatRoomId에 해당하는 자식에 메시지 추가
  return newMessage;
};

//메시지 데이터 변경 리스너
export const addMessageListener = (chatRoomId: string, callback: (newMessages: Message[]) => void) => {
  const chatRoomMessagesRef = child(messagesRef, chatRoomId);
  onValue(chatRoomMessagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messages: Message[] = snapshot.val();
      callback(Object.values(messages));
    }
  });

  //리스너 해제
  return () => off(chatRoomMessagesRef);
};

//채팅방 메시지 조회
export const getMessages = async (chatRoomId: string): Promise<Message[]> => {
  const snapshot = await get(child(messagesRef, chatRoomId));
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

//개별 메시지 조회
export const getMessage = async (chatRoomId: string, messageId: string): Promise<Message> => {
  const snapshot = await get(child(messagesRef, `${chatRoomId}/${messageId}`));
  return snapshot.val();
};
