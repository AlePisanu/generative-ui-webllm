export const TextBlock = ({ props }: { props: Record<string, unknown> }) => {
    const variant = props.variant as string;
    const text = String(props.content ?? "");
    if (variant === "heading")
        return (
            <h2 className="text-xl font-bold text-white">
                {text}
            </h2>
        );
    if (variant === "quote")
        return (
            <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-300">
                {text}
            </blockquote>
        );
    return <p className="text-sm text-gray-300">{text}</p>;
}