import { Close, Description, Root } from '@radix-ui/react-toast';
import { GoAlert } from '@react-icons/all-files/go/GoAlert';
import { GoCheck } from '@react-icons/all-files/go/GoCheck';
import { ToastType } from 'src/context/ToastContext';

const toastType = {
  success: <GoCheck />,
  failure: <GoAlert />,
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
