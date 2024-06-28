import { baseAuthAtom } from '@store/atoms/auth';
import { useAtomValue } from 'jotai';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const user = useAtomValue(baseAuthAtom);
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
