export const FormBlock = ({ props }: { props: Record<string, unknown> }) => {
    const fields = (props.fields as Array<{
        label: string;
        type: string;
        placeholder?: string;
        options?: string[];
    }>) || [];

    return (
        <div className="block">
            {typeof props.title === "string" && (
                <h3 className="block-title">{props.title}</h3>
            )}
            <div className="space-y-4">
                {fields.map((field, i) => (
                    <div key={i}>
                        <label className="label">{field.label}</label>
                        {field.type === "select" ? (
                            <select className="field-input">
                                {field.options?.map((opt, j) => (
                                    <option key={j}>{opt}</option>
                                ))}
                            </select>
                        ) : field.type === "textarea" ? (
                            <textarea
                                placeholder={field.placeholder}
                                rows={3}
                                className="field-input resize-none"
                            />
                        ) : (
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                className="field-input"
                            />
                        )}
                    </div>
                ))}
                <button type="button" className="btn-accent w-full">Submit</button>
            </div>
        </div>
    );
}
