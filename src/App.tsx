import MarkdownRenderBox from "./Components/md-render-box";
import React from "react";
import axios from "axios";

function App() {
    const [Markdown, setMarkdown] = React.useState("");

    function getMarkdown() {

        axios.get("/README.md").then((response) => {
            setMarkdown(response.data);
        });
    }

    React.useEffect(() => {
        getMarkdown();
    }, []);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="max-w-[48rem] bg-dark p-4 rounded-lg">
                <MarkdownRenderBox text={Markdown} />
            </div>
        </div>
    );
}

export default App;
