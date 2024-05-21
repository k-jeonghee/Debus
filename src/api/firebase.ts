import { BaseUser, UserTypes } from '@store/atoms/auth';
import { MutationFunction } from '@tanstack/react-query';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, User, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  child,
  get,
  getDatabase,
  off,
  onChildAdded,
  onChildRemoved,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import { getStorage } from 'firebase/storage';

import { ChatRoomInfo, ChatRoomInfoType, Message } from 'src/@types/chat';
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

const provider = new GoogleAuthProvider();

export const login = async () => {
  const res = await signInWithPopup(auth, provider);
  const user = res.user;
  const isRegistered = await checkUserExists(user.uid);
  if (!isRegistered) await createUser(user);
};

export const logout = () => signOut(auth);

const userRef = ref(db, 'users');
export const onUserStateChange = (callback: (user: BaseUser | null) => void) => {
  onAuthStateChanged(auth, async (user) => {
    callback(
      user && {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      },
    );
  });
};

const checkUserExists = async (userId: string) => {
  const snapshot = await get(child(userRef, userId));
  return snapshot.exists();
};

const createUser = async (user: User) => {
  assert(user !== null, '사용자가 없습니다.');
  return set(child(userRef, user.uid), {
    id: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    chatRooms: [],
  });
};

//User - chatRooms: 참여한 채팅방 정보 추가
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

//ChatRoom - members: 사용자 정보 추가
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
export const checkUserInChatRoom = async (user: BaseUser, chatRoomId: string) => {
  const snapshot = await get(child(userRef, `/${user.uid}/chatRooms`));
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
  addChatRoomInfoToUser(userId, chatRoomId, nickName);
  addUserIdToChatRoom(userId, chatRoomId, nickName);
};

const chatRoomRef = ref(db, 'lines');
export const createChatRoom: MutationFunction<
  string,
  { user: BaseUser; chatRoomInfo: ChatRoomInfo; nickName: string }
> = async ({ user, chatRoomInfo, nickName }) => {
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
        userId: user.uid,
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
  await addChatRoomInfoToUser(user.uid, id, nickName);
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
};

//채팅방 나가기
export const exitChatRoom = async (userId: string, chatRoomId: string, isLastMember?: boolean) => {
  deleteChatRoomInfoToUser(userId, chatRoomId);
  deleteUserIdToChatRoom(userId, chatRoomId);
  if (isLastMember) {
    setTimeout(() => deleteChatRoom(chatRoomId), 500);
  }
};

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

export const getChatRooms = async (): Promise<ChatRoomInfoType[]> => {
  const snapshot = await get(chatRoomRef);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

export const getChatRoom = async (id: string): Promise<ChatRoomInfoType> => {
  const snapshot = await get(child(chatRoomRef, id));
  return snapshot.exists() ? snapshot.val() : [];
};

export const messagesRef = ref(db, 'messages');
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

export const addMessageListener = (chatRoomId: string, callback: () => void) => {
  const chatRoomMessagesRef = child(messagesRef, chatRoomId);
  // 데이터베이스 변경 사항 관찰
  onChildAdded(chatRoomMessagesRef, (snapshot) => {
    if (snapshot.exists()) callback();
  });

  //리스너 해제
  return () => off(chatRoomMessagesRef);
};

export const getMessages = async (chatRoomId: string): Promise<Message[]> => {
  const snapshot = await get(child(messagesRef, chatRoomId));
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

export const getMessage = async ({
  chatRoomId,
  messageId,
}: {
  chatRoomId: string;
  messageId: string;
}): Promise<Message> => {
  const snapshot = await get(child(messagesRef, `${chatRoomId}/${messageId}`));
  return snapshot.val();
};
