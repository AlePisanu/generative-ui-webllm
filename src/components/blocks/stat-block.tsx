const trends: Record<string, { className: string; arrow: string }> = {
    up: { className: "text-emerald-400 bg-emerald-400/10", arrow: "\u2197" },
    down: { className: "text-red-400 bg-red-400/10", arrow: "\u2198" },
};

export const StatBlock = ({ props }: { props: Record<string, unknown> }) => {
    const trend = trends[props.trend as string];
    const change = props.change as string | undefined;

    return (
        <div className="block">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-3">
                    {String(props.label ?? "")}
                </p>
                {trend && change && (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${trend.className}`}>
                        {trend.arrow} {change}
                    </span>
                )}
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
                {String(props.value ?? "")}
            </p>
        </div>
    );
}
