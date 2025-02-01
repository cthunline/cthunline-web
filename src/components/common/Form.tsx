import type { MantineStyleProps } from '@mantine/core';

export interface FormProps
    extends Partial<Record<keyof MantineStyleProps, string | number>> {
    ref?: React.Ref<HTMLFormElement>;
    id?: string;
    children?: React.ReactNode;
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
    w?: string | number;
    h?: string | number;
    m?: string | number;
    p?: string | number;
}

const Form = ({
    ref,
    id,
    children,
    onSubmit,
    w = '100%',
    h = 'auto',
    m = 0,
    p = 0
}: FormProps) => (
    <form
        id={id}
        style={{
            width: w,
            height: h,
            margin: m,
            padding: p
        }}
        onSubmit={onSubmit}
        ref={ref}
    >
        {children}
    </form>
);

export default Form;
