import { Sparkles } from "lucide-react";
import SuggestedQuestions from "../SuggestedQuestions/SuggestedQuestions";


type Props = {
  onQuestionClick: (question: string) => void;
};



function WelcomeCard({ onQuestionClick }: Props) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-8 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-violet-600 p-3 text-white">
          <Sparkles size={24} />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to GitSenseAI 👋
          </h2>

          <p className="mt-2 text-gray-600">
            Your repository has been analyzed successfully.
            Ask anything about the codebase.
          </p>
        </div>

      </div>

      <SuggestedQuestions onQuestionClick={onQuestionClick} />

    </div>
  );
}

export default WelcomeCard;