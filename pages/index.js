import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { handleIdea } from "./api/components/handleIdea";

export default function MockupUI() {
    const [ideaTitle, setIdeaTitle] = useState("");
    const [userId, setUserId] = useState("");
    const [firstFramePrompt, setFirstFramePrompt] = useState("You are at a fashion show for clowns, everyone in the audience is not a clown");
    const [uniqueIdeaId, setUniqueIdeaId] = useState(null);
    const [state, setState] = useState("");
    const [generatedFrame, setGeneratedFrame] = useState(null);
    const [dbRecord, setDbRecord] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [payload, setPayload] = useState({});

    const handleReplicateCall = async () => {
        const promptPayload = {
            input: {
                prompt: firstFramePrompt,
                aspect_ratio: "16:9",
                output_format: "png",
                output_quality: 80,
                prompt_upsampling: false,
                safety_tolerance: 5,
                width: 777
            },
        };
        
        setPayload(promptPayload);
        setShowDialog(true);
    };

    const confirmReplicateCall = async () => {
        setShowDialog(false);
        setState("generating");
        
        const response = await fetch('/api/replicate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
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
        const ideaId = uuidv4();
        setUniqueIdeaId(ideaId);
        
        const result = await handleIdea({ body: { id: ideaId, user_id: userId, title: ideaTitle } });
        setDbRecord(result);
        alert(`New DB Record: ${JSON.stringify(result)}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6 bg-gray-900 text-white rounded-lg shadow-lg">
            <h1 className="text-xl font-bold">Concept</h1>
            <div className="flex space-x-2">
                <select 
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md" 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                >
                    <option value="">Select User</option>
                    <option value="Kenny">Kenny</option>
                    <option value="Rachel">Rachel</option>
                    <option value="Brian">Brian</option>
                </select>
            </div>
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
            {uniqueIdeaId && (
                <div className="text-green-500">
                    Unique Idea ID: {uniqueIdeaId}
                </div>
            )}

            <h2 className="text-lg font-semibold">First Frame</h2>
            <div className="flex space-x-2">
                <input 
                    type="text" 
                    placeholder="Enter first frame prompt" 
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md" 
                    value={firstFramePrompt}
                    onChange={(e) => setFirstFramePrompt(e.target.value)}
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

            {showDialog && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-black">
                        <h2 className="text-lg font-semibold mb-4">Confirm Prompt Payload</h2>
                        <pre className="bg-gray-200 p-4 rounded-md overflow-auto max-h-64">
                            {JSON.stringify(payload, null, 2)}
                        </pre>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button className="p-2 bg-red-600 rounded-md hover:bg-red-700" onClick={() => setShowDialog(false)}>
                                Cancel
                            </button>
                            <button className="p-2 bg-green-600 rounded-md hover:bg-green-700" onClick={confirmReplicateCall}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
