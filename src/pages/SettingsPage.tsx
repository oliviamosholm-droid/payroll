export function SettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold mb-1">Settings</h1>
                <p className="text-neutral-500 text-sm">Application configuration — replace this with your settings panels.</p>
            </div>

            <div className="flex flex-col gap-4">
                {['General', 'Appearance', 'Notifications'].map((section) => (
                    <div
                        key={section}
                        className="border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center h-20 text-neutral-400 text-sm"
                    >
                        {section} settings
                    </div>
                ))}
            </div>
        </div>
    );
}
