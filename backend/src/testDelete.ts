import "dotenv/config";
import { deleteCollection } from "./services/vector.service";

async function main() {
  await deleteCollection("gitsenseAI");
  console.log("Collection deleted successfully!");
}

main().catch(console.error);