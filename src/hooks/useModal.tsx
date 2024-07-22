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
      new Promise<{ ok: boolean; value?: Parameters<P['onSubmit']>[0]; error?: string }>((resolve) => {
        const modal = {
          element: Component,
          modalId,
          resolve: <T extends {}>(value?: T) => {
            resolve({ ok: true, value });
            closeModal();
          },
          reject: (reason?: string) => {
            resolve({ ok: false, error: reason });
            closeModal();
          },
          actionInfo: actionInfo && {
            type: actionInfo.type,
            message: actionInfo.message,
            displayCancel: actionInfo.displayCancel,
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
