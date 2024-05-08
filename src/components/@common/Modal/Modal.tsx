import { createElement, memo } from 'react';
import { ModalType } from 'src/@types/modal';

const Modal = ({ modal }: { modal: ModalType }) => {
  const { element, resolve, reject } = modal;
  return <>{createElement(element.type, { onSubmit: resolve, onAbort: reject })}</>;
};

export default memo(Modal);
