import { useRef, useState } from "react";
import "./assets/css/App.css";
import Footer from "./components/Footer";
import MessageInput from "./components/MessageInput";
import UserList from "./components/UserList";
import ApiResponse from "./components/ApiResponse";
import ModelSelection from "./components/ModelSelection";
import TurnstileWidget from "./components/TurnstileWidget";

const apiUrl = import.meta.env.DEV
  ? "http://localhost:8790"
  : "https://cf-llama-3.vinodh-jeevanantham.workers.dev";

const siteKey = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_SITE_KEY
  : import.meta.env.VITE_PROD_SITE_KEY;

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
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [isCaptchaHighlighted, setIsCaptchaHighlighted] = useState(false);

  const turnstileRef = useRef<{ resetTurnstile: () => void } | null>(null);

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

    if (turnstileToken === "") {
      setErrorMessage("Please check the CAPTCHA box");
      setIsCaptchaHighlighted(true);
      return;
    }

    setErrorMessage("");
    setIsInputHighlighted(false);
    setIsCaptchaHighlighted(false);
    setApiResponse(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/`, {
        method: "POST",
        body: JSON.stringify({
          prompt: userList[0],
          model: selectedModel,
          token: turnstileToken,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = (await response.json()) as ApiResponseData;
      setApiResponse(data?.response || "No response from API");

      // Reset the Turnstile widget after the request
      if (turnstileRef.current) {
        turnstileRef.current.resetTurnstile();
      }
    } catch (error) {
      console.error("Error fetching API:", error);
      setApiResponse(`Error fetching the API : ${error}`);
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

        <ModelSelection onModelChange={setSelectedModel} />

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
        <TurnstileWidget
          ref={turnstileRef}
          siteKey={siteKey}
          setTurnstileToken={setTurnstileToken}
          isCaptchaHighlighted={isCaptchaHighlighted}
          setIsCaptchaHighlighted={setIsCaptchaHighlighted}
          setErrorMessage={setErrorMessage}
        />
        <div className="run-message">&nbsp;</div>
        <button className="clear-button" onClick={handleClear} disabled={isLoading}>
          Clear
        </button>
        &nbsp;&nbsp;
        <button className="run-button" onClick={handleRun} disabled={isLoading}>
          {isLoading ? "Running..." : "Run ✨"}
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default App;
