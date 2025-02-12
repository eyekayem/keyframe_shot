import React, { useState } from 'react';
import { handleIdea } from "./api/components/handleIdea";
import { handleFirstFrame } from "./api/components/handleFirstFrame";

export default function KeyframeShot() {
    const [ideaId, setIdeaId] = useState("");
    const [prompt, setPrompt] = useState("");
    const [frameId, setFrameId] = useState("");

    const handleIdeaClick = async () => {
        const result = await handleIdea({ body: { idea_id: ideaId, prompt } });
        console.log(result);
    };

    const handleFirstFrameClick = async () => {
        const result = await handleFirstFrame({ idea_id: ideaId, prompt, frameId }, { status: (code) => ({ json: (data) => console.log(data) }) });
        console.log(result);
    };

    return (
        <div>
            <div>
                <h1>Handle Idea</h1>
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
                <button onClick={handleIdeaClick}>Handle Idea</button>
            </div>
            <div>
                <h1>Handle First Frame</h1>
                <input 
                    type="text" 
                    placeholder="Frame ID" 
                    value={frameId} 
                    onChange={(e) => setFrameId(e.target.value)} 
                />
                <button onClick={handleFirstFrameClick}>Handle First Frame</button>
            </div>
        </div>
    );
}
