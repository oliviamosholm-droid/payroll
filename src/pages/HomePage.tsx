export function HomePage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold mb-1">Home</h1>
                <p className="text-neutral-500 text-sm">Your starting point — replace this with your content.</p>
            </div>

            <div className="border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center min-h-64 text-neutral-400 text-sm">
                Content area
            </div>
        </div>
    );
}
