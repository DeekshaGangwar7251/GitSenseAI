import type { RepositoryNode } from "../types/repository";

export const repositoryTree: RepositoryNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "components",
        name: "components",
        type: "folder",
        children: [
          {
            id: "navbar",
            name: "Navbar.tsx",
            type: "file",
          },
          {
            id: "hero",
            name: "Hero.tsx",
            type: "file",
          },
        ],
      },
      {
        id: "pages",
        name: "pages",
        type: "folder",
        children: [
          {
            id: "home",
            name: "Home.tsx",
            type: "file",
          },
        ],
      },
    ],
  },

  {
    id: "package",
    name: "package.json",
    type: "file",
  },

  {
    id: "readme",
    name: "README.md",
    type: "file",
  },
];