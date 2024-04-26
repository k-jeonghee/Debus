import Button from '@components/@common/Button/Button';
import ModalButtonGroup from '@components/@common/Modal/ModalTemplate/ModalButtonGroup';
import ModalContent from '@components/@common/Modal/ModalTemplate/ModalContent';
import ModalHeader from '@components/@common/Modal/ModalTemplate/ModalHeader';
import ModalTemplate from '@components/@common/Modal/ModalTemplate/ModalTemplate';
import classnames from 'classnames/bind';
import { AlertModalProps } from 'src/@types/modal';
import styles from './AlertModal.module.css';
const cx = classnames.bind(styles);

const displayName = {
    confirm: '확인',
    delete: '삭제',
};

const AlertModal = ({ alertType, desc, onSubmit, onAbort }: AlertModalProps) => {
    const handleClick = () => onSubmit?.(true);
    return (
        <ModalTemplate isOverlay={true} styleType="alert" transparent={true}>
            <ModalHeader onClose={onAbort} />
            <ModalContent>
                <p className={cx('desc')}>{desc}</p>
                <ModalButtonGroup>
                    <Button text="취소" variant="default" onClick={onAbort} />
                    <Button text={displayName[alertType]} variant={alertType} type="submit" onClick={handleClick} />
                </ModalButtonGroup>
            </ModalContent>
        </ModalTemplate>
    );
};

export default AlertModal;
