import { useRecoilCallback, useRecoilState } from 'recoil';

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pictoDb } from '../../models/Picto';
import Picto from './Picto';
import { PictoState } from './PictosState';

export default function PictoContainer() {
  const params = useParams();

  const id = parseInt(params.pictoId || '0', 10);

  const [picto, setPicto] = useRecoilState(PictoState);
  const refreshPicto = useRecoilCallback(
    () => async () => {
      const res = await pictoDb.pictos.get(id);

      if (res) {
        setPicto(res);
      }
    },
    [],
  );

  useEffect(() => {
    refreshPicto();
    return () => {};
  }, [refreshPicto]);

  return <Picto picto={picto} />;
}
