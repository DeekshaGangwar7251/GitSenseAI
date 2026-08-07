type Props = {
  progress: number;
};

function ProgressBar({
  progress,
}: Props) {
  return (
    <div>

      <div className="mb-2 flex justify-between">

        <span className="text-sm text-gray-500">
          Progress
        </span>

        <span className="font-semibold">
          {progress}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-200">

        <div
          style={{
            width: `${progress}%`,
          }}
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-700"
        />

      </div>

    </div>
  );
}

export default ProgressBar;