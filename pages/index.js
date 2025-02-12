import React, { useState } from 'react';
import { handleIdea } from "./api/components/handleIdea";

export default function MockupUI() {
    const [ideaTitle, setIdeaTitle] = useState("");
    const [userId, setUserId] = useState("");  // Assuming user ID is available
    const [state, setState] = useState("");
    const [generatedFrame, setGeneratedFrame] = useState(null);
    const [dbRecord, setDbRecord] = useState(null);

    const handleReplicateCall = async () => {
        setState("generating");
        const response = await fetch('/api/replicate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: {
                    prompt: ideaTitle,
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

    const handleIdeaSubmit = async () => {
        const result = await handleIdea({ body: { title: ideaTitle, user_id: userId } });
        setDbRecord(result);
        alert(`New DB Record: ${JSON.stringify(result)}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6 bg-gray-900 text-white rounded-lg shadow-lg">
            <h1 className="text-xl font-bold">Concept</h1>
            <div className="flex space-x-2">
                <input 
                    type="text" 
                    placeholder="Enter idea title" 
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md" 
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                />
                <button className="p-2 bg-blue-600 rounded-md hover:bg-blue-700" onClick={handleIdeaSubmit}>
                    Record to DB
                </button>
            </div>

            <h2 className="text-lg font-semibold">First Frame</h2>
            <div className="flex space-x-2">
                <input 
                    type="text" 
                    placeholder="Enter first frame prompt" 
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md" 
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                />
                <button className="p-2 bg-green-600 rounded-md hover:bg-green-700" onClick={handleReplicateCall}>
                    Send to Replicate
                </button>
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

            <h2 className="text-lg font-semibold">Last Frame</h2>
            <div className="flex space-x-2">
                <input type="text" placeholder="Enter last frame prompt" className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md" />
                <button className="p-2 bg-green-600 rounded-md hover:bg-green-700">Send to Replicate</button>
            </div>

            <h2 className="text-lg font-semibold">Video Generate</h2>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-md">
                <div className="w-full h-32 bg-gray-700 flex items-center justify-center text-gray-400">First Frame</div>
                <div className="w-full h-32 bg-gray-700 flex items-center justify-center text-gray-400">Last Frame</div>
            </div>
            <input type="text" placeholder="Enter video generation prompt" className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md" />
            <button className="p-2 bg-purple-600 w-full rounded-md hover:bg-purple-700">Send to Luma 1.6</button>
        </div>
    );
}
