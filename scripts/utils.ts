/**
 * Pauses execution for the specified number of seconds.
 */
export async function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Returns a timestamp string in the format YYYYMMDD-HHMMSS.
 */
export function getTimestamp(): string {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // getMonth() is 0-based
  const day = pad(now.getDate());

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}
