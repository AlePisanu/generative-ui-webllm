export const ChartBlock = ({ props }: { props: Record<string, unknown> }) => {
    const data = (props.data as Array<{ label: string; value: number }>) || [];
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
            {typeof props.title === "string" && (
                <h3 className="mb-4 text-lg font-semibold text-white">
                    {props.title}
                </h3>
            )}
            <div className="space-y-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-20 text-right text-xs text-gray-400 shrink-0">
                            {d.label}
                        </span>
                        <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-blue-600 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${(d.value / max) * 100}%` }}
                            />
                        </div>
                        <span className="w-10 text-xs text-gray-400">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}