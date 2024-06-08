import { Close, Description, Root } from '@radix-ui/react-toast';
import { GoAlertFill, GoCheckCircleFill } from 'react-icons/go';
import { ToastType } from 'src/context/ToastContext';

const toastType = {
  success: <GoCheckCircleFill />,
  failure: <GoAlertFill />,
};

const Toast = ({ id, type, message, duration, onRemove }: ToastType & { onRemove: (toastId: string) => void }) => {
  return (
    <Root className={`ToastRoot ${type}`} duration={duration ?? 3000}>
      <Description className="ToastDescription">
        <span className="toast-icon">{toastType[type]}</span>
        <p>{message}</p>
      </Description>
      <Close className="btn-close" onClick={() => onRemove(id)}>
        X
      </Close>
    </Root>
  );
};

export default Toast;
