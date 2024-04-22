import { UserTypes } from '@store/atoms/auth';
import { MutationFunction } from '@tanstack/react-query';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
    DataSnapshot,
    child,
    get,
    getDatabase,
    off,
    onChildAdded,
    push,
    ref,
    serverTimestamp,
    set,
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

export const login = () =>
    signInWithPopup(auth, provider).then(async (res) => {
        const user = res.user;
        const isRegistered = await checkUserExists(user.uid);
        if (!isRegistered) await createUser(user);
    });

export const logout = () => signOut(auth);

export const onUserStateChange = (callback: (user: UserTypes | null) => void) =>
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

const checkUserExists = async (userId: string) => get(ref(db, `users/${userId}`)).then((snapshot) => snapshot.exists());

// ref(db, `users/${user.uid}`)
const userRef = ref(db, 'users');
const createUser = (user: UserTypes) => {
    assert(user !== null, '사용자가 없습니다.');
    return set(child(userRef, user.uid), {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
    });
};

const chatRoomRef = ref(db, 'lines');
export const createChatRoom: MutationFunction<string, { user: UserTypes; chatRoomInfo: ChatRoomInfo }> = async ({
    user,
    chatRoomInfo,
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
                userId: user.uid,
                name: user.displayName ?? 'noname',
                role: 'owner',
            },
        ],
        createAt: new Date().getTime(),
        status: 'pending',
    };
    //새로 만들어둔 참조를 부모로 해서 새로운 데이터 추가
    await set(newChatRoomRef, newChatRoom);
    return id;
};

export const getChatRoom = async (id: string): Promise<DataSnapshot> =>
    get(child(chatRoomRef, id)).then((snapshot: DataSnapshot) => {
        if (snapshot.exists()) return snapshot.val();
        return [];
    });

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

export const addMessageListener = (chatRoomId: string, callback: (message: Message) => void) => {
    const chatRoomMessagesRef = child(messagesRef, chatRoomId);
    // 데이터베이스 변경 사항 관찰
    onChildAdded(chatRoomMessagesRef, (snapshot) => {
        if (snapshot.exists()) {
            const messages: Message[] = Object.values(snapshot.val());
            if (messages) {
                messages.forEach((childSnapshot) => {
                    callback(childSnapshot);
                });
            }
        }
    });

    //리스너 해제
    return () => off(chatRoomMessagesRef);
};

export const getMessages = async (chatRoomId: string) =>
    get(child(messagesRef, chatRoomId)).then((snapshot): Message[] => {
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        }
        return [];
    });

export const getMessage = async ({ chatRoomId, messageId }: { chatRoomId: string; messageId: string }) =>
    get(child(messagesRef, `${chatRoomId}/${messageId}`)).then((snapshot): Message => {
        return snapshot.val();
    });
