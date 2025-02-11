import { useState } from "react";
import axios from "axios";

export default function CreateIdea() {
    const [title, setTitle] = useState("");

    const handleSubmit = async () => {
        const response = await axios.post("/api/idea", {
            title,
            user_id: "test-user",
        });
        console.log("Idea Created:", response.data);
    };

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Idea Title"
            />
            <button onClick={handleSubmit}>Create Idea</button>
        </div>
    );
}
