import { Button, IconButton, Spinner } from '@economic/taco';
import { da } from '../../data/danishCopy';

export type UploadedFile = {
    id: string;
    name: string;
    size: number;
};

type Props = {
    files: UploadedFile[];
    processing: boolean;
    onRemove: (id: string) => void;
    onProcess: () => void;
};

function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} ${da.files.kb}`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${da.files.mb}`;
}

export function UploadedFilesList({ files, processing, onRemove, onProcess }: Props) {
    return (
        <div className="flex flex-col gap-3 w-full h-full min-h-0">
            <ul className="flex flex-col gap-2 w-full flex-1 min-h-0 overflow-y-auto pr-1">
                {files.map((file) => (
                    <li
                        key={file.id}
                        className="flex items-center gap-3 px-3 py-2 bg-white border border-neutral-200 rounded"
                    >
                        <span className="text-sm text-neutral-900 flex-1 truncate">
                            {file.name}
                        </span>
                        <span className="text-xs text-neutral-500 shrink-0">
                            {formatSize(file.size)}
                        </span>
                        <IconButton
                            icon="delete"
                            appearance="discrete"
                            onClick={() => onRemove(file.id)}
                            aria-label={da.actions.remove}
                            disabled={processing}
                        />
                    </li>
                ))}
            </ul>

            {processing ? (
                <div className="flex items-center justify-center gap-2 py-2">
                    <Spinner />
                    <span className="text-sm text-neutral-700">
                        {da.processing.label}
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-end">
                    <Button
                        appearance="primary"
                        onClick={onProcess}
                        disabled={files.length === 0}
                    >
                        {da.actions.process}
                    </Button>
                </div>
            )}
        </div>
    );
}
