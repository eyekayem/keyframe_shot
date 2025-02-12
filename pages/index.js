import IdeaHandler from "./components/handleIdea";
import FirstFrameHandler from "./components/handleFirstFrame";

export default function KeyframeShot() {
    return (
        <div>
            <div>
                <h1>Handle Idea</h1>
                <IdeaHandler />
            </div>
            <div>
                <h1>Handle First Frame</h1>
                <FirstFrameHandler />
            </div>
        </div>
    );
}
