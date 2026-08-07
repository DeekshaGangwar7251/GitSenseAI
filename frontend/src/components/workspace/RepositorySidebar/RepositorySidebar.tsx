import FileTree from "../FileTree/FileTree";
import { repositoryTree } from "../../../data/repositoryTree";

type Props = {
  onFileSelect: (id: string) => void;
};

function RepositorySidebar({ onFileSelect }: Props) {
  return (
    <aside
      className="
        w-80
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <h2 className="mb-6 text-xl font-bold">
        Repository Explorer
      </h2>

      <div className="space-y-2">
        {repositoryTree.map((node) => (
          <FileTree
            key={node.id}
            node={node}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </aside>
  );
}

export default RepositorySidebar;