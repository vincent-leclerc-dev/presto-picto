import { RefObject, createRef } from 'react';
import { atom } from 'recoil';

const InputRefAtom = atom<RefObject<HTMLInputElement>>({
  key: 'InputRefAtom',
  default: createRef<HTMLInputElement>(),
});

export default InputRefAtom;
