import { Request, Response } from "express";
import { cloneRepository } from "../services/git.service";
import { readRepositoryDocuments } from "../services/repository.service";
import { splitDocuments } from "../services/chunk.service";
import { indexDocuments } from "../services/index.service";
import { askRepository } from "../services/chat.service";
import { createRepositoryReport } from "../services/report.service";

export async function analyzeRepository(
  req: Request,
  res: Response
) {
  try {
    const { repoUrl, branch } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        success: false,
        message: "Repository URL is required",
      });
    }

    console.log(
      `Analyzing repository: ${repoUrl}`
    );

    console.log(
      `Branch: ${branch ?? "default branch"}`
    );

    const repoPath = await cloneRepository(
      repoUrl,
      branch
    );

    const documents = await readRepositoryDocuments(
      repoPath
    );

    const chunks = await splitDocuments(
      documents
    );

    // Collection name = repository folder name
    const collectionName = repoPath
      .split("\\")
      .pop()
      ?.toLowerCase()!;

    await indexDocuments(
      chunks,
      collectionName
    );

    return res.json({
      success: true,
      repository: repoPath,
      branch: branch ?? "default",
      collectionName,
      totalDocuments: documents.length,
      totalChunks: chunks.length,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Repository analysis failed",
    });
  }
}
export async function chatWithRepository(
  req: Request,
  res: Response
) {
  try {
    const { collectionName, question } = req.body;

    if (!collectionName || !question) {
      return res.status(400).json({
        success: false,
        message: "collectionName and question are required",
      });
    }

    const result = await askRepository(
      collectionName,
      question
    );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to answer question",
    });
  }
}
export async function generateRepositoryReport(
  req: Request,
  res: Response
) {
  try {
    const {
      collectionName,
      repositoryName,
    } = req.body;

    if (!collectionName) {
      return res.status(400).json({
        success: false,
        message: "collectionName is required",
      });
    }

    const name =
      repositoryName ||
      collectionName;

    console.log(
      `Generating report for collection: ${collectionName}`
    );

    const result =
      await createRepositoryReport(
        collectionName,
        name
      );

    console.log(
      "Repository report generated successfully."
    );

    return res.download(
      result.pdfPath,
      `${name}-report.pdf`,
      (error) => {
        if (error) {
          console.error(
            "PDF download error:",
            error
          );
        }
      }
    );

  } catch (error) {
    console.error(
      "Report generation failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate repository report",
    });
  }
}