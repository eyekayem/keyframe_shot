export default async function handler(req, res) {
    // Log the incoming request body
    console.log("Incoming webhook request body:", req.body);

    // Process the webhook event
    if (req.method === 'POST') {
        const { event, data } = req.body;

        try {
            // Handle different webhook events
            switch (event) {
                case 'start':
                    console.log("Prediction started:", data);
                    break;
                case 'completed':
                    console.log("Prediction completed:", data);
                    break;
                default:
                    console.log("Unhandled webhook event:", event);
            }

            res.status(200).json({ message: 'Webhook received successfully' });
        } catch (error) {
            console.error("Error processing webhook:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
