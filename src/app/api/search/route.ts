import { type NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q") || "";
	const limit = Math.min(
		Number.parseInt(searchParams.get("limit") ?? "10", 10) || 10,
		100,
	);
	const offset = Math.max(
		0,
		Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0,
	);

	if (!query) {
		return NextResponse.json(
			{ error: "Query parameter 'q' is required." },
			{ status: 400 },
		);
	}

	const results = search(query, limit, offset);

	// Results only change when the database is reloaded, so let browsers (and
	// any CDN in front of the site) reuse them for a few minutes.
	return NextResponse.json(results, {
		headers: { "Cache-Control": "public, max-age=60" },
	});
}
