import React, { useEffect, useState, useRef } from "react";
import "../assets/css/ModelSelection.css";

const apiUrl = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_API_URL
  : import.meta.env.VITE_PROD_API_URL;


interface Model {
  id: string;
  name: string;
  description: string;
}

interface Model_json {
  models: Model[];
}

interface ModelSelectionProps {
  onModelChange: (modelId: string) => void; // Callback to pass the selected model ID
}

const defaultModelId = "41975cc2-c82e-4e98-b7b8-88ffb186a545";

const ModelSelection: React.FC<ModelSelectionProps> = ({ onModelChange }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(defaultModelId); // default value
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to the dropdown container to detect outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          onModelChange(defaultModel.name); // Pass the default model name to the parent
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setError("Failed to fetch models. Please try again later.");
      }
    };

    fetchModels();
  }, [onModelChange]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (model: Model) => {
    setSelectedModel(model.name);
    onModelChange(model.name);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up the event listener
    };
  }, [isOpen]);


  return (
    <div className="model-selection" ref={dropdownRef}>
      <label>Model</label>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div
          className={`custom-select-container ${isOpen ? "open" : ""}`}
          onClick={toggleDropdown}
        >
          <span>{selectedModel}</span>
          <span className="custom-select-arrow">▲</span>
          <div className={`custom-select-dropdown ${isOpen ? "open" : ""}`}>
            {models.length > 0 ? (
              models.map((model) => (
                <div
                  key={model.id}
                  className={`custom-select-option ${
                    model.name === selectedModel ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(model)}
                >
                  <span>{model.name}</span>
                  <span className="label">Beta</span> 
                </div>
              ))
            ) : (
              <div className="custom-select-option">Loading models...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelection;
