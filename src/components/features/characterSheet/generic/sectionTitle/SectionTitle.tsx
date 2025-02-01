import { Group, TextInput, Title } from '@mantine/core';

interface SectionTitleProps {
    text: string;
    iconBefore?: React.ReactElement;
    iconAfter?: React.ReactElement;
    input?: SectionTitleInputOptions;
    mb?: number | string;
    mt?: number | string;
}

interface SectionTitleInputOptions {
    value: number;
    readonly?: boolean;
    onChange?: (value: number) => void;
}

const SectionTitle = ({
    text,
    iconBefore,
    iconAfter,
    input,
    mb,
    mt
}: SectionTitleProps) => (
    <Group justify="start" align="center" gap="0.5rem" mb={mb} mt={mt}>
        {iconBefore}
        <Title order={4} mb={mb} mt={mt}>
            {text}
        </Title>
        {iconAfter}
        {!!input && (
            <TextInput
                w="4.5rem"
                readOnly={input.readonly}
                size="sm"
                value={input.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (input.onChange) {
                        input.onChange(Number(e.target.value));
                    }
                }}
            />
        )}
    </Group>
);

export default SectionTitle;
