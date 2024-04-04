import { Box, Group, TextInput, Title } from '@mantine/core';

interface SectionTitleProps {
    text: string;
    iconBefore?: JSX.Element;
    iconAfter?: JSX.Element;
    input?: SectionTitleInputOptions;
    mb?: number | string;
    mt?: number | string;
}

interface SectionTitleInputOptions {
    value: any;
    readonly?: boolean;
    onChange?: (value: any) => void;
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
            <Box className="ml-20" component="span">
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
            </Box>
        )}
    </Group>
);

export default SectionTitle;
