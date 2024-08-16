export default function Badge({ children, color }: { children: any, color: string }) {
    return (
        <div style={{ background: color }} className={"px-2 select-none rounded-full"}>
            <p className="text-black text-xs font-bold">
                {children}
            </p>
        </div>
    )
}