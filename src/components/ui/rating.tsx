export default function Rating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center justify-end">
            <span className="text-lg font-bold text-accent">{rating}</span>
            <span className="text-sm text-muted-foreground ml-1">/10</span>
        </div>
    )
}