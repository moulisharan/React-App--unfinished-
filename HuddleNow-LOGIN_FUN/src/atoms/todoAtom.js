import { atom } from 'jotai';

// Default
// export const todoDetailAtom = atom();


export const todoDetailAtom = atom(null, (get, set, by) => {
    set(todoDetailAtom, JSON.stringify(by));
});
