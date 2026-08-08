import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

import { searchRepository } from "./search.service";
import { llm } from "./llm.service";

interface ReportSection {
  title: string;
  query: string;
}

const REPORT_SECTIONS: ReportSection[] = [
  {
    title: "Repository Overview",
    query:
      "README project purpose application description main features functionality",
  },

  {
    title: "Architecture",
    query:
      "frontend backend architecture application flow modules services controllers components entry point",
  },

  {
    title: "Technologies Used",
    query:
      "package.json dependencies imports frameworks libraries programming languages runtime",
  },

  {
    title: "Folder and File Structure",
    query:
      "folders directories files src components pages services controllers routes models configuration",
  },

  {
    title: "Backend Analysis",
    query:
      "backend Express Node server controllers services middleware routes business logic API",
  },

  {
    title: "Frontend Analysis",
    query:
      "frontend React components pages hooks state management routing UI client",
  },

  {
    title: "APIs and Routes",
    query:
      "router routes endpoints GET POST PUT PATCH DELETE API controller request response",
  },

  {
    title: "Authentication and Authorization",
    query:
      "JWT authentication authorization login signup token session OAuth middleware protected routes",
  },

  {
    title: "Database and Storage",
    query:
      "MongoDB MySQL PostgreSQL database schema model Mongoose Prisma Redis ChromaDB vector storage",
  },

  {
    title: "Important Components",
    query:
      "important core files modules services controllers utilities functions classes main components",
  },

  {
    title: "Potential Issues and Bugs",
    query:
      "TODO FIXME error exception catch validation security vulnerability hardcoded secret bug",
  },

  {
    title: "Recommendations",
    query:
      "code quality security performance scalability maintainability testing architecture improvements",
  },
];

/* ---------------------------------------------------------
   Clean repository chunks
--------------------------------------------------------- */

function cleanEvidence(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 2500);
}

/* ---------------------------------------------------------
   Collect small amount of evidence
--------------------------------------------------------- */

async function collectSectionEvidence(
  collectionName: string,
  section: ReportSection
): Promise<string> {
  try {
    const results = await searchRepository(
      collectionName,
      section.query,
      2
    );

    const documents = results.documents || [];
    const metadatas = results.metadatas || [];

    if (documents.length === 0) {
      return "Not identified in the indexed repository.";
    }

    let evidence = "";

    for (let i = 0; i < documents.length; i++) {
      const metadata = metadatas[i];

      const fileName =
        metadata?.relativePath ||
        metadata?.fileName ||
        "Unknown file";

      evidence += `
FILE: ${fileName}

${cleanEvidence(documents[i])}

-----------------------------
`;
    }

    return evidence.slice(0, 5500);
  } catch (error) {
    console.error(
      `Evidence collection failed for ${section.title}:`,
      error
    );

    return "Not identified in the indexed repository.";
  }
}

/* ---------------------------------------------------------
   Generate ONE section at a time
--------------------------------------------------------- */

async function generateSection(
  section: ReportSection,
  evidence: string
): Promise<string> {
  console.log(`Generating section: ${section.title}`);

  const prompt = `
You are a senior software architect analyzing a real software repository.

Generate ONLY the "${section.title}" section.

IMPORTANT RULES:

- Use ONLY the repository evidence provided below.
- Never invent technologies, files, APIs, databases, authentication,
  features or functionality.
- Do not assume something exists because it is common.
- Mention actual filenames when available.
- Distinguish source code from comments, dummy data and documentation.
- If evidence is insufficient, write:
  "Not identified in the indexed repository."
- Avoid generic filler.
- Keep the answer concise but technically useful.
- Maximum 350 words.
- Do not repeat the section title.

Repository Evidence:

${evidence}

Now write the section.
`;

  try {
    const response = await llm.invoke(prompt);

    return String(response.content).trim();
  } catch (error: any) {
    console.error(
      `LLM failed for ${section.title}:`,
      error?.message || error
    );

    return "Not identified in the indexed repository.";
  }
}

/* ---------------------------------------------------------
   Generate complete markdown report
--------------------------------------------------------- */

async function generateReportMarkdown(
  collectionName: string,
  repositoryName: string
): Promise<string> {
  console.log(
    `Generating professional report for ${repositoryName}`
  );

  const generatedSections: string[] = [];

  for (const section of REPORT_SECTIONS) {
    console.log(
      `\nCollecting evidence: ${section.title}`
    );

    const evidence = await collectSectionEvidence(
      collectionName,
      section
    );

    console.log(
      `Generating AI analysis: ${section.title}`
    );

    const sectionContent = await generateSection(
      section,
      evidence
    );

    generatedSections.push(
      `# ${section.title}\n\n${sectionContent}`
    );
  }

  const report = `
# Repository Analysis Report

## Repository: ${repositoryName}

Generated by GitSenseAI using semantic search, RAG and LLM-based repository analysis.

${generatedSections.join("\n\n")}
`;

  return report.trim();
}

/* ---------------------------------------------------------
   Markdown → Professional PDF
--------------------------------------------------------- */

export async function generateReportPDF(
  report: string,
  repositoryName: string
): Promise<string> {
  const reportsDirectory = path.join(
    process.cwd(),
    "reports"
  );

  if (!fs.existsSync(reportsDirectory)) {
    fs.mkdirSync(reportsDirectory, {
      recursive: true,
    });
  }

  const safeRepositoryName = repositoryName.replace(
    /[^a-zA-Z0-9-_]/g,
    "_"
  );

  const fileName = `${safeRepositoryName}-report-${Date.now()}.pdf`;

  const filePath = path.join(
    reportsDirectory,
    fileName
  );

  const doc = new PDFDocument({
    size: "A4",

    margins: {
      top: 60,
      bottom: 60,
      left: 55,
      right: 55,
    },

    bufferPages: true,
  });

  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  /* =========================
     COVER PAGE
  ========================= */

  doc.moveDown(5);

  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .text("GitSenseAI", {
      align: "center",
    });

  doc.moveDown(1);

  doc
    .font("Helvetica-Bold")
    .fontSize(21)
    .text("Repository Analysis Report", {
      align: "center",
    });

  doc.moveDown(2);

  doc
    .font("Helvetica")
    .fontSize(13)
    .text(`Repository: ${repositoryName}`, {
      align: "center",
    });

  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .text(
      `Generated: ${new Date().toLocaleDateString()}`,
      {
        align: "center",
      }
    );

  doc.moveDown(3);

  doc
    .fontSize(11)
    .text(
      "AI-powered repository analysis using semantic search, RAG and LLM-based reasoning.",
      {
        align: "center",
        width: 450,
      }
    );

  doc.addPage();

  /* =========================
     TABLE OF CONTENTS
  ========================= */

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("Contents");

  doc.moveDown(1);

  REPORT_SECTIONS.forEach((section, index) => {
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        `${index + 1}. ${section.title}`,
        {
          paragraphGap: 6,
        }
      );
  });

  doc.addPage();

  /* =========================
     REPORT CONTENT
  ========================= */

  const lines = report.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      doc.moveDown(0.35);
      continue;
    }

    /* Main heading */

    if (trimmed.startsWith("# ")) {
      doc.moveDown(0.8);

      doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .text(
          trimmed.replace(/^#\s+/, "")
        );

      doc.moveDown(0.3);

      continue;
    }

    /* Secondary heading */

    if (trimmed.startsWith("## ")) {
      doc.moveDown(0.6);

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .text(
          trimmed.replace(/^##\s+/, "")
        );

      doc.moveDown(0.2);

      continue;
    }

    /* Bullet */

    if (
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ")
    ) {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          `• ${trimmed.substring(2)}`,
          {
            indent: 12,
            paragraphGap: 4,
            lineGap: 2,
          }
        );

      continue;
    }

    /* Numbered list */

    if (/^\d+\.\s/.test(trimmed)) {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(trimmed, {
          indent: 10,
          paragraphGap: 4,
          lineGap: 2,
        });

      continue;
    }

    /* Normal paragraph */

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(trimmed, {
        align: "left",
        lineGap: 3,
        paragraphGap: 7,
      });
  }

  /* =========================
     FOOTERS
  ========================= */

  const range = doc.bufferedPageRange();

  for (
    let page = range.start;
    page < range.start + range.count;
    page++
  ) {
    doc.switchToPage(page);

    const pageNumber =
      page - range.start + 1;

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(
        `GitSenseAI • Repository Analysis Report • Page ${pageNumber}`,
        55,
        805,
        {
          align: "center",
          width: 485,
        }
      );
  }

  doc.end();

  await new Promise<void>(
    (resolve, reject) => {
      stream.on("finish", () => resolve());
      stream.on("error", reject);
    }
  );

  console.log(
    `Report generated: ${filePath}`
  );

  return filePath;
}

/* ---------------------------------------------------------
   Public API
--------------------------------------------------------- */

export async function createRepositoryReport(
  collectionName: string,
  repositoryName: string
): Promise<{
  report: string;
  pdfPath: string;
}> {
  console.log(
    `Generating high-quality report for ${repositoryName}`
  );

  const report =
    await generateReportMarkdown(
      collectionName,
      repositoryName
    );

  const pdfPath =
    await generateReportPDF(
      report,
      repositoryName
    );

  return {
    report,
    pdfPath,
  };
}