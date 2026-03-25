export const FormBlock = ({ props }: { props: Record<string, unknown> }) => {
    const fields =
        (props.fields as Array<{
            label: string;
            type: string;
            placeholder?: string;
            options?: string[];
        }>) || [];
    return (
        <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
            {typeof props.title === "string" && (
                <h3 className="mb-4 text-lg font-semibold text-white">
                    {props.title}
                </h3>
            )}
            <div className="space-y-3">
                {fields.map((field, i) => (
                    <div key={i}>
                        <label className="mb-1 block text-xs font-medium text-gray-400">
                            {field.label}
                        </label>
                        {field.type === "select" ? (
                            <select className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white">
                                {field.options?.map((opt, j) => (
                                    <option key={j}>{opt}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500"
                            />
                        )}
                    </div>
                ))}
                <button className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
                    Submit
                </button>
            </div>
        </div>
    );
}