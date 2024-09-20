import React from "react";

interface MessageInputProps {
  userMessage: string;
  setUserMessage: (message: string) => void;
  handleAddMessage: () => void;
  isInputHighlighted: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  userMessage,
  setUserMessage,
  handleAddMessage,
  isInputHighlighted,
}) => {
  return (
    <div className={`message-box ${isInputHighlighted ? "highlight" : ""}`}>
      <textarea
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Ask AI LLM Anything..."
        rows={3}
        style={{ resize: "none", width: "100%" }}
      />
      <button onClick={handleAddMessage} className="ask-button">Ask</button>
    </div>
  );
};

export default MessageInput;
