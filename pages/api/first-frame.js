export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method IS NOT allowed' });
    }
    // Debugging logs
    console.log("🔍 Debug Request Body:", req.body);

    return res.status(200).json({ message: 'POST request received successfully' });
}
