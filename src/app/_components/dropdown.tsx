import { useEffect, useRef, useState } from "react";
import useOutsideClick from "../_hooks/use-outside-click";
import ChervonSVG from "./svgs/chervon";
import { createPortal } from "react-dom";

interface DropdownItem {
    id: number;
    name: string;
    imageUrl?: string;
}

interface DropdownProps {
    title?: string;
    data: DropdownItem[];
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    style?: string;
    selectedId: number;
    onSelect?: (id: number) => void;
}

export default function Dropdown({
    data,
    position = "bottom-left",
    style,
    selectedId,
    onSelect,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [selectedItem, setSelectedItem] = useState<DropdownItem>(data.find((item) => item.id === selectedId) as any)

    const dropdownRef = useRef<HTMLDivElement>(null);
    useOutsideClick({
        ref: dropdownRef,
        handler: () => {if (window.innerWidth >= 1024) setIsOpen(false)},
    });

    useEffect(() => {
        const newSelectedItem = data.find((item) => item.id === selectedId);
        newSelectedItem && setSelectedItem(newSelectedItem);

    }, [selectedId, data]);

    function handleChange(item: DropdownItem) {
        setSelectedItem(item);
        onSelect && onSelect(item.id);
        setIsOpen(false);
    };


    const modalContent: any = document.getElementById('modal-content');

    return (
        <>
            {modalContent && isOpen && createPortal((
                <div className="fixed lg:hidden w-full h-full flex items-center justify-center bg-black/75 z-50">
                    <div onClick={() => { setIsOpen(false); }} className="absolute w-full h-full">
                    </div>
                    <div aria-label='Dropdown menu' className={[
                        'absolute panel p-2 w-[90vw] max-h-52 overflow-y-auto shadow-md z-10'
                    ].join(' ')}>
                        <ul
                            role='menu'
                            aria-orientation='vertical'
                            className='leading-10 flex flex-col gap-2'
                        >
                            {data?.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleChange(item)}
                                    className={
                                        ['flex items-center cursor-pointer rounded-lg text-neutral-400 hover:bg-white/10 duration-300 px-3',
                                            selectedItem?.id === item.id && 'bg-white/10'].join(' ')
                                    }
                                >
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ), modalContent)}
            <div ref={dropdownRef} className='relative'>
                <button
                    aria-label='Toggle dropdown'
                    aria-haspopup='true'
                    aria-expanded={isOpen}
                    type='button'
                    onClick={() => setIsOpen(!isOpen)}
                    className={'flex duration-300 hover:bg-white/10 justify-between w-48 items-center gap-5 text-neutral-400  py-0 px-2 panel'}
                >
                    <span>{selectedItem.name}</span>
                    <ChervonSVG
                        size={20}
                        className={['transform  stroke-neutral-400 h-9', isOpen && 'rotate-180'].join(' ')}
                    />
                </button>
                {isOpen && (
                    <div aria-label='Dropdown menu' className={[
                        'absolute panel p-2 w-48 max-h-52 hidden lg:block overflow-y-auto shadow-md z-10',
                        position == 'bottom-right' && 'top-full right-0 mt-2',
                        position == 'bottom-left' && 'top-full left-0 mt-2',
                        position == 'top-right' && 'bottom-full right-0 mb-2',
                        position == 'top-left' && 'bottom-full left-0 mb-2'
                    ].join(' ')}>
                        <ul
                            role='menu'
                            aria-orientation='vertical'
                            className='leading-10 flex flex-col gap-2'
                        >
                            {data?.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleChange(item)}
                                    className={
                                        ['flex items-center cursor-pointer rounded-lg text-neutral-400 hover:bg-white/10 duration-300 px-3',
                                            selectedItem?.id === item.id && 'bg-white/10'].join(' ')
                                    }
                                >
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}