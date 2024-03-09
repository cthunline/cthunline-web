import { Button, CircularProgress } from '@mui/material';
import { MdUploadFile } from 'react-icons/md';

interface UploadButtonProps {
    label: string;
    progress: number | null;
    allowedMimeTypes: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton = ({
    label,
    progress,
    allowedMimeTypes,
    onChange
}: UploadButtonProps) =>
    progress ? (
        <CircularProgress variant="determinate" value={progress} />
    ) : (
        <label className="create-button" htmlFor="assets-input">
            <input
                id="assets-input"
                className="hidden"
                type="file"
                multiple
                accept={allowedMimeTypes.join(',')}
                onChange={onChange}
            />
            <Button
                variant="contained"
                size="medium"
                component="span"
                startIcon={<MdUploadFile />}
            >
                {label}
            </Button>
        </label>
    );

export default UploadButton;
