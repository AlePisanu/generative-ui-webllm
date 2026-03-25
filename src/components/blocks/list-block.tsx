export const ListBlock = ({ props }: { props: Record<string, unknown> }) => {
    const items = (props.items as string[]) || [];
    const Tag = props.ordered ? "ol" : "ul";
    return (
        <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
            {typeof props.title === "string" && (
                <h3 className="mb-3 text-lg font-semibold text-white">
                    {props.title}
                </h3>
            )}
            <Tag
                className={`space-y-1 pl-5 ${props.ordered ? "list-decimal" : "list-disc"}`}
            >
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300">
                        {item}
                    </li>
                ))}
            </Tag>
        </div>
    );
}