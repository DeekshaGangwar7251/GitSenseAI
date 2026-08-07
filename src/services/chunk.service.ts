import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function splitDocuments(
  documents: Document[]
): Promise<Document[]> {

  const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1800,
  chunkOverlap: 300,
  separators: [
    "\n\n",
    "\n",
    " ",
    "",
  ],
});

  const chunks = await splitter.splitDocuments(documents);

  return chunks;
}
