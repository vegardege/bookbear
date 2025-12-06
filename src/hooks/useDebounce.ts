import { useEffect, useRef } from "react";

/**
 * Returns a debounced version of the provided callback function.
 * The callback will only be invoked after the specified delay has elapsed
 * since the last time the debounced function was called.
 *
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic constraint needs any[] to capture function signatures
export function useDebounce<T extends (...args: any[]) => void>(
	callback: T,
	delay: number,
): T {
	const callbackRef = useRef(callback);
	const delayRef = useRef(delay);
	const timeoutRef = useRef<number | null>(null);

	// Keep refs up to date
	useEffect(() => {
		callbackRef.current = callback;
		delayRef.current = delay;
	}, [callback, delay]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	// Create stable debounced function reference
	// biome-ignore lint/suspicious/noExplicitAny: Matches generic constraint above
	const debouncedCallback = useRef<T>(((...args: any[]) => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = window.setTimeout(() => {
			callbackRef.current(...args);
		}, delayRef.current);
	}) as T);

	return debouncedCallback.current;
}
