const barColors = [
    "bg-accent", "bg-blue-400", "bg-emerald-400",
    "bg-violet-400", "bg-orange-400", "bg-rose-400",
    "bg-amber-400", "bg-cyan-400",
];

const parseNumber = (v: unknown): number => {
    if (typeof v === "number") return v;
    if (typeof v !== "string") return 0;
    const cleaned = v.replace(/[^0-9.\-]/g, "");
    return parseFloat(cleaned) || 0;
};

export const ChartBlock = ({ props }: { props: Record<string, unknown> }) => {
    const raw = (props.data as Array<{ label: string; value: unknown }>) || [];
    const data = raw.map((d) => ({ label: d.label, value: parseNumber(d.value) }));
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="block">
            {typeof props.title === "string" && (
                <h3 className="block-title mb-5">{props.title}</h3>
            )}
            <div className="flex h-40 items-end gap-3">
                {data.map((d, i) => (
                    <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <span className="text-[11px] font-medium tabular-nums text-text-2">
                            {d.value}
                        </span>
                        <div
                            className={`w-full rounded-t-md ${barColors[i % barColors.length]} opacity-80`}
                            style={{ height: `${(d.value / max) * 100}%` }}
                        />
                        <span className="max-w-full truncate text-[10px] text-text-3">
                            {d.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
