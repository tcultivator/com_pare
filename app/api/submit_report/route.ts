import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const reasonVal = body.reason == '' || body.reason == null ? 'No reason provided' : body.reason;
        const [result] = await db.execute(
            `INSERT INTO reported_products 
      (product_id, who_reported, status, reason)
      VALUES (?, ?, ?, ?)`,
            [
                body.productId,
                body.name,
                'pending',
                reasonVal
            ]
        );

        return Response.json({
            success: true,
            message: 'Product reported successfully',
            result,
        });
    } catch (error: unknown) {
        console.error(error);

        const message =
            error instanceof Error
                ? error.message
                : 'Something went wrong';

        return Response.json(
            {
                success: false,
                message,
            },
            { status: 500 }
        );
    }
}