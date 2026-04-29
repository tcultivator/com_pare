// app/api/compare/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

// Words to ignore when tokenizing the product name
const STOP_WORDS = new Set([
  "with", "of", "the", "a", "an", "and", "or", "in", "on", "at", "to",
  "for", "by", "from", "is", "it", "its", "per", "ml", "g", "kg", "pcs",
  "pc", "pack", "set", "box", "bag", "bottle", "can", "jar", "sachet",
  "na", "ang", "mga", "sa", "ng", "ni",   // common Filipino stop words
])

function extractKeywords(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")   // strip punctuation
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
}

type SQLParam = string | number;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const productId = searchParams.get("id");         // exclude this product
    const productName = searchParams.get("name");     // source product name
    const category = searchParams.get("category");    // must match exactly

    if (!productName || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required params: name, category" },
        { status: 400 }
      );
    }

    const keywords = extractKeywords(productName);

    if (keywords.length === 0) {
      return NextResponse.json({ success: true, keywords: [], data: [] });
    }

    // Build LIKE conditions — one per keyword, all OR-ed together
    // e.g. "chicken pastil" → LOWER(p.product_name) LIKE '%chicken%' OR LOWER(p.product_name) LIKE '%pastil%'
    const likeConditions = keywords
      .map(() => "LOWER(p.product_name) LIKE ?")
      .join(" OR ");

    const likeValues: SQLParam[] = keywords.map((kw) => `%${kw}%`);

    const params: SQLParam[] = [
      category,          // for p.category = ?
      ...likeValues,     // for the LIKE conditions
    ];

    // Exclude the source product if an id was provided
    const excludeClause = productId ? "AND p.id != ?" : "";
    if (productId) params.push(Number(productId));

    const query = `
      SELECT
        p.id,
        p.product_name     AS name,
        p.price,
        p.product_image    AS image,
        p.store_location   AS location,
        p.category,
        p.description,
        p.created_at,
        p.store_name       AS storeName,
        p.product_lat      AS plat,
        p.product_long     AS plong,

        u.username         AS user,
        u.profile_image    AS userImage,
        u.email            AS userEmail,

        rp.who_reported,
        rp.status          AS reportStatus,
        rp.reason          AS reportReason

      FROM products_info p
      JOIN users u
        ON p.contributor_email = u.email
      LEFT JOIN reported_products rp
        ON rp.product_id = p.id

      WHERE p.category = ?
        AND (${likeConditions})
        ${excludeClause}

      ORDER BY p.price ASC
    `;

    const [rows] = await db.execute(query, params);

    return NextResponse.json({
      success: true,
      keywords,           // returned so the UI can show matched keyword chips
      sourceProductId: productId ? Number(productId) : null,
      data: rows,
    });

  } catch (error) {
    console.error("COMPARE_ROUTE_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch comparison products" },
      { status: 500 }
    );
  }
}
