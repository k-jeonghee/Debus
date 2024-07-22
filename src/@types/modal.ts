import { ComponentType } from 'react';

export type ModalParameters = {
  onSubmit(value: unknown): unknown;
  onAbort(reason?: string): void;
  actionInfo?: ActionInfo;
};

export type ModalType<P> = {
  element: ComponentType<P>;
  modalId: string;
  resolve: <T extends {}>(value?: T | PromiseLike<T>) => void;
  reject: (reason: string) => void;
  actionInfo?: ActionInfo;
};

export type ModalContentProps<T = unknown> = {
  onSubmit: (result: T) => void;
  onAbort: (error?: string) => void;
};

export type ActionInfo = {
  type: ActionType;
  message: string;
  displayCancel: boolean;
};

export type ActionModalProps<T = unknown> = {
  actionInfo: ActionInfo;
} & ModalContentProps<T>;

export type ModalStyle = 'global' | 'local' | 'alert';
export type ActionType = 'confirm' | 'delete' | 'exit';
