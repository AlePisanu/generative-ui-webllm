export const AlertBlock = ({ props }: { props: Record<string, unknown> }) => {
  const variantMap: Record<string, { bg: string; }> = {
    info: { bg: "bg-blue-900/50 border-blue-500" },
    success: { bg: "bg-green-900/50 border-green-500" },
    warning: { bg: "bg-yellow-900/50 border-yellow-500" },
    error: { bg: "bg-red-900/50 border-red-500" },
  };
  const v = variantMap[(props.variant as string) || "info"] || variantMap.info;
  return (
    <div className={`rounded-lg border p-4 ${v.bg}`}>
      <div className="flex items-start gap-2">
        <div>
          {typeof props.title === "string" && (
            <p className="font-semibold text-white">{props.title}</p>
          )}
          <p className="text-sm text-gray-300">{String(props.message ?? "")}</p>
        </div>
      </div>
    </div>
  );
}