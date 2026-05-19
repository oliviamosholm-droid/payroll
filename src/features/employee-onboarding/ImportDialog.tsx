import { useState } from 'react';
import { Dialog, Button, Badge, Spinner, Icon } from '@economic/taco';
import { DropZone } from './DropZone';
import {
    UploadedFilesList,
    type UploadedFile,
} from './UploadedFilesList';
import {
    useEmployees,
    appendEmployees as appendStoreEmployees,
} from '../../store/employeesStore';
import type { Employee } from '../../data/mockEmployees';
import { additionalMockEmployees } from '../../data/additionalEmployees';
import { da } from '../../data/danishCopy';

let importBatch = 0;

type Step = 'idle' | 'analyzing' | 'preview';

type Update = {
    employeeId: string;
    employeeName: string;
    matchType: 'cpr' | 'name';
    newFieldCount: number;
};

type MatchResult = {
    updates: Update[];
    createsCount: number;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProcessed: () => void;
};

function nextId() {
    return `file-${Math.random().toString(36).slice(2, 9)}`;
}

function computeMatches(files: UploadedFile[], employees: Employee[]): MatchResult {
    if (files.length === 0) {
        return { updates: [], createsCount: 0 };
    }
    const pending = employees.filter((e) => e.status === 'pending');
    const matchCount = Math.min(2, files.length, pending.length);
    const updates: Update[] = pending.slice(0, matchCount).map((emp, i) => ({
        employeeId: emp.id,
        employeeName: emp.name,
        matchType: i === 0 ? 'cpr' : 'name',
        newFieldCount: i === 0 ? 4 : 2,
    }));
    const createsCount = Math.max(0, files.length - matchCount);
    return { updates, createsCount };
}

export function ImportDialog({ open, onOpenChange, onProcessed }: Props) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [step, setStep] = useState<Step>('idle');
    const [matches, setMatches] = useState<MatchResult | null>(null);
    const employees = useEmployees();
    const t = da.importDialog;

    const reset = () => {
        setFiles([]);
        setStep('idle');
        setMatches(null);
    };

    const handleFiles = (newFiles: File[]) => {
        setFiles((prev) => [
            ...prev,
            ...newFiles.map((f) => ({ id: nextId(), name: f.name, size: f.size })),
        ]);
    };

    const handleRemove = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const handleProcess = () => {
        setStep('analyzing');
        window.setTimeout(() => {
            setMatches(computeMatches(files, employees));
            setStep('preview');
        }, 2000);
    };

    const handleConfirm = () => {
        if (matches && matches.createsCount > 0) {
            const newOnes: Employee[] = [];
            for (let i = 0; i < matches.createsCount; i++) {
                const template =
                    additionalMockEmployees[
                        (importBatch + i) % additionalMockEmployees.length
                    ];
                newOnes.push({
                    ...template,
                    id: `${template.id}-batch${importBatch}-${i}`,
                    employeeNumber: `${1000 + employees.length + i + 1}`,
                });
            }
            importBatch += matches.createsCount;
            appendStoreEmployees(newOnes);
        }
        onProcessed();
        reset();
        onOpenChange(false);
    };

    const handleBack = () => {
        setStep('idle');
        setMatches(null);
    };

    const handleClose = () => {
        if (step === 'analyzing') return;
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onChange={(next) => {
                if (!next) reset();
                onOpenChange(next);
            }}
            size="md"
            closeOnEscape={step !== 'analyzing'}
        >
            <Dialog.Content aria-label={t.title}>
                <Dialog.Title>{t.title}</Dialog.Title>

                {step === 'preview' && matches ? (
                    <PreviewContent matches={matches} />
                ) : (
                    <div className="flex flex-col gap-4 py-2">
                        <p className="text-sm text-neutral-700">{t.intro}</p>
                        <DropZone onFiles={handleFiles} />
                        {files.length > 0 && (
                            <UploadedFilesList
                                files={files}
                                processing={step === 'analyzing'}
                                onRemove={handleRemove}
                                onProcess={handleProcess}
                            />
                        )}
                        {step === 'analyzing' && (
                            <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                                <Spinner />
                                <span>{t.analyzing}</span>
                            </div>
                        )}
                    </div>
                )}

                <Dialog.Footer>
                    {step === 'preview' ? (
                        <>
                            <Button appearance="default" onClick={handleBack}>
                                {t.actions.back}
                            </Button>
                            <Button appearance="primary" onClick={handleConfirm}>
                                {t.actions.confirm}
                            </Button>
                        </>
                    ) : (
                        <Button
                            appearance="default"
                            onClick={handleClose}
                            disabled={step === 'analyzing'}
                        >
                            {t.actions.cancel}
                        </Button>
                    )}
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog>
    );
}

function PreviewContent({ matches }: { matches: MatchResult }) {
    const p = da.importDialog.preview;
    const total = matches.updates.length + matches.createsCount;
    if (total === 0) {
        return <p className="py-4 text-sm text-neutral-700">{p.empty}</p>;
    }
    return (
        <div className="flex flex-col gap-4 py-2">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                    <Icon name="tick" />
                </span>
                <div className="flex flex-col gap-1">
                    <p className="font-bold text-neutral-900">{p.heading}</p>
                    <p className="text-sm text-neutral-700">{p.sub}</p>
                </div>
            </div>

            {matches.updates.length > 0 && (
                <div className="border border-neutral-200 rounded p-4 flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase text-neutral-500">
                        {p.updatesHeading} · {matches.updates.length}
                    </p>
                    <ul className="flex flex-col gap-2 text-sm">
                        {matches.updates.map((u) => (
                            <li
                                key={u.employeeId}
                                className="flex items-center gap-3"
                            >
                                <Badge color="blue" subtle>
                                    {p.updateBadge}
                                </Badge>
                                <span className="font-bold text-neutral-900">
                                    {u.employeeName}
                                </span>
                                <span className="text-neutral-500">·</span>
                                <span className="text-neutral-700">
                                    {u.matchType === 'cpr' ? p.matchCpr : p.matchName}
                                </span>
                                <span className="text-neutral-500">·</span>
                                <span className="text-neutral-700">
                                    {p.newFields(u.newFieldCount)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {matches.createsCount > 0 && (
                <div className="border border-neutral-200 rounded p-4 flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase text-neutral-500">
                        {p.createsHeading} · {matches.createsCount}
                    </p>
                    <ul className="flex flex-col gap-2 text-sm">
                        {Array.from({ length: matches.createsCount }).map((_, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <Badge color="green" subtle>
                                    {p.createBadge}
                                </Badge>
                                <span className="text-neutral-900">{p.unnamed}</span>
                                <span className="text-neutral-500">·</span>
                                <span className="text-neutral-700">{p.noMatch}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
