import React, { useState } from "react";
import "./App.css";
import Footer from "./Footer"; // Adjust the path as necessary

const apiUrl = import.meta.env.DEV
  ? "http://localhost:8790"
  : "https://cf-llama-3.vinodh-jeevanantham.workers.dev";

interface ApiResponse {
  response: string;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
    if (e.target.value.trim() !== "") {
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

    // Reset error state and clear the previous API response
    setErrorMessage("");
    setIsInputHighlighted(false);
    setApiResponse(null);

    // Set loading state to true
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/`, {
        method: "POST",
        body: JSON.stringify({ prompt: userList[0] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as ApiResponse;
      setApiResponse(data?.response || "No response from API");
    } catch (error) {
      console.error("Error fetching API:", error);
      setApiResponse("Error fetching the API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear all states
  const handleClear = () => {
    setUserMessage("");        // Clear user input
    setUserList([]);           // Clear user list
    setErrorMessage("");       // Clear error messages
    setApiResponse(null);      // Clear API response
    setIsInputHighlighted(false); // Reset input highlighting
    setIsLoading(false);       // Reset loading state
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

        <div className={`message-box ${isInputHighlighted ? "highlight" : ""}`}>
          <textarea
            value={userMessage}
            onChange={handleInputChange}
            placeholder="Ask AI LLM Anything..."
            rows={3} // Adjust the number of visible rows as needed
            style={{ resize: "none", width: "100%" }} // Prevent resizing
          />
          <button onClick={handleAddMessage} className="ask-button">Ask</button>
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
          <p>{apiResponse}</p>
        </div>
      )}

      {/* Run and Clear Buttons */}
      <div className="sticky run-button-container">
        <div className="run-message">
          Send messages and generate a response
        </div>

         {/* Add Clear button */}
         <button className="clear-button" onClick={handleClear} disabled={isLoading}>
          Clear
        </button> &nbsp;&nbsp;

        <button className="run-button" onClick={handleRun} disabled={isLoading}>
          {isLoading ? "Running..." : "Run ✨"}
        </button>
      </div>

      {/* Copyright Footer */}
      <Footer />
    </div>
  );
}


export default App;
