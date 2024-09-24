import { useEffect, useState } from "react";
import "./assets/css/App.css";
import Footer from "./components/Footer"; // Adjust the path as necessary
import MessageInput from "./components/MessageInput";
import UserList from "./components/UserList";
import ApiResponse from "./components/ApiResponse";
import ModelSelection from "./components/ModelSelection";

const apiUrl = import.meta.env.DEV
  ? "http://localhost:8790"
  : "https://cf-llama-3.vinodh-jeevanantham.workers.dev";


const siteKey = import.meta.env.DEV ? import.meta.env.VITE_DEV_SITE_KEY : import.meta.env.VITE_PROD_SITE_KEY;

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
  const [selectedModel, setSelectedModel] = useState<string>(""); // State for the selected model
  const [turnstileToken, setTurnstileToken] = useState<string>(""); 


  useEffect(() => {
    // Ensure that the turnstile script is available and only render once
    const renderTurnstile = () => {
      console.debug('_turnstileCb called in React');
      const widgetContainer = document.querySelector('#myWidget');

      // Ensure the widget hasn't already been rendered
      if (widgetContainer && widgetContainer.children.length === 0) {
        window.turnstile.render('#myWidget', {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => {
            console.log('Turnstile token:', token);
            setTurnstileToken(token);
          },
        });
      } else {
        console.warn('Turnstile widget has already been rendered in this container');
      }
    };

    // Load the Turnstile script if it hasn't been loaded yet
    if (typeof window.turnstile === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.body.appendChild(script);
    } else {
      console.warn('Turnstile script is already loaded');
      renderTurnstile();
    }
  }, []);



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
        body: JSON.stringify({ prompt: userList[0], model: selectedModel, token: turnstileToken }),
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

        {/* <div className="model-selection">
          <label>Model</label>
          <select>
            <option value="llama-3.1-8b-instruct">
              llama-3.1-8b-instruct (Beta)
            </option>
          </select>
        </div> */}

        <ModelSelection onModelChange={setSelectedModel}/>

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
      <div className="checkbox mb-3">
        <div id="myWidget"></div>
        <div className="run-message">
          Send messages and generate a response
        </div>
      </div>
        
      <div className="run-message">&nbsp;</div>
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
