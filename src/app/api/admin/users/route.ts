import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where: Prisma.UserWhereInput = search ? {
    OR: [
      { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ],
  } : {}

  try {
    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        users: users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          verificationStatus: u.verificationStatus,
          joinedAt: u.createdAt.toISOString(),
        })),
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch users",
      status: 500,
    })
  }
}
