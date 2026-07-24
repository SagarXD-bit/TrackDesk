import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export function parseSearchParams(url: string) {
  const { searchParams } = new URL(url);
  return {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    employeeId: searchParams.get("employeeId") || "",
    page: Math.max(1, parseInt(searchParams.get("page") || "1")),
    pageSize: Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10"))),
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  };
}

export function getPaginationParams(page: number, pageSize: number) {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}
