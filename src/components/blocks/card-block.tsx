export const CardBlock = ({ props }: { props: Record<string, unknown> }) => {
    const colorMap: Record<string, string> = {
        blue: "border-blue-500 bg-blue-950/40",
        green: "border-green-500 bg-green-950/40",
        purple: "border-purple-500 bg-purple-950/40",
        orange: "border-orange-500 bg-orange-950/40",
        red: "border-red-500 bg-red-950/40",
    };
    const color = (props.color as string) || "blue";
    return (
        <div
            className={`rounded-xl border-l-4 p-4 ${colorMap[color] || colorMap.blue}`}
        >
            {typeof props.title === "string" && (
                <h3 className="mb-2 text-lg font-semibold text-white">
                    {props.title}
                </h3>
            )}
            <p className="text-sm text-gray-300">{String(props.content ?? "")}</p>
        </div>
    );
}