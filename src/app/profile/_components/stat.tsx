export default function StatPanel({ title, value, symbol }: any) {
    return (
        <div>
            <p className='text-sm'>{title}</p>
            <h2 className=''>
                {value + symbol}
            </h2>
        </div>
    )
}