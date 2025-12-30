import './LoadingSkeleton.css';

export function TableSkeleton({ rows = 5, columns = 5 }) {
    return (
        <div className="skeleton-table">
            <div className="skeleton-table-header">
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="skeleton skeleton-header-cell" />
                ))}
            </div>
            <div className="skeleton-table-body">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="skeleton-table-row">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={colIndex} className="skeleton skeleton-cell" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-icon" />
            <div className="skeleton-card-content">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-value" />
            </div>
        </div>
    );
}

export function ChartSkeleton({ height = 300 }) {
    return (
        <div className="skeleton-chart" style={{ height: `${height}px` }}>
            <div className="skeleton skeleton-chart-title" />
            <div className="skeleton-chart-body">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="skeleton-chart-bar" style={{ height: `${Math.random() * 80 + 20}%` }} />
                ))}
            </div>
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div className="stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
