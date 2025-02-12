export default function Custom404() {
    return (
        <div style={{
            fontFamily: "monospace",
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#0D0D0D",
            color: "#FFD700"
        }}>
            <pre style={{ fontSize: "16px", lineHeight: "1.5em" }}>
{`
     _     _            _     _   _    ___   ___ 
    | |   (_)          | |   | | | |  |__ \\ / _ \\
    | |    _  ___  ___ | |_  | |_| |_    ) | | | |
    | |   | |/ _ \\/ _ \\| __| |  _  _|   / /| | | |
    | |___| |  __/  __/| |_  | | | |   / /_| |_| |
    |_____|_|\\___|\\___| \\__| |_| |_|  |____|\\___/
`}
            </pre>
            <h2>404 - Page Not Found</h2>
            <p>Oops! Looks like you've wandered off set.</p>
            <p><a href="/" style={{ color: "#FFD700", textDecoration: "none" }}>🎬 Back to Backlot AI</a></p>
        </div>
    );
}
