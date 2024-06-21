import Loading from '@components/@common/Loading/Loading';
import ErrorSupport from '@components/Error/ErrorSupport';

import ProtectedRoute from '@pages/ProtectedRoute/ProtectedRoute';
import { Suspense, lazy } from 'react';

import { createBrowserRouter } from 'react-router-dom';
import App from 'src/App';
import { loader } from 'src/api/firebase';

const HomePage = lazy(() => import('@pages/HomePage/HomePage'));
const StationPage = lazy(() => import('@pages/StationPage/StationPage'));
const LinePage = lazy(() => import('@pages/LinePage/LinePage'));
const MyPage = lazy(() => import('@pages/MyPage/MyPage'));
const OperationPage = lazy(() => import('@pages/OperationPage/OperationPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/stations',
        element: (
          <Suspense fallback={<Loading />}>
            <StationPage />,
          </Suspense>
        ),
      },
      {
        path: '/lines/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <LinePage />
          </Suspense>
        ),
      },
      {
        path: '/my-page',
        element: (
          <Suspense fallback={<Loading />}>
            <MyPage />,
          </Suspense>
        ),
      },
      {
        path: '/my-operation/:userId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <OperationPage />
            </Suspense>
          </ProtectedRoute>
        ),
        loader,
        errorElement: <ErrorSupport />,
      },
    ],
  },
  {
    path: '/*',
    element: <h1>404 Page</h1>,
  },
]);
