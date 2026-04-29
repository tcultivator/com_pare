import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            product_name,
            product_image,
            price,
            category,
            description,
            lat,
            long,
            store_name,
            location
        } = body.addedProducts;
        const {
            email
        } = body.session.user;

        const [result] = await db.execute(
            `INSERT INTO products_info 
      (product_name, product_image, description, price, contributor_email, product_lat, product_long,category,store_name,store_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            [
                product_name,
                product_image,
                description == '' ? 'No description' : description,
                price,
                email,
                lat,
                long,
                category,
                store_name,
                location
            ]
        );

        return Response.json({
            success: true,
            message: 'Product inserted successfully',
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