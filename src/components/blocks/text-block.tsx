export const TextBlock = ({ props }: { props: Record<string, unknown> }) => {
    const variant = props.variant as string;
    const text = String(props.content ?? "");

    if (variant === "heading") {
        return <h2 className="text-lg font-semibold tracking-tight">{text}</h2>;
    }

    if (variant === "quote") {
        return (
            <blockquote className="border-l-2 border-accent/40 py-1 pl-4 text-sm italic text-text-2">
                {text}
            </blockquote>
        );
    }

    return <p className="text-sm leading-relaxed text-text-2">{text}</p>;
}
