# GitSenseAI 

### AI-Powered GitHub Repository Analyzer

GitSenseAI is a full-stack web application that uses **LLMs and Retrieval-Augmented Generation (RAG)** to analyze GitHub repositories, understand their codebase, answer questions about the project, and generate a comprehensive technical report.

It combines **MERN stack development** with modern **Generative AI technologies** such as **Gemini API, LangChain, embeddings, and ChromaDB**.

---

##  Features

*  **GitHub Repository Analysis**
  Analyze a GitHub repository by providing its URL and branch.

*  **AI-Powered Codebase Understanding**
  Uses Gemini LLM to understand repository files and generate meaningful responses.

*  **RAG-Based Question Answering**
  Retrieves relevant code context from the repository before generating responses.

*  **Conversational Q&A**
  Ask natural-language questions about the repository and its implementation.

*  **Automated Technical Report**
  Generates a detailed 12-section report covering:

  1. Repository Overview
  2. Architecture
  3. Technologies Used
  4. Folder and File Structure
  5. Backend Analysis
  6. Frontend Analysis
  7. APIs and Routes
  8. Authentication and Authorization
  9. Database and Storage
  10. Important Components
  11. Potential Issues and Bugs
  12. Recommendations

*  **Interactive React Workspace**
  Provides an intuitive interface for repository exploration, AI analysis, and report viewing.

---

##  System Architecture

```text
                 GitHub Repository
                        │
                        ▼
                Repository Cloning
                        │
                        ▼
                 File Extraction
                        │
                        ▼
                  Text Chunking
                        │
                        ▼
              Gemini Embeddings
                        │
                        ▼
                   ChromaDB
                Vector Database
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       User Question       Report Generation
              │                   │
              ▼                   ▼
       Similarity Search    Context Retrieval
              │                   │
              └─────────┬─────────┘
                        ▼
                  Gemini LLM
                        │
                        ▼
              Generated Response
```

---

##  Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST APIs

### AI / GenAI

* Gemini API
* LangChain
* Large Language Models (LLMs)
* Retrieval-Augmented Generation (RAG)
* Text Embeddings

### Vector Database

* ChromaDB

### Tools & Deployment

* Git
* GitHub
* Postman
* Docker
* Render

---

##  How RAG Works in GitSenseAI

GitSenseAI does not simply send the entire repository directly to the LLM.

Instead, it follows a retrieval-based approach:

```text
Repository
    ↓
Read Files
    ↓
Split into Chunks
    ↓
Generate Embeddings
    ↓
Store in ChromaDB
    ↓
User Query
    ↓
Similarity Search
    ↓
Retrieve Relevant Code
    ↓
Send Context + Query to Gemini
    ↓
Generate Response
```

This helps the system provide responses based on the **actual repository code and context**.

---

##  Report Generation

GitSenseAI can automatically analyze the repository and generate a structured technical report.

The report includes:

| Section                 | Description                                 |
| ----------------------- | ------------------------------------------- |
| Repository Overview     | Purpose and functionality of the project    |
| Architecture            | Overall system architecture                 |
| Technologies Used       | Frameworks, libraries, and tools            |
| Folder & File Structure | Important directories and files             |
| Backend Analysis        | Backend implementation and logic            |
| Frontend Analysis       | Frontend structure and components           |
| APIs & Routes           | API endpoints and their purpose             |
| Authentication          | Authentication and authorization mechanisms |
| Database & Storage      | Database models and storage mechanisms      |
| Important Components    | Key modules and components                  |
| Potential Issues        | Possible bugs and weaknesses                |
| Recommendations         | Suggested improvements                      |

---

##  Usage

1. Open the GitSenseAI web application.
2. Enter a public GitHub repository URL.
3. Select the required branch.
4. Start repository analysis.
5. GitSenseAI processes and indexes the repository.
6. Explore the generated workspace.
7. Ask questions about the codebase.
8. Generate and view the complete technical report.

---

##  Why GitSenseAI?

Understanding a large codebase can be time-consuming, especially for developers working with unfamiliar projects.

GitSenseAI helps developers:

* Quickly understand unfamiliar repositories
* Explore project architecture
* Find relevant code
* Ask questions about implementation
* Identify potential issues
* Generate technical documentation automatically

---

##  Future Improvements

* Support for private GitHub repositories
* Multi-repository analysis
* Improved code-level bug detection
* Code dependency visualization
* GitHub pull-request analysis
* More advanced repository security analysis
* Support for additional LLM providers
* Improved multilingual code explanations

---

## 🔗 Live Demo

🚀 **[Try GitSenseAI Live](https://gitsenseai-4.onrender.com)**

📂 **[View Source Code](https://github.com/DeekshaGangwar7251/GitSenseAI)**

---

## 👩‍💻 Author

**Deeksha Gangwar**

B.Tech Information Technology
GitHub: [DeekshaGangwar7251](https://github.com/DeekshaGangwar7251)

---
