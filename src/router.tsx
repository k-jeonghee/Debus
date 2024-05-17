import Loading from '@components/@common/Loading/Loading';
import HomePage from '@pages/HomePage/HomePage';
import LinePage from '@pages/LinePage/LinePage';
import MyPage from '@pages/MyPage/MyPage';
import OperationPage from '@pages/OperationPage/OperationPage';
import StationPage from '@pages/StationPage/StationPage';
import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from 'src/App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/stations',
        element: <StationPage />,
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
        element: <MyPage />,
      },
    ],
  },
  {
    path: '/my-operation',
    element: <OperationPage />,
  },
]);
