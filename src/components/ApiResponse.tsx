import React from "react";

interface ApiResponseProps {
  apiResponse: string | null;
}

const ApiResponse: React.FC<ApiResponseProps> = ({ apiResponse }) => {
  if (!apiResponse) return null;
  
  return (
    <div className="api-response">
      <p>{apiResponse}</p>
    </div>
  );
};

export default ApiResponse;
