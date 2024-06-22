import { atom } from 'jotai';
import { chatUserInfo } from 'src/@types/chat';
import { onUserStateChange } from 'src/api/firebase';

export type UserTypes = {
  id: string;
  name: string | null;
  photoURL: string | null;
  email: string | null;
  chatRooms: chatUserInfo[];
} & UserInfo;

export type UserInfo = {
  nickname: string;
  options: string;
  sns: string;
};

export const baseAuthAtom = atom<UserTypes | null>(null);
export const authAtom = atom<Promise<UserTypes>>((get) => {
  const x = get(baseAuthAtom);
  if (x === null) return new Promise(() => {});
  return Promise.resolve(x);
});
baseAuthAtom.onMount = (set) => onUserStateChange(set);
