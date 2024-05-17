import Modal from '@components/@common/Modal/Modal';
import ModalPortal from '@components/@common/Modal/ModalPortal';
import { ComponentType, useCallback, useContext, useEffect, useId } from 'react';
import { ActionInfo } from 'src/@types/modal';
import { modalContext } from 'src/context/ModalContext';
import { assert } from 'src/utils/assert';

export const useModal = () => {
  const context = useContext(modalContext);
  assert(context !== null, 'modalContext is null');

  const { modals, open, close, portalRef } = context;
  const modalId = useId();
  const closeModal = useCallback(() => close(modalId), [modalId, close]);
  const openModal = useCallback(
    <P extends { onSubmit(value: unknown): unknown }>(Component: ComponentType<P>, actionInfo?: ActionInfo) =>
      new Promise<Parameters<P['onSubmit']>[0]>((resolve, reject) => {
        const modal = {
          element: Component,
          modalId,
          resolve: <T extends {}>(value?: T) => {
            resolve(value);
            closeModal();
          },
          reject: (reason?: Error) => {
            reject(reason);
            closeModal();
          },
          actionInfo: actionInfo && {
            type: actionInfo.type,
            message: actionInfo.message,
          },
        };
        open(modal);
      }),
    [modalId, open, closeModal],
  );

  const ModalContainer = useCallback(() => {
    const modal = modals.find((modal) => modal.modalId === modalId);
    return modal ? (
      <ModalPortal portalContainer={portalRef.current}>
        <Modal modal={modal} />
      </ModalPortal>
    ) : (
      <></>
    );
  }, [modals, modalId, portalRef]);

  useEffect(() => closeModal, [closeModal]);
  return { openModal, closeModal, ModalContainer };
};
