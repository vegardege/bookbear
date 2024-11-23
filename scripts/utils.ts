/**
 * Pauses execution for the specified number of seconds.
 */
export async function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
