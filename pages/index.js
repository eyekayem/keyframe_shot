import React, { useState } from 'react';
import Replicate from 'replicate';
import { handleIdea } from "./api/components/handleIdea";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export default function KeyframeShot() {
    const [ideaId, setIdeaId] = useState("");
    const [prompt, setPrompt] = useState("");
    const [frameId, setFrameId] = useState("");

    const handleIdeaSubmit = async () => {
        const result = await handleIdea({ body: { idea_id: ideaId, prompt } });
        console.log(result);
    };

    const handleReplicateCall = async () => {
        const output = await replicate.run(
            "black-forest-labs/flux-1.1-pro",
            {
                input: {
                    aspect_ratio: "16:9",
                    output_format: "png",
                    output_quality: 80,
                    prompt: prompt,
                    prompt_upsampling: false,
                    safety_tolerance: 5,
                    width: 777
                }
            }
        );
        console.log(output);
    };

    return (
        <div>
            <div>
                <h1>Add Idea</h1>
                <input 
                    type="text" 
                    placeholder="Idea ID" 
                    value={ideaId} 
                    onChange={(e) => setIdeaId(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Prompt" 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                />
                <button onClick={handleIdeaSubmit}>Add Idea</button>
            </div>
            <div>
                <h1>Test Replicate API</h1>
                <input 
                    type="text" 
                    placeholder="Frame ID" 
                    value={frameId} 
                    onChange={(e) => setFrameId(e.target.value)} 
                />
                <button onClick={handleReplicateCall}>Send to Replicate</button>
            </div>
        </div>
    );
}
