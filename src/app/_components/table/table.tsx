export default function Table({ children, className }: any) {
    return (
        <div className={"flex flex-col gap-2 overflow-scroll max-w-[90vw] w-[60rem] "}>
            {children}
        </div>
    )
}