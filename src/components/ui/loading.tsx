import { labels } from "@/constants/labels";

interface LoadingProps {
    progress: {
        progress: number;
        text: string;
    };
}

export const Loading = ({ progress }: LoadingProps) => {
    const pct = Math.round(progress.progress * 100);

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-white/5 px-4">
            <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
                <h1 className="text-xl font-semibold text-white">{labels.progress.title}</h1>
            </div>
            <div className="w-full max-w-md">
                <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-800">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-blue-600 to-purple-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="text-center text-sm text-gray-400">{progress.text}</p>
            </div>
        </div>
    );
};