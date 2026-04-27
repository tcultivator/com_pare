import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
    try {
        const [rows] = await db.query('SELECT category_name FROM categories')

        return NextResponse.json({
            success: true,
            data: rows,
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { success: false, message: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}