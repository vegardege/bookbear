"use client";

import React from "react";
import { useCombobox } from "downshift";
import { useRouter } from "next/navigation";
import { SearchResult } from "@/lib/search";

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
    inputValue,
    selectItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item?.name ?? "";
    },
    onInputValueChange({ inputValue }) {
      if (!inputValue) {
        setItems([]);
        return;
      }

      // Fetch search results when input changes
      const qs = new URLSearchParams();
      qs.set("q", encodeURIComponent(inputValue));
      qs.set("limit", "5");
      fetch(`/api/search?${qs.toString()}`)
        .then((res) => res.json())
        .then((data: SearchResult[]) => {
          if (data.length >= 5) {
            data.push({
              name: "See all results",
              description: "",
              slug: "",
              views: 0,
              score: 0,
              isAuthor: false,
            });
          }
          setItems(data);
        });
    },
    onSelectedItemChange({ selectedItem }) {
      if (!selectedItem) {
        return;
      }

      // Hard coded exception, expand search
      if (selectedItem.name === "See all results") {
        router.push(`/search?q=${inputValue}`);
        selectItem(null);
        setItems([]);
        return;
      }

      // Navigate to author page
      router.push(`/author/${selectedItem.slug}`);
      selectItem(null);
      setItems([]);
    },
  });

  return (
    <form action="/search" method="GET" className="relative">
      <div className="w-full flex flex-col gap-1">
        <div className="flex flex-row rounded-sm items-center shadow-sm bg-white gap-0.5">
          <input
            name="q"
            placeholder="Search for an author"
            className="w-full p-2 bg-transparent rounded-sm"
            {...getInputProps()}
          />
          <noscript>
            <button
              type="submit"
              className="py-2 px-4 bg-[#f5d5a7] rounded-r-lg"
            >
              Search
            </button>
          </noscript>
        </div>
      </div>
      <ul
        className={`absolute w-full bg-white mt-1 shadow-md max-h-96 overflow-scroll p-0 z-10 ${
          !(isOpen && items.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={`
                        py-2 px-3 shadow-sm flex flex-col
                        ${highlightedIndex === index ? "cursor-pointer" : ""}
                    `}
              style={
                highlightedIndex === index ? { backgroundColor: "#f6d6a8" } : {}
              }
              key={item.slug}
              {...getItemProps({ item, index })}
            >
              <span>{item.name}</span>
              <span className="text-sm text-gray-700">{item.description}</span>
            </li>
          ))}
      </ul>
    </form>
  );
}
