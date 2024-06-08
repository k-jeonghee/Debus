import { atom } from 'jotai';
import { chatUserInfo } from 'src/@types/chat';
import { onUserStateChange } from 'src/api/firebase';

export type UserTypes = {
  id: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  chatRooms: chatUserInfo[];
};

export const baseAuthAtom = atom<UserTypes | null>(null);
export const authAtom = atom<Promise<UserTypes>>((get) => {
  const x = get(baseAuthAtom);
  if (x === null) return new Promise(() => {});
  return Promise.resolve(x);
});
baseAuthAtom.onMount = (set) => onUserStateChange(set);
