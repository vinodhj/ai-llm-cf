import React, { useEffect, useState } from "react";

const apiUrl = import.meta.env.DEV
  ? "http://localhost:8790"
  : "https://cf-llama-3.vinodh-jeevanantham.workers.dev";



interface Model_json {
  models :  Model[]
}
interface Model {
  id: string;
  name: string;
  description: string;
}

const defaultModelId = "41975cc2-c82e-4e98-b7b8-88ffb186a545";

const ModelSelection: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(defaultModelId); // default value
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        
        const response = await fetch(`${apiUrl}/cf-models`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Error fetching models: ${response.statusText}`);
        }

        const data = (await response.json()) as Model_json;
        setModels(data.models);
        
        // Check if the default model exists in the fetched data
        const defaultModel = data.models.find((model) => model.id === defaultModelId);
        if (defaultModel) {
          setSelectedModel(defaultModel.name); // Set the default model's name
        }

      } catch (error) {
        console.error('Error fetching models:', error);
        setError("Failed to fetch models. Please try again later.");
      }
    };

    fetchModels();
  }, []);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  return (
    <div className="model-selection">
      <label>Model</label>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <select value={selectedModel} onChange={handleModelChange}>
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
