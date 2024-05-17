import { atom } from 'jotai';
import { onUserStateChange } from 'src/api/firebase';

export interface BaseUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}

export interface UserTypes extends BaseUser {
  chatRooms: { id: string; nickName: string }[];
}

export const baseAuthAtom = atom<BaseUser | null>(null);
export const authAtom = atom<Promise<BaseUser>>((get) => {
  const x = get(baseAuthAtom);
  if (!x) return new Promise(() => {});
  return Promise.resolve(x);
});
baseAuthAtom.onMount = (set) => onUserStateChange(set);
