import { atom } from 'jotai';
import { onUserStateChange } from 'src/api/firebase';

export type UserTypes = {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    email: string | null;
};

export const baseAuthAtom = atom<UserTypes | null>(null);
export const authAtom = atom<Promise<UserTypes>>((get) => {
    const x = get(baseAuthAtom);
    if (!x) return new Promise(() => {});
    return Promise.resolve(x);
});
baseAuthAtom.onMount = (set) => onUserStateChange(set);
