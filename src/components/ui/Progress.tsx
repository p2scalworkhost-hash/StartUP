interface ProgressProps {
    value: number; // 0–100
    className?: string;
    showLabel?: boolean;
    color?: 'blue' | 'green' | 'amber' | 'red';
}

const colorStyles: Record<string, string> = {
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    green: 'bg-gradient-to-r from-green-500 to-emerald-500',
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    red: 'bg-gradient-to-r from-red-500 to-rose-500',
};

export function Progress({
    value,
    className = '',
    showLabel = false,
    color = 'blue',
}: ProgressProps) {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div className={`w-full ${className}`}>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-slate-500 font-medium">
                        {Math.round(clampedValue)}%
                    </span>
                </div>
            )}
        </div>
    );
}
