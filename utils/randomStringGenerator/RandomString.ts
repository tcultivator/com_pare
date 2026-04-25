export function RandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    let password = ''
    for (let index = 0; index < 10; index++) {
        const random = Math.floor(Math.random() * chars.length)
        password += chars[random]
    }
    return password
}