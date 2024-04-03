import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from 'react';

export type UploadFormContextType = {
  canEdit: boolean;
  setCanEdit: Dispatch<SetStateAction<boolean>>;
};

export const UploadFormContext = createContext<UploadFormContextType | null>(
  null,
);

export default function UploadFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [canEdit, setCanEdit] = useState(true);

  const contextValue = useMemo(
    () => ({ canEdit, setCanEdit }),
    [canEdit, setCanEdit],
  );

  return (
    <UploadFormContext.Provider value={contextValue}>
      {children}
    </UploadFormContext.Provider>
  );
}
