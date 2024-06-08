import { User } from 'firebase/auth';
import { PropsWithChildren } from 'react';
import { Navigate, useLoaderData, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const user = useLoaderData() as User;
  const { userId } = useParams();

  if (!user || user.uid !== userId) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
