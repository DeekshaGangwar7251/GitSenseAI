import "dotenv/config";
import { deleteCollection } from "./services/vector.service";

async function clear() {
  await deleteCollection("gitsenseai-gemini");
  console.log("Gemini collection cleared.");
}

clear().catch((error) => {
  console.error(error);
  process.exit(1);
});