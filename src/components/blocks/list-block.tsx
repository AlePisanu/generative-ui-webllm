export const ListBlock = ({ props }: { props: Record<string, unknown> }) => {
    const items = (props.items as string[]) || [];
    const ordered = !!props.ordered;

    return (
        <div className="block">
            {typeof props.title === "string" && (
                <h3 className="block-title">{props.title}</h3>
            )}
            {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-border py-2 last:border-0">
                    <span className="mt-0.5 w-5 shrink-0 text-right font-mono text-[11px] text-text-3">
                        {ordered ? `${i + 1}.` : "\u2022"}
                    </span>
                    <span className="text-sm leading-relaxed text-text-2">{item}</span>
                </div>
            ))}
        </div>
    );
}
