import MyChatRoom from '@components/Operation/MyChatRoom/MyChatRoom';
import classnames from 'classnames/bind';
import styles from './MyChatRooms.module.css';
const cx = classnames.bind(styles);

const MyChatRooms = ({ chatRoomIds }: { chatRoomIds: string[] }) => {
  return (
    <div className={cx('container')}>
      <h3>탑승중</h3>
      <ul className={cx('list')}>
        {chatRoomIds.map((id) => (
          <MyChatRoom key={id} chatRoomId={id} />
        ))}
      </ul>
    </div>
  );
};

export default MyChatRooms;
