export default function Table({ children, className }: any) {
    return (
        <div className={["flex flex-col gap-2 overflow-y-auto max-w-[85vw] w-[60rem]", className].join(' ')}>
            {children}
        </div>
    )
}