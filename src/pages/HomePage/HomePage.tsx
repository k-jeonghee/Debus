import Loading from '@components/@common/Loading/Loading';
import ChatRooms from '@components/Chat/ChatRooms';
import { Suspense } from 'react';

const HomePage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ChatRooms />
    </Suspense>
  );
};

export default HomePage;
