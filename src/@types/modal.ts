import { ComponentType } from 'react';

export type ModalParameters = {
  onSubmit(value: unknown): unknown;
  onAbort(reason?: Error): void;
  actionInfo?: ActionInfo;
};

export type ModalType<P> = {
  element: ComponentType<P>;
  modalId: string;
  resolve: <T extends {}>(value?: T | PromiseLike<T>) => void;
  reject: (reason?: Error) => void;
  actionInfo?: ActionInfo;
};

export type ModalContentProps<T = unknown> = {
  onSubmit: (result: T) => void;
  onAbort: (error?: Error) => void;
};

export type ActionInfo = {
  type: ActionType;
  message: string;
};

export type ActionModalProps<T = unknown> = {
  actionInfo: ActionInfo;
} & ModalContentProps<T>;

export type ModalStyle = 'global' | 'local' | 'alert';
export type ActionType = 'confirm' | 'delete' | 'exit';
