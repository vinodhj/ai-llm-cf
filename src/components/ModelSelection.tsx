import React, { useEffect, useState } from "react";
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://playground.ai.cloudflare.com/api',
    withCredentials: true,
  });

interface Model {
  id: string;
  name: string;
  description: string;
}

const ModelSelection: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data } = await apiClient.get<Model[]>('/models');
        setModels(data);
        // const response = await fetch("https://playground.ai.cloudflare.com/api/models", {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        // const responseData = await response.json(); // Try parsing the response data as JSON
        // console.log("responseData", responseData); // Log the parsed response data
        // if (!response.ok) {
        //   throw new Error(`Error fetching models: ${response.statusText}`);
        // }

        // const data = (await response.json()) as Model[];
        // setModels(data);
      } catch (error) {
        setError("Failed to fetch models. Please try again later.");
      }
    };

    fetchModels();
  }, []);

  return (
    <div className="model-selection">
      <label>Model</label>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <select>
          {models.length > 0 ? (
            models.map((model) => (
              <option key={model.id} value={model.name}>
                {model.name}
              </option>
            ))
          ) : (
            <option>Loading models...</option>
          )}
        </select>
      )}
    </div>
  );
};

export default ModelSelection;
