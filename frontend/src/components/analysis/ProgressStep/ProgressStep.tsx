import { CheckCircle2, Loader2 } from "lucide-react";

type Props = {
  title: string;
  completed: boolean;
  active: boolean;
};

function ProgressStep({
  title,
  completed,
  active,
}: Props) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      {completed ? (
        <CheckCircle2
          className="text-green-500"
          size={28}
        />
      ) : active ? (
        <Loader2
          className="animate-spin text-violet-600"
          size={28}
        />
      ) : (
        <div className="h-7 w-7 rounded-full border-2 border-gray-300" />
      )}

      <p className="font-medium text-gray-700">
        {title}
      </p>

    </div>
  );
}

export default ProgressStep;