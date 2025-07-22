# Oracle 23ai Vector Search Tutorial with TypeScript and LLaMA3

This tutorial demonstrates how to use **Oracle 23ai Autonomous Database Vector Search** with **TypeScript** and **LLaMA3** to embed, store, and query documents in vector format.

---

## Project Overview

This repository provides a full pipeline for:

- Parsing and embedding PDF/documents using LlamaIndex
- Storing embeddings in Oracle 23ai Autonomous Database
- Querying via vector similarity using SQL
- Running the entire flow in TypeScript

---

## Requirements

- Node.js 18+
- Oracle 23ai Autonomous Database
- Oracle Instant Client (`instantclient_23_8` or newer)
- TypeScript with `tsx`
- `.env` file with your `LLAMA_CLOUD_API_KEY`
- Configured `oraenv` and `TNS_ADMIN`
- Optional: `ollama` with `llama3` model for enhanced querying

---

## Oracle Instant Client Installation

To interact with Oracle 23ai using the Node.js driver, install the Oracle Instant Client.

Follow the official instructions here:  
[Install Instant Client Using ZIP](https://docs.oracle.com/en/database/oracle/oracle-database/23/lacli/install-instant-client-using-zip.html#GUID-D3DCB4FB-D3CA-4C25-BE48-3A1FB5A22E84)

---

## Project Structure

```bash
├── demo/
│   ├── loadVectorData.ts     # Load and embed PDF data
│   ├── Query23aiVector.ts    # Query vector DB directly
│   └── queryVector.ts        # Query using LLaMAIndex
├── data/                     # Directory for your PDFs/texts
├── config/                   # Application configuration
├── .env                      # Environment variables and secrets
└── README.md
```

---

## Environment Setup

Update the following files with your credentials and paths:

- `.env`
- `config/default.json`

Then set up your environment:

```bash
# Load Oracle environment
. oraenv <<EOF
client
/opt/oracle/instantclient_23_8
EOF

# Oracle config
export TNS_ADMIN=${ORACLE_HOME}/network/admin
export LD_LIBRARY_PATH=${ORACLE_HOME}:$LD_LIBRARY_PATH
```

---

## How to Run

### 1. Install dependencies

```bash
cd ~/src/oracle-23ai-vector-tutorial
npm install
```

### 2. Load PDF or text files into Oracle vector DB

Place your files under the `data/` directory. Then run:

```bash
npx tsx demo/loadVectorData.ts data/
```

### 3. Run a direct vector query (Oracle DB only)

```bash
npx tsx demo/Query23aiVector.ts
```

### 4. Run a LLaMAIndex-based query

Ensure you have `ollama` running with the `llama3` model:

```bash
ollama run llama3
npx tsx demo/queryVector.ts
```

---
