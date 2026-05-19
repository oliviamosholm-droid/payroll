import { Link } from 'react-router-dom';
import { Badge, Button, IconButton, Icon } from '@economic/taco';
import { da } from '../data/danishCopy';
import { useVariantPaths } from '../paths';

function SectionCard({
    title,
    tag,
    body,
    children,
}: {
    title: string;
    tag: string;
    body: string;
    children: React.ReactNode;
}) {
    return (
        <section className="border border-neutral-200 rounded-lg bg-white overflow-hidden">
            <header className="px-6 py-4 border-b border-neutral-200">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
                    <span className="inline-flex items-center text-xs font-bold text-neutral-700 bg-yellow-100 px-2 py-1 rounded">
                        {tag}
                    </span>
                </div>
                <p className="text-sm text-neutral-700 mt-2 max-w-2xl">{body}</p>
            </header>
            <div className="px-6 py-6 bg-neutral-50">{children}</div>
        </section>
    );
}

function Option1Mockup() {
    return (
        <div className="bg-white border border-neutral-200 rounded overflow-hidden text-sm">
            <table className="w-full">
                <thead className="bg-neutral-50">
                    <tr className="text-left text-xs uppercase text-neutral-500">
                        <th className="px-3 py-2 font-bold">Nr.</th>
                        <th className="px-3 py-2 font-bold">Navn</th>
                        <th className="px-3 py-2 font-bold">CPR-nr.</th>
                        <th className="px-3 py-2 font-bold">Status</th>
                        <th className="px-3 py-2 font-bold w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-neutral-200">
                        <td className="px-3 py-2">1001</td>
                        <td className="px-3 py-2">Anders Sørensen</td>
                        <td className="px-3 py-2">120385-1234</td>
                        <td className="px-3 py-2">
                            <Badge color="orange" subtle>
                                {da.status.pending}
                            </Badge>
                        </td>
                        <td className="px-3 py-2 text-right"></td>
                    </tr>
                    <tr className="border-t border-neutral-200 bg-blue-50/40 relative">
                        <td className="px-3 py-2">1002</td>
                        <td className="px-3 py-2 font-bold">Mette Jensen</td>
                        <td className="px-3 py-2">240791-5678</td>
                        <td className="px-3 py-2">
                            <Badge color="orange" subtle>
                                {da.status.pending}
                            </Badge>
                        </td>
                        <td className="px-3 py-2 text-right">
                            <div className="inline-flex items-center gap-2">
                                <span className="px-2 py-1 text-xs bg-white border border-dashed border-[#75A0F5] rounded text-neutral-700 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1">
                                        <Icon name="attach" />
                                        {da.options.opt1.tooltip}
                                    </span>
                                </span>
                                <IconButton
                                    icon="attach"
                                    appearance="discrete"
                                    aria-label={da.options.opt1.tooltip}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr className="border-t border-neutral-200">
                        <td className="px-3 py-2">1003</td>
                        <td className="px-3 py-2">Lars Nielsen</td>
                        <td className="px-3 py-2">030278-9012</td>
                        <td className="px-3 py-2">
                            <Badge color="orange" subtle>
                                {da.status.pending}
                            </Badge>
                        </td>
                        <td className="px-3 py-2 text-right"></td>
                    </tr>
                </tbody>
            </table>
            <p className="px-3 py-2 text-xs text-neutral-500 italic bg-white border-t border-neutral-200">
                Den fremhævede række viser hover-tilstand: drop-mål + handlingsknap.
            </p>
        </div>
    );
}

function Option2Mockup() {
    return (
        <div className="bg-white border border-neutral-200 rounded shadow-md max-w-2xl mx-auto">
            <div className="px-6 py-4 border-b border-neutral-200">
                <h3 className="font-bold text-neutral-900">
                    {da.importDialog.title}
                </h3>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700">
                        <Icon name="tick" />
                    </span>
                    <span className="font-bold">{da.options.opt2.previewLabel}</span>
                </div>

                <div className="border border-neutral-200 rounded p-4 flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase text-neutral-500">
                        {da.options.opt2.updateLabel}
                    </p>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li className="flex items-center gap-3">
                            <Badge color="blue" subtle>opdateres</Badge>
                            <span>{da.options.opt2.update1}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Badge color="blue" subtle>opdateres</Badge>
                            <span>{da.options.opt2.update2}</span>
                        </li>
                    </ul>
                </div>

                <div className="border border-neutral-200 rounded p-4 flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase text-neutral-500">
                        {da.options.opt2.createLabel}
                    </p>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li className="flex items-center gap-3">
                            <Badge color="green" subtle>nyt</Badge>
                            <span>{da.options.opt2.create1}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-2">
                <Button appearance="default">{da.actions.cancel}</Button>
                <Button appearance="primary">{da.actions.process}</Button>
            </div>
        </div>
    );
}

function Option3Mockup() {
    return (
        <div className="bg-white border border-neutral-200 rounded shadow-md max-w-3xl mx-auto">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center gap-3">
                <h3 className="font-bold text-neutral-900">Mette Jensen</h3>
                <Badge color="orange" subtle>{da.status.pending}</Badge>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
                <div className="rounded-[10px] border border-dashed border-[#75A0F5] bg-[rgba(222,235,255,0.4)] p-4">
                    <p className="text-sm font-bold text-neutral-900 mb-1">
                        {da.options.opt3.attachLabel}
                    </p>
                    <p className="text-xs text-neutral-700">
                        {da.options.opt3.attachHint}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs font-bold mb-1">
                            {da.editDialog.fields.cpr}*
                        </p>
                        <div className="bg-yellow-100 border border-neutral-300 rounded px-2 py-1 text-sm">
                            240791-5678
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold mb-1">
                            {da.editDialog.fields.fullName}*
                        </p>
                        <div className="bg-yellow-100 border border-neutral-300 rounded px-2 py-1 text-sm">
                            Mette Jensen
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold mb-1">
                            {da.editDialog.fields.email}
                        </p>
                        <div className="bg-yellow-100 border-2 border-yellow-400 rounded px-2 py-1 text-sm">
                            mette@cafevirksomhed.dk
                        </div>
                        <p className="text-[10px] text-yellow-700 mt-1 font-bold">
                            Tilføjet fra: lønseddel_marts.pdf
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-bold mb-1">
                            {da.editDialog.fields.address}*
                        </p>
                        <div className="bg-white border border-neutral-300 rounded px-2 py-1 text-sm text-neutral-400">
                            —
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-2">
                <Button appearance="default">{da.editDialog.actions.cancel}</Button>
                <Button appearance="primary">{da.editDialog.actions.save}</Button>
            </div>
        </div>
    );
}

export function OptionsPreviewPage() {
    const variantPaths = useVariantPaths();
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Link
                    to={variantPaths.employees}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline self-start"
                >
                    ← {da.options.backToList}
                </Link>
                <h1 className="text-3xl font-normal leading-9 text-neutral-900">
                    {da.options.pageTitle}
                </h1>
                <p className="text-sm text-neutral-700 max-w-2xl">
                    {da.options.intro}
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <SectionCard
                    title={da.options.opt1.title}
                    tag={da.options.opt1.tag}
                    body={da.options.opt1.body}
                >
                    <Option1Mockup />
                </SectionCard>

                <SectionCard
                    title={da.options.opt2.title}
                    tag={da.options.opt2.tag}
                    body={da.options.opt2.body}
                >
                    <Option2Mockup />
                </SectionCard>

                <SectionCard
                    title={da.options.opt3.title}
                    tag={da.options.opt3.tag}
                    body={da.options.opt3.body}
                >
                    <Option3Mockup />
                </SectionCard>
            </div>
        </div>
    );
}
