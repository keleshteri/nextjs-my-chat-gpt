

const PromptSuggestionButton = ({text, onClick}: {text: string, onClick: () => void}) => {
    return (
        <div>
            <button className="prompt-suggestion-button" onClick={onClick}>
                 {text}
            </button>
        </div>
    )
}

export default PromptSuggestionButton;

