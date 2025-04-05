import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionsRow = ({
  onPromptSuggestionClick,
}: {
  onPromptSuggestionClick: (prompt: string) => void;
}) => {
  const promptSuggestions = [
    "What is the capital of France?",
    "What is the capital of Germany?",
    "What is the capital of Italy?",
    "What is the capital of Spain?",
    "What is the capital of Portugal?",
  ];
  return (
    <div className="flex flex-row flex-wrap gap-3">
      {promptSuggestions.map((prompt, index) => (
        <PromptSuggestionButton
          key={index}
          text={prompt}
          onClick={() => onPromptSuggestionClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionsRow;
