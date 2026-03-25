export const StatBlock = ({ props }: { props: Record<string, unknown> }) => {
    const trendColor =
        props.trend === "up"
            ? "text-green-400"
            : props.trend === "down"
                ? "text-red-400"
                : "text-gray-400";
    const trendIcon =
        props.trend === "up" ? "↑" : props.trend === "down" ? "↓" : "→";
    return (
        <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-400">
                {String(props.label ?? "")}
            </p>
            <p className="mt-1 text-3xl font-bold text-white">
                {String(props.value ?? "")}
            </p>
            {typeof props.change === "string" && (
                <p className={`mt-1 text-sm ${trendColor}`}>
                    {trendIcon} {props.change}
                </p>
            )}
        </div>
    );
}