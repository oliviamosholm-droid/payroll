import { Dialog, Button, Badge, Icon, type Color } from '@economic/taco';
import type { Employee, EmployeeStatus } from '../../data/mockEmployees';
import type { UploadedFile } from './UploadedFilesList';
import { da } from '../../data/danishCopy';

type Props = {
    open: boolean;
    onClose: () => void;
    files: UploadedFile[];
    employees: Employee[];
};

const STATUS_COLOR: Record<EmployeeStatus, Color> = {
    pending: 'orange',
    active: 'green',
    resigned: 'grey',
};

const STATUS_LABEL: Record<EmployeeStatus, string> = {
    pending: da.status.pending,
    active: da.status.active,
    resigned: da.status.resigned,
};

function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024)
        return `${Math.max(1, Math.round(bytes / 1024))} ${da.files.kb}`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${da.files.mb}`;
}

export function ProcessingCompletedDialog({
    open,
    onClose,
    files,
    employees,
}: Props) {
    const t = da.processedDialog;

    return (
        <Dialog
            open={open}
            onChange={(next) => {
                if (!next) onClose();
            }}
            size="md"
        >
            <Dialog.Content aria-label={t.title}>
                <Dialog.Title>
                    <span className="inline-flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700">
                            <Icon name="tick" />
                        </span>
                        <span>{t.title}</span>
                    </span>
                </Dialog.Title>

                <div className="flex flex-col gap-4 py-2">
                    <p className="text-sm text-neutral-700">{t.intro}</p>

                    <section className="border border-neutral-200 rounded p-4 flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase text-neutral-500">
                            {t.readDocs} · {files.length}
                        </p>
                        <ul className="flex flex-col gap-2 text-sm">
                            {files.map((f) => (
                                <li
                                    key={f.id}
                                    className="flex items-center gap-3"
                                >
                                    <span className="inline-flex items-center justify-center w-6 h-6 text-neutral-500">
                                        <Icon name="document" />
                                    </span>
                                    <span className="flex-1 truncate text-neutral-900">
                                        {f.name}
                                    </span>
                                    <span className="text-xs text-neutral-500 shrink-0">
                                        {formatSize(f.size)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="border border-neutral-200 rounded p-4 flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase text-neutral-500">
                            {t.createdEmployees} · {employees.length}
                        </p>
                        <ul className="flex flex-col gap-2 text-sm">
                            {employees.map((e) => (
                                <li
                                    key={e.id}
                                    className="flex items-center gap-3"
                                >
                                    <span className="font-bold text-neutral-900">
                                        {e.employeeNumber}
                                    </span>
                                    <span className="flex-1 truncate text-neutral-900">
                                        {e.name}
                                    </span>
                                    <Badge color={STATUS_COLOR[e.status]} subtle>
                                        {STATUS_LABEL[e.status]}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <Dialog.Footer>
                    <Button appearance="primary" onClick={onClose}>
                        {t.continue}
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog>
    );
}
