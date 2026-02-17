import { type NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q") || "";
	const limit = Math.min(Number.parseInt(searchParams.get("limit") ?? "10", 10) || 10, 100);
	const offset = Math.max(0, Number.parseInt(searchParams.get("offset") ?? "0", 10) || 0);

	if (!query) {
		return NextResponse.json(
			{ error: "Query parameter 'q' is required." },
			{ status: 400 },
		);
	}

	const results = search(query, limit, offset);

	return NextResponse.json(results);
}
