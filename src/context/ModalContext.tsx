import { MutableRefObject, PropsWithChildren, createContext, useCallback, useMemo, useRef, useState } from 'react';
import { ModalParameters, ModalType } from 'src/@types/modal';

type ModalContextValue<P> = {
  open: (modal: ModalType<P>) => void;
  close: (id: string) => void;
  modals: ModalType<P>[];
  portalRef: MutableRefObject<HTMLDivElement | null>;
};

/**
 * Note: Provider value Type Error 해결을 위해 any 적용
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const modalContext = createContext<ModalContextValue<any> | null>(null);

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modals, setModals] = useState<ModalType<ModalParameters>[]>([]);
  const portalRef = useRef<HTMLDivElement | null>(null);

  const open = useCallback((modal: ModalType<ModalParameters>) => setModals((prev) => [...prev, modal]), []);
  const close = useCallback((id: string) => setModals((prev) => prev.filter((v) => v.modalId !== id)), []);

  const value = useMemo(
    () => ({
      modals,
      open,
      close,
      portalRef,
    }),
    [modals, open, close],
  );

  return (
    <modalContext.Provider value={value}>
      <div style={{ position: 'relative' }} ref={portalRef}>
        {children}
      </div>
    </modalContext.Provider>
  );
};
