import "dotenv/config";

import {
  createRepositoryReport,
} from "./services/report.service";

async function main() {
  const collectionName = "gitsenseai";

  const repositoryName = "GitSenseAI";

  try {
    const result =
      await createRepositoryReport(
        collectionName,
        repositoryName
      );

    console.log("\n===== REPORT GENERATED =====\n");

    console.log(
      "PDF:",
      result.pdfPath
    );

    console.log("\nREPORT:\n");

    console.log(result.report);
  } catch (error) {
    console.error(
      "\nReport generation failed:\n",
      error
    );
  }
}

main();