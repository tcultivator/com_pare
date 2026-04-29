// app/api/recommended/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT
        p.id,
        p.product_name     AS name,
        p.price,
        p.product_image    AS image,
        p.store_location   AS location,
        p.category,
        p.description,
        p.store_name       AS storeName,
        p.product_lat      AS plat,
        p.product_long     AS plong,

        u.username         AS user,
        u.profile_image    AS userImage,

        rp.who_reported,
        rp.status          AS reportStatus,
        rp.reason          AS reportReason

      FROM products_info p

      JOIN users u
        ON p.contributor_email = u.email

      -- Only grab the single latest report per product to avoid duplicate rows
      LEFT JOIN reported_products rp
        ON rp.product_id = p.id
        AND rp.id = (
          SELECT id FROM reported_products
          WHERE product_id = p.id
          ORDER BY id DESC
          LIMIT 1
        )

      ORDER BY RAND()
      LIMIT 4
    `);

    return NextResponse.json({ success: true, data: rows });

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
