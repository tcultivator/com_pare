import { NextResponse } from "next/server";
import db from "@/lib/db";
type SQLParam = string | number;
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const search = searchParams.get("search");
        console.log("API SEARCH PARAMS:", { category, minPrice, maxPrice, search });
        let query = `
  SELECT 
    p.id,
    p.product_name AS name,
    p.price,
    p.product_image AS image,
    p.store_location AS location,
    p.category,
    p.description,
    p.created_at,
    p.store_name AS storeName,
    p.product_lat AS plat,
    p.product_long AS plong,

    u.username AS user,
    u.profile_image AS userImage,
    u.email AS userEmail,

    rp.who_reported,
    rp.status AS reportStatus,
    rp.reason AS reportReason

  FROM products_info p
  JOIN users u ON p.contributor_email = u.email

  LEFT JOIN reported_products rp 
    ON rp.product_id = p.id

  WHERE 1=1
`;

        const params: SQLParam[] = [];

        // category filter
        if (category) {
            const list = category.split(",");
            query += ` AND p.category IN (${list.map(() => "?").join(",")})`;
            params.push(...list);
        }

        // price filter
        if (minPrice && maxPrice) {
            query += ` AND p.price BETWEEN ? AND ?`;
            params.push(Number(minPrice), Number(maxPrice));
        }

        // search filter
        if (search) {
            query += ` AND (p.product_name LIKE ? OR p.description LIKE ? OR p.store_name LIKE ? )`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY p.created_at DESC`;

        const [rows] = await db.execute(query, params);

        return NextResponse.json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("PRODUCTS_JOIN_ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products",
            },
            { status: 500 }
        );
    }
}