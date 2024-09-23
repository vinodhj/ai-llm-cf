import { useState } from "react";
import "./assets/css/App.css";
import Footer from "./components/Footer"; // Adjust the path as necessary
import MessageInput from "./components/MessageInput";
import UserList from "./components/UserList";
import ApiResponse from "./components/ApiResponse";
// import ModelSelection from "./components/ModelSelection";

const apiUrl = import.meta.env.DEV
  ? "http://localhost:8790"
  : "https://cf-llama-3.vinodh-jeevanantham.workers.dev";

// const is_dev = import.meta.env.DEV ? true : false;

interface ApiResponseData {
  response: string;
}


const App = () => {
  const [userMessage, setUserMessage] = useState("");
  const [userList, setUserList] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInputHighlighted, setIsInputHighlighted] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMessage = () => {
    if (userMessage.trim() === "") {
      setErrorMessage("Message cannot be empty, Ask AI Anything");
      setIsInputHighlighted(true);
    } else {
      setUserList([userMessage]);
      setUserMessage("");
      setErrorMessage("");
      setIsInputHighlighted(false);
    }
  };

  const handleRun = async () => {
    if (userList.length === 0) {
      setErrorMessage("Please ask a question before running the request.");
      setIsInputHighlighted(true);
      return;
    }

    setErrorMessage("");
    setIsInputHighlighted(false);
    setApiResponse(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/`, {
        method: "POST",
        body: JSON.stringify({ prompt: userList[0] }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = (await response.json()) as ApiResponseData;
      setApiResponse(data?.response || "No response from API");
    } catch (error) {
      console.error("Error fetching API:", error);
      setApiResponse("Error fetching the API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUserMessage("");
    setUserList([]);
    setErrorMessage("");
    setApiResponse(null);
    setIsInputHighlighted(false);
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <h2>Dizzy AI LLM Playground ✨</h2>
        <p>Hi, how can I help?</p>
        <p>
          Explore different Text Generation models by drafting messages and
          fine-tuning your responses.
        </p>

        <div className="model-selection">
          <label>Model</label>
          <select>
            <option value="llama-3.1-8b-instruct">
              llama-3.1-8b-instruct (Beta)
            </option>
          </select>
        </div>

        {/* Conditionally render model selection based on is_dev */}
        {/* {is_dev ? (
          <div className="model-selection">
            <label>Model</label>
            <select>
              <option value="llama-3.1-8b-instruct">
                llama-3.1-8b-instruct (Beta)
              </option>
            </select>
          </div>
        ) : (
          <ModelSelection />
        )} */}

        <MessageInput
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          handleAddMessage={handleAddMessage}
          isInputHighlighted={isInputHighlighted}
        />

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <UserList userList={userList} />

      </div>

      <ApiResponse apiResponse={apiResponse} />

      <div className="sticky run-button-container">
        <div className="run-message">
          Send messages and generate a response
        </div>

        <button className="clear-button" onClick={handleClear} disabled={isLoading}>
          Clear
        </button> &nbsp;&nbsp;

        <button className="run-button" onClick={handleRun} disabled={isLoading}>
          {isLoading ? "Running..." : "Run ✨"}
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default App;
