import { memo } from 'react';
import { ModalParameters, ModalType } from 'src/@types/modal';

const Modal = ({ modal }: { modal: ModalType<ModalParameters> }) => {
  const { element: ModalContainer, resolve, reject, actionInfo } = modal;
  return <ModalContainer onSubmit={resolve} onAbort={reject} actionInfo={actionInfo} />;
};

export default memo(Modal);
