import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button, Menu, Icon } from '@economic/taco';
import { EmptyState } from '../features/employee-onboarding/EmptyState';
import { DropZone } from '../features/employee-onboarding/DropZone';
import {
    UploadedFilesList,
    type UploadedFile,
} from '../features/employee-onboarding/UploadedFilesList';
import { EmployeeDraftsTable } from '../features/employee-onboarding/EmployeeDraftsTable';
import { ImportDialog } from '../features/employee-onboarding/ImportDialog';
import { mockEmployees, type Employee } from '../data/mockEmployees';
import {
    setEmployees as setStoreEmployees,
    useEmployees,
} from '../store/employeesStore';
import { da } from '../data/danishCopy';
import { useVariantPaths } from '../paths';
import { EmployeeEditDialogV2 } from '../features/employee-onboarding/EmployeeEditDialogV2';
import { EmployeeEditDialogScheduleV1 } from '../features/employee-onboarding/EmployeeEditDialogScheduleV1';
import { ProcessingCompletedDialog } from '../features/employee-onboarding/ProcessingCompletedDialog';

type DemoState = 'empty' | 'uploaded' | 'processed';

const VALID_STATES: DemoState[] = ['empty', 'uploaded', 'processed'];

const PRESET_FILES: UploadedFile[] = [
    { id: 'file-1', name: 'Lønsedler_marts_2026.pdf', size: 248_320 },
    { id: 'file-2', name: 'Medarbejdere_oversigt.xlsx', size: 52_140 },
];

function nextFileId() {
    return `file-${Math.random().toString(36).slice(2, 9)}`;
}

type Props = {
    editMode?: 'page' | 'modal' | 'schedule';
};

export function EmployeeListPage({ editMode = 'page' }: Props = {}) {
    const isModalMode = editMode === 'modal' || editMode === 'schedule';
    const variantPaths = useVariantPaths();
    const [searchParams, setSearchParams] = useSearchParams();
    const stateParam = searchParams.get('state') as DemoState | null;
    const initialState: DemoState = stateParam && VALID_STATES.includes(stateParam)
        ? stateParam
        : 'empty';

    const [demoState, setDemoState] = useState<DemoState>(initialState);
    const [files, setFiles] = useState<UploadedFile[]>(
        initialState === 'uploaded' || initialState === 'processed' ? PRESET_FILES : []
    );
    const [processing, setProcessing] = useState(false);
    const employees = useEmployees();
    const [importOpen, setImportOpen] = useState(false);
    const navigate = useNavigate();

    // Seed the store from the demo state on first mount.
    useEffect(() => {
        if (initialState === 'processed' && employees.length === 0) {
            setStoreEmployees(mockEmployees);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (stateParam !== demoState) {
            const params = new URLSearchParams(searchParams);
            if (demoState === 'empty') params.delete('state');
            else params.set('state', demoState);
            setSearchParams(params, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demoState]);

    const visibleEmployees = useMemo(
        () => (demoState === 'processed' ? employees : []),
        [demoState, employees]
    );

    const handleFiles = (newFiles: File[]) => {
        const mapped: UploadedFile[] = newFiles.map((f) => ({
            id: nextFileId(),
            name: f.name,
            size: f.size,
        }));
        setFiles((prev) => [...prev, ...mapped]);
        setDemoState('uploaded');
    };

    const handleRemove = (id: string) => {
        setFiles((prev) => {
            const next = prev.filter((f) => f.id !== id);
            if (next.length === 0) setDemoState('empty');
            return next;
        });
    };

    const handleProcess = () => {
        setProcessing(true);
        const filesSnapshot = files;
        window.setTimeout(() => {
            setProcessing(false);
            setStoreEmployees(mockEmployees);
            setDemoState('processed');
            if (editMode === 'modal') {
                setProcessedSummary({
                    files: filesSnapshot,
                    employees: mockEmployees,
                });
            }
        }, 2000);
    };

    // Dialog now handles appending itself; this is a no-op confirmation hook.
    const handleImportComplete = () => {};

    const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);
    const [processedSummary, setProcessedSummary] = useState<{
        files: UploadedFile[];
        employees: Employee[];
    } | null>(null);

    const handleRowClick = (employee: Employee) => {
        if (isModalMode) {
            setModalEmployee(employee);
        } else {
            navigate(variantPaths.employee(employee.id));
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-normal leading-9 text-neutral-900">
                    {da.page.title}
                </h1>
                {demoState === 'processed' && (
                    <Link
                        to={variantPaths.optionsPreview}
                        className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                    >
                        {da.options.viewLink}
                    </Link>
                )}
            </div>

            {demoState === 'processed' ? (
                <>
                    <div className="flex items-center gap-2">
                        <Button
                            appearance="primary"
                            menu={(props) => (
                                <Menu {...props}>
                                    <Menu.Content>
                                        <Menu.Item>
                                            {da.actions.createManually}
                                        </Menu.Item>
                                        <Menu.Item
                                            onClick={() => setImportOpen(true)}
                                        >
                                            <span className="inline-flex items-center justify-between gap-3 w-full">
                                                <span>{da.actions.quickCreate}</span>
                                                <Icon name="ai-stars" />
                                            </span>
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu>
                            )}
                        >
                            {da.actions.addEmployee}
                        </Button>
                    </div>
                    <EmployeeDraftsTable
                        employees={visibleEmployees}
                        onRowClick={handleRowClick}
                    />
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <Button
                            appearance="primary"
                            menu={(props) => (
                                <Menu {...props}>
                                    <Menu.Content>
                                        <Menu.Item>
                                            {da.actions.createManually}
                                        </Menu.Item>
                                        <Menu.Item
                                            onClick={() => setImportOpen(true)}
                                        >
                                            <span className="inline-flex items-center justify-between gap-3 w-full">
                                                <span>{da.actions.quickCreate}</span>
                                                <Icon name="ai-stars" />
                                            </span>
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu>
                            )}
                        >
                            {da.actions.addEmployee}
                        </Button>
                        <Button
                            appearance="default"
                            menu={(props) => (
                                <Menu {...props}>
                                    <Menu.Content>
                                        <Menu.Item disabled>
                                            {da.actions.morePlaceholder}
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu>
                            )}
                        >
                            {da.actions.more}
                        </Button>
                    </div>
                    <div className="mx-auto w-full max-w-[568px] flex flex-col gap-4">
                    <div className="rounded-[10px] p-6 flex flex-col gap-2 bg-white max-h-[calc(100vh-240px)] overflow-hidden">
                        <EmptyState compact={demoState === 'uploaded'} />
                        <DropZone onFiles={handleFiles} />
                        {demoState === 'uploaded' && (
                            <div className="mt-2 flex-1 min-h-0 overflow-hidden">
                                <UploadedFilesList
                                    files={files}
                                    processing={processing}
                                    onRemove={handleRemove}
                                    onProcess={handleProcess}
                                />
                            </div>
                        )}
                    </div>
                    </div>
                </>
            )}

            <ImportDialog
                open={importOpen}
                onOpenChange={setImportOpen}
                onProcessed={handleImportComplete}
            />

            {editMode === 'modal' && (
                <>
                    <EmployeeEditDialogV2
                        employee={modalEmployee}
                        onClose={() => setModalEmployee(null)}
                    />
                    <ProcessingCompletedDialog
                        open={processedSummary !== null}
                        onClose={() => setProcessedSummary(null)}
                        files={processedSummary?.files ?? []}
                        employees={processedSummary?.employees ?? []}
                    />
                </>
            )}

            {editMode === 'schedule' && (
                <EmployeeEditDialogScheduleV1
                    employee={modalEmployee}
                    onClose={() => setModalEmployee(null)}
                />
            )}
        </div>
    );
}
