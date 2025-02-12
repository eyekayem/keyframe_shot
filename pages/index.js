import IdeaHandler from "./api/components/handleIdea";
import FirstFrameHandler from "./api/components/handleFirstFrame";

export default function KeyframeShot() {
    return (
        <div>
            <div>
                <h1>Idea Description</h1>
                <IdeaHandler />
            </div>
            <div>
                <h1>Create First Frame</h1>
                <FirstFrameHandler />
            </div>
        </div>
    );
}
