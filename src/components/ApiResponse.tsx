import React from "react";
import "../assets/css/ApiResponse.css";

interface ApiResponseProps {
  apiResponse: string | null;
}

const ApiResponse: React.FC<ApiResponseProps> = ({ apiResponse }) => {
  if (!apiResponse) return null;
  return (
    <div className="api-response-container">
      <div className="api-response">
        <p>{apiResponse}</p>
      </div>
    </div>
  );
};

export default ApiResponse;
