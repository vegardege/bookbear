'use client';

import React from 'react';
import {useCombobox} from 'downshift'
import { useRouter } from 'next/navigation';
import { SearchResult } from '@/lib/search';

/**
 * Search component using `downshift` for autocompletion.
 * 
 * The component will call the backend API to fetch search results.
 * If JavaScript is not enabled, it will use a normal form and render
 * a submit button to redirect the user to the search page.
 */
export default function Search() {
    const [items, setItems] = React.useState<SearchResult[]>([]);
    const router = useRouter();

    const {
        isOpen,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        items,
        itemToString(item) {
          return item?.name ?? '';
        },
        onInputValueChange({ inputValue }) {
            if (!inputValue) {
                setItems([]);
                return;
            };
      
            // Fetch search results when input changes
            fetch('/api/search?q=' + encodeURIComponent(inputValue))
              .then((res) => res.json())
              .then((data: SearchResult[]) => {
                setItems(data);
              });
          },
          onSelectedItemChange({ selectedItem }) {
            router.push(`/author/${selectedItem.slug}`);
          },
    })

    return (
        <form action="/search" method="GET">
            <div className="w-72 flex flex-col gap-1">
                <div className="flex shadow-sm bg-white gap-0.5">
                    <input
                        name="q"
                        placeholder="Best book ever"
                        className="w-full p-1.5"
                        {...getInputProps()}
                    />
                    <noscript>
                        <button type="submit">Search</button>
                    </noscript>
                </div>
            </div>
            <ul
                className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
                !(isOpen && items.length) && 'hidden'
                }`}
                {...getMenuProps()}
            >
                {isOpen && items.map((item, index) => (
                    <li
                    className={`
                        py-2 px-3 shadow-sm flex flex-col
                        ${highlightedIndex === index ? 'cursor-pointer bg-blue-50' : ''}
                    `}
                    key={item.slug}
                    {...getItemProps({item, index})}
                    >
                        <span>{item.name}</span>
                        <span className="text-sm text-gray-700">{item.description}</span>
                    </li>
                ))}
            </ul>
        </form>
    )
}