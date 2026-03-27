const colors: Record<string, string> = {
    blue: "bg-blue-400",
    green: "bg-emerald-400",
    purple: "bg-violet-400",
    orange: "bg-orange-400",
    red: "bg-red-400",
};

export const CardBlock = ({ props }: { props: Record<string, unknown> }) => {
    const stripe = colors[(props.color as string)] || colors.blue;

    return (
        <div className="block overflow-hidden !p-0">
            <div className={`h-1 ${stripe}`} />
            <div className="p-5">
                {typeof props.title === "string" && (
                    <h3 className="block-title">{props.title}</h3>
                )}
                <p className="text-sm leading-relaxed text-text-2">
                    {String(props.content ?? "")}
                </p>
            </div>
        </div>
    );
}
