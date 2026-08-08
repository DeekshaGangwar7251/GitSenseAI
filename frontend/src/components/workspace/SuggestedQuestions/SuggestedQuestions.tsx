

type Props = {
  onQuestionClick: (question: string) => void;
};

const questions = [
  "Explain project architecture",
  "How does authentication work?",
  "Generate README",
  "Find potential bugs",
  "Explain folder structure",
];

function SuggestedQuestions({ onQuestionClick }: Props) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Suggested Questions
      </h3>

      <div className="flex flex-wrap gap-4">
        {questions.map((question) => (
          <button
            key={question}
            onClick={() => onQuestionClick(question)}
            className="
              rounded-full
              border
              border-violet-200
              bg-violet-50
              px-5
              py-3
              text-sm
              font-medium
              text-violet-700
              transition-all
              hover:scale-105
              hover:bg-violet-100
            "
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;