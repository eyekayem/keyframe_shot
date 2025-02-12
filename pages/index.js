import React, { useState } from 'react';
import { handleIdea } from "./api/components/handleIdea";

export default function KeyframeShot() {
    const [idea, setIdea] = useState("");
    const [state, setState] = useState("");
    const [generatedFrame, setGeneratedFrame] = useState(null);

    const handleReplicateCall = async () => {
        setState("generating");
        const response = await fetch('/api/replicate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: {
                    prompt: idea,
                    aspect_ratio: "16:9",
                    output_format: "png",
                    output_quality: 80,
                    prompt_upsampling: false,
                    safety_tolerance: 5,
                    width: 777
                },
            }),
        });

        const output = await response.json();
        if (output.error) {
            setState("fail");
        } else {
            setGeneratedFrame(output);
            setState("complete");
        }
    };

    return (
        <div>
            <div>
                <h1>Add Idea</h1>
                <input 
                    type="text" 
                    placeholder="Idea" 
                    value={idea} 
                    onChange={(e) => setIdea(e.target.value)} 
                />
                <button onClick={handleReplicateCall}>Send to Replicate</button>
            </div>
            <div>
                {state === "generating" && <p>Generating...</p>}
                {state === "complete" && generatedFrame && (
                    <div>
                        <h2>Generated Frame</h2>
                        <img src={generatedFrame.url} alt="Generated Frame" />
                    </div>
                )}
                {state === "fail" && <p>Failed to generate frame. Please try again.</p>}
            </div>
        </div>
    );
}
