import { labels } from "@/constants/labels";

interface LoadingProps {
    progress: { progress: number; text: string };
}

export const Loading = ({ progress }: LoadingProps) => {
    const pct = Math.round(progress.progress * 100);

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-10">
            <div className="text-center">
                <div className="dot mx-auto mb-4 bg-accent" />
                <h1 className="text-sm font-semibold">{labels.progress.title}</h1>
                <p className="mt-1 text-xs text-text-3">{pct}%</p>
            </div>
            <div className="w-full max-w-xs">
                <div className="h-1 overflow-hidden rounded-full bg-surface">
                    <div
                        className="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="mt-3 text-center text-[11px] text-text-3">{progress.text}</p>
            </div>
        </div>
    );
};
