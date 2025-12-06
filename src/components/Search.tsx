"use client";

import { useCombobox } from "downshift";
import { useRouter } from "next/navigation";
import React from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { SearchResult } from "@/lib/search";

type ActionItem = {
	type: "action";
	id: string;
	label: string;
	path: string;
};

type ResultItem = {
	type: "result";
	data: SearchResult;
};

type MenuItem = ResultItem | ActionItem;

/**
 * Search component using `downshift` for autocompletion.
 *
 * The component will call the backend API to fetch search results.
 * If JavaScript is not enabled, it will use a normal form and render
 * a submit button to redirect the user to the search page.
 */
export default function Search() {
	const [items, setItems] = React.useState<MenuItem[]>([]);
	const router = useRouter();

	const fetchSearchResults = React.useCallback((query: string) => {
		const qs = new URLSearchParams();
		qs.set("q", query);
		qs.set("limit", "5");
		fetch(`/api/search?${qs.toString()}`)
			.then((res) => {
				if (!res.ok) {
					throw new Error("Search failed");
				}
				return res.json();
			})
			.then((data: SearchResult[]) => {
				const menuItems: MenuItem[] = data.map((result) => ({
					type: "result",
					data: result,
				}));

				if (data.length >= 5) {
					menuItems.push({
						type: "action",
						id: "see-all",
						label: "See all results",
						path: `/search?q=${encodeURIComponent(query)}`,
					});
				} else {
					menuItems.push({
						type: "action",
						id: "contribute",
						label: "Missing someone?",
						path: "/contribute",
					});
				}

				setItems(menuItems);
			})
			.catch(() => {
				// Show error action on failure
				setItems([
					{
						type: "action",
						id: "error",
						label: "Search failed. Please try again.",
						path: "",
					},
				]);
			});
	}, []);

	const debouncedSearch = useDebounce(fetchSearchResults, 100);

	const {
		isOpen,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		selectItem,
	} = useCombobox({
		items,
		itemToString(item) {
			if (!item) return "";
			return item.type === "result" ? item.data.name : item.label;
		},
		onInputValueChange({ inputValue }) {
			if (!inputValue) {
				setItems([]);
				return;
			}

			debouncedSearch(inputValue);
		},
		onSelectedItemChange({ selectedItem }) {
			if (!selectedItem) {
				return;
			}

			if (selectedItem.type === "action") {
				// Handle action items
				if (selectedItem.path) {
					router.push(selectedItem.path);
				}
			} else {
				// Navigate to author page
				router.push(`/author/${encodeURIComponent(selectedItem.data.slug)}`);
			}

			selectItem(null);
			setItems([]);
		},
	});

	return (
		<form action="/search" method="GET" className="relative">
			<div className="w-full flex flex-col gap-1">
				<div className="flex flex-row rounded-md items-center shadow-sm bg-white gap-0.5">
					<input
						name="q"
						placeholder="Search for an author"
						className="w-full p-3 bg-transparent rounded-md"
						{...getInputProps()}
					/>
					<noscript>
						<button type="submit" className="py-2 px-4 bg-card rounded-r-lg">
							Search
						</button>
					</noscript>
				</div>
			</div>
			<ul
				className={`absolute w-full bg-white mt-1 shadow-md rounded-md max-h-96 overflow-scroll p-0 z-10 ${
					!(isOpen && items.length) && "hidden"
				}`}
				{...getMenuProps()}
			>
				{isOpen &&
					items.map((item, index) => {
						const isAction = item.type === "action";
						const isError = isAction && item.id === "error";

						return (
							<li
								className={`
									py-2 px-3 shadow-sm flex flex-col
									${isError || isAction ? "border-t border-gray-300 items-center" : ""}
									${
										highlightedIndex === index
											? "cursor-pointer bg-highlight"
											: ""
									}
								`}
								key={isAction ? item.id : item.data.slug}
								{...getItemProps({ item, index })}
							>
								{isAction ? (
									<span className="text-black text-sm italic">
										{item.label}
									</span>
								) : (
									<>
										<span className="text-black">{item.data.name}</span>
										<span className="text-sm text-gray-700">
											{item.data.description}
										</span>
									</>
								)}
							</li>
						);
					})}
			</ul>
		</form>
	);
}
