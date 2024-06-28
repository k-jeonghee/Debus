import ErrorFallback from '@components/Error/ErrorFallback';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import Header from '@components/Header/Header';
import { darkModeAtom } from '@store/atoms/theme';
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAtomValue } from 'jotai';
import { Outlet } from 'react-router-dom';
import { ModalProvider } from 'src/context/ModalContext';
import { ToastProvider } from 'src/context/ToastContext';

export const queryClient = new QueryClient();

function App() {
  const darkMode = useAtomValue(darkModeAtom);
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ToastProvider>
      <ModalProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary Fallback={ErrorFallback} onReset={reset}>
            <main id="app" className={darkMode ? 'dark' : 'light'}>
              <Header />
              <div className="container">
                <Outlet />
              </div>
            </main>
          </ErrorBoundary>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </ModalProvider>
    </ToastProvider>
  );
}

export default App;
