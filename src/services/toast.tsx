import { type NotificationData, notifications } from '@mantine/notifications';
import { FaCheck, FaExclamation, FaInfo, FaXmark } from 'react-icons/fa6';

export type ToastIntent = 'info' | 'success' | 'warning' | 'error';

const notificationPresets: Record<
    ToastIntent,
    Pick<NotificationData, 'color' | 'icon'>
> = {
    info: {
        color: 'blue',
        icon: <FaInfo />
    },
    success: {
        color: 'green',
        icon: <FaCheck />
    },
    warning: {
        color: 'yellow',
        icon: <FaXmark />
    },
    error: {
        color: 'red',
        icon: <FaExclamation />
    }
};

export interface ToastOptions {
    title?: string;
    message: string;
}

export interface ShowToastOptions extends ToastOptions {
    intent: ToastIntent;
}

const showToast = ({ title, message, intent }: ShowToastOptions) => {
    notifications.show({
        title,
        message,
        ...notificationPresets[intent]
    });
};

export const toast: Record<
    ToastIntent,
    (options: string | ToastOptions) => void
> = {
    info: (options) =>
        showToast({
            ...(typeof options === 'string' ? { message: options } : options),
            intent: 'info'
        }),
    success: (options) =>
        showToast({
            ...(typeof options === 'string' ? { message: options } : options),
            intent: 'success'
        }),
    warning: (options) =>
        showToast({
            ...(typeof options === 'string' ? { message: options } : options),
            intent: 'warning'
        }),
    error: (options) =>
        showToast({
            ...(typeof options === 'string' ? { message: options } : options),
            intent: 'error'
        })
};
