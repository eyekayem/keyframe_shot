import Replicate from 'replicate';

export default async function handler(req, res) {
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN
    });

    const output = await replicate.run(
        "black-forest-labs/flux-1.1-pro",
        {
            input: req.body.input
        }
    );

    res.status(200).json(output);
}
