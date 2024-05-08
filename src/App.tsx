import Header from '@components/Header/Header';
import { darkModeAtom } from '@store/atoms/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAtomValue } from 'jotai';
import { Outlet } from 'react-router-dom';
import { ModalProvider } from 'src/context/ModalContext';

export const queryClient = new QueryClient();

function App() {
  const darkMode = useAtomValue(darkModeAtom);
  return (
    <ModalProvider>
      <QueryClientProvider client={queryClient}>
        <div id="app" className={darkMode ? 'dark' : 'light'}>
          <Header />
          <div className="container">
            <Outlet />
          </div>
        </div>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </ModalProvider>
  );
}

export default App;
