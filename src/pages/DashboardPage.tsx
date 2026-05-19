export function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
                <p className="text-neutral-500 text-sm">Overview and key metrics — replace this with your widgets.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Metric A', 'Metric B', 'Metric C'].map((label) => (
                    <div
                        key={label}
                        className="border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center h-28 text-neutral-400 text-sm"
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center min-h-48 text-neutral-400 text-sm">
                Main chart / table area
            </div>
        </div>
    );
}
