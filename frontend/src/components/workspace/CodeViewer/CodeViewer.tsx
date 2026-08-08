type Props = {
  fileName: string;
  code: string;
};

function CodeViewer({
  fileName,
  code,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">
          {fileName}
        </h2>
      </div>

      {/* Code */}
      <div className="max-h-[600px] overflow-auto bg-gray-950 p-6">
        <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-200">
          <code>{code}</code>
        </pre>
      </div>

    </div>
  );
}

export default CodeViewer;