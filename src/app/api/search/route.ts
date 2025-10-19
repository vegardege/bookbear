import { type NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const query = decodeURIComponent(searchParams.get("q") || "");
	const limit = parseInt(searchParams.get("limit") || "10", 10);
	const offset = parseInt(searchParams.get("offset") || "0", 10);

	if (!query) {
		return NextResponse.json(
			{ error: "Query parameter 'q' is required." },
			{ status: 400 },
		);
	}

	const results = search(query, limit, offset);

	return NextResponse.json(results);
}
