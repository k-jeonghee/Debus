export type ModalType = {
    element: JSX.Element;
    modalId: string;
    resolve: <T extends {}>(value?: T | PromiseLike<T>) => void;
    reject: (reason?: Error) => void;
};

export type ModalProps = {
    onClose: () => void;
};

export type ModalContentProps<T = unknown> = {
    onSubmit: (result: T) => void; // then
    onAbort: (error?: Error) => void; // catch
};

export type ActionModalProps = {
    actionType: ActionType;
    desc: string;
    onSubmit?: (result: boolean) => void; // then
    onAbort?: (error?: Error) => void; // catch
};

export type ModalStyle = 'global' | 'local' | 'alert';
export type ActionType = 'confirm' | 'delete';
