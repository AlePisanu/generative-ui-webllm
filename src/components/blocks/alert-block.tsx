const variants: Record<string, { border: string; bg: string; title: string; dot: string }> = {
    info: { border: "border-blue-400/30", bg: "bg-blue-400/5", title: "text-blue-400", dot: "bg-blue-400" },
    success: { border: "border-emerald-400/30", bg: "bg-emerald-400/5", title: "text-emerald-400", dot: "bg-emerald-400" },
    warning: { border: "border-amber-400/30", bg: "bg-amber-400/5", title: "text-amber-400", dot: "bg-amber-400" },
    error: { border: "border-red-400/30", bg: "bg-red-400/5", title: "text-red-400", dot: "bg-red-400" },
};

export const AlertBlock = ({ props }: { props: Record<string, unknown> }) => {
    const v = variants[(props.variant as string)] || variants.info;

    return (
        <div className={`rounded-xl border p-4 ${v.border} ${v.bg}`}>
            <div className="flex items-start gap-3">
                <span className={`dot mt-1 ${v.dot}`} />
                <div>
                    {typeof props.title === "string" && (
                        <p className={`text-sm font-semibold ${v.title}`}>{props.title}</p>
                    )}
                    <p className="text-sm leading-relaxed text-text-2">
                        {String(props.message ?? "")}
                    </p>
                </div>
            </div>
        </div>
    );
}
