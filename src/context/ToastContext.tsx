import Toast from '@components/@common/Toast/Toast';
import { Provider, Viewport } from '@radix-ui/react-toast';
import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { assert } from 'src/utils/assert';

export type ToastContextValue = {
  toasts: ToastType[];
  add: (toast: Omit<ToastType, 'id'>) => void;
  remove: (toastId: string) => void;
};

export type ToastType = {
  id: string;
  type: 'success' | 'failure';
  message: string;
  duration?: number;
};

export const toastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const add = useCallback((toast: Omit<ToastType, 'id'>) => {
    const newToast = {
      id: Date.now().toString(),
      ...toast,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const remove = useCallback((toastId: string) => setToasts((prev) => prev.filter((v) => v.id !== toastId)), []);

  const value = useMemo(
    () => ({
      toasts,
      add,
      remove,
    }),
    [toasts, add, remove],
  );

  return (
    <toastContext.Provider value={value}>
      <Provider>
        {children}
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onRemove={remove} />
        ))}
        <Viewport className="ToastViewport" />
      </Provider>
    </toastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(toastContext);
  assert(context !== null, 'toastContext is Null');
  return context;
};
