import { Request, Response } from "express";
import path from "path";
import { cloneRepository } from "../services/git.service";

import {
  readRepositoryDocuments,
  getRepositoryFiles,
  getRepositoryFileContent,
} from "../services/repository.service";

import { splitDocuments } from "../services/chunk.service";
import { indexDocuments } from "../services/index.service";
import { askRepository } from "../services/chat.service";
import { createRepositoryReport } from "../services/report.service";

import {
  saveRepository,
  getRepositoryPath,
} from "../services/repository-store.service";


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

    const documents =
      await readRepositoryDocuments(
        repoPath
      );

    const chunks =
      await splitDocuments(
        documents
      );

    // Collection name = repository folder name
   const collectionName =
  `${path.basename(repoPath).toLowerCase()}-gemini`;

    /*
     * Save the relationship between the
     * ChromaDB collection and the cloned
     * repository path.
     */
    saveRepository(
      collectionName,
      repoPath
    );

    await indexDocuments(
      chunks,
      collectionName
    );

    return res.json({
      success: true,
      repository: repoPath,
      branch: branch ?? "default",
      collectionName,
      totalDocuments:
        documents.length,
      totalChunks:
        chunks.length,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Repository analysis failed",
    });
  }
}


export async function chatWithRepository(
  req: Request,
  res: Response
) {
  try {
    const {
      collectionName,
      question,
    } = req.body;

    if (
      !collectionName ||
      !question
    ) {
      return res.status(400).json({
        success: false,
        message:
          "collectionName and question are required",
      });
    }

    const result =
      await askRepository(
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
      message:
        "Failed to answer question",
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
        message:
          "collectionName is required",
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


/*
 * Get actual files from the analyzed repository.
 *
 * GET:
 * /api/repository/files?collectionName=gitsenseai
 */
export async function getRepositoryFileTree(
  req: Request,
  res: Response
) {
  try {
    const {
      collectionName,
    } = req.query;

    if (!collectionName) {
      return res.status(400).json({
        success: false,
        message:
          "collectionName is required",
      });
    }

    const repositoryPath =
      getRepositoryPath(
        String(collectionName)
      );

    if (!repositoryPath) {
      return res.status(404).json({
        success: false,
        message:
          "Repository not found. Please analyze the repository again.",
      });
    }

    const files =
      getRepositoryFiles(
        repositoryPath
      );

    return res.json({
      success: true,
      files,
    });

  } catch (error) {
    console.error(
      "Failed to get repository files:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load repository files",
    });
  }
}


/*
 * Get actual content of a repository file.
 *
 * GET:
 * /api/repository/file?collectionName=gitsenseai&filePath=src/app.ts
 */
export async function getRepositoryFile(
  req: Request,
  res: Response
) {
  try {
    const {
      collectionName,
      filePath,
    } = req.query;

    if (
      !collectionName ||
      !filePath
    ) {
      return res.status(400).json({
        success: false,
        message:
          "collectionName and filePath are required",
      });
    }

    const repositoryPath =
      getRepositoryPath(
        String(collectionName)
      );

    if (!repositoryPath) {
      return res.status(404).json({
        success: false,
        message:
          "Repository not found. Please analyze the repository again.",
      });
    }

    const content =
      getRepositoryFileContent(
        repositoryPath,
        String(filePath)
      );

    return res.json({
      success: true,
      filePath,
      content,
    });

  } catch (error) {
    console.error(
      "Failed to get repository file:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load file",
    });
  }
}