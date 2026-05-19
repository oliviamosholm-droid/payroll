import { Banner } from '@economic/taco';
import { da } from '../data/danishCopy';

type Props = {
    title: string;
};

export function PlaceholderPage({ title }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-normal leading-9 text-neutral-900">
                {title}
            </h1>
            <Banner state="information">
                <div className="flex flex-col gap-1">
                    <strong>{da.placeholder.title}</strong>
                    <p>{da.placeholder.body}</p>
                </div>
            </Banner>
        </div>
    );
}
