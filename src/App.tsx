import React, { useState } from "react";
import "./App.css";
import Footer from "./Footer"; // Adjust the path as necessary

const apiUrl = import.meta.env.DEV
  ? "http://localhost:5175"
  : "https://ai-llm-cf.pages.dev";

console.log("apiUrl", apiUrl);

interface ApiResponse {
  message: string;
}

function App() {
  const [userMessage, setUserMessage] = useState("");
  const [userList, setUserList] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInputHighlighted, setIsInputHighlighted] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null); // State to store API response
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const handleAddMessage = () => {
    if (userMessage.trim() === "") {
      setErrorMessage("Message cannot be empty, Ask AI Anything");
      setIsInputHighlighted(true);
    } else {
      // Clear previous question and add the current one
      setUserList([userMessage]);
      setUserMessage("");
      setErrorMessage("");
      setIsInputHighlighted(false);
    }
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUserMessage(e.target.value);
  //   if (e.target.value.trim() !== '') {
  //     setErrorMessage('');
  //     setIsInputHighlighted(false);
  //   }
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
    if (e.target.value.trim() !== "") {
      setErrorMessage("");
      setIsInputHighlighted(false);
    }
  };

  const handleRun = async () => {
    if (userList.length === 0) {
      // No questions in the list, show error message
      setErrorMessage("Please ask a question before running the request.");
      setIsInputHighlighted(true);
      return;
    }

    // Reset error state and clear the previous API response
    setErrorMessage("");
    setIsInputHighlighted(false);
    setApiResponse(null);

    // Set loading state to true
    setIsLoading(true);

    // TODO: Get the latest question to send to the API
    //const latestQuestion = userList[0];

    // Simulate a REST API call (mocking with a local JSON response)
    fetch(`${apiUrl}/src/dummy-response.json`) // Replace with actual API endpoint later
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<ApiResponse>; // Attempt to parse the JSON
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: { message: string }) => {
        // Assuming the API response contains a "message" key
        setApiResponse(data?.message || "No response from API");
      })
      .catch((error) => {
        console.error("Error fetching API:", error);
        setApiResponse("Error fetching the API.");
      })
      .finally(() => {
        // Reset loading state
        setIsLoading(false);
      });
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <h2>Workers AI LLM Playground ✨</h2>
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

        <div className={`message-box ${isInputHighlighted ? "highlight" : ""}`}>
          <textarea
            value={userMessage}
            onChange={handleInputChange}
            placeholder="Ask AI LLM Anything..."
            rows={3} // Adjust the number of visible rows as needed
            style={{ resize: "none", width: "100%" }} // Prevent resizing
          />
          <button onClick={handleAddMessage}>Ask</button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="user-list">
          {userList.map((message, index) => (
            <div key={index} className="user-item">
              <span>{message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Response */}
      {apiResponse && (
        <div className="api-response">
          {/* <h4>Response from API:</h4> */}
          <p>{apiResponse}</p>
        </div>
      )}

      {/* Run Button at the bottom */}
      <div className="sticky run-button-container">
        <div className="run-message">
          Send messages and generate a response (⌘/Ctrl + Enter)
        </div>
        <button className="run-button" onClick={handleRun}>
          {isLoading ? "Running..." : "Run ✨"}
        </button>
      </div>
      {/* Copyright Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
