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

1. Update the following files with your credentials and paths:

- `.env`
- `config/default.json`

```bash
cd ~/src/oracle-23ai-vector-tutorial
# Update with your API_KEY
vi .env
# Update username, password and connectString. Update the other vars if required
vi config/default.json
```

2. Connect to the Oracle 23ai with the same user configured on config.json and create the vector table. The table name have to match the configuration file.

```bash
sqlplus 'USERNAME/PASSWORD@testvector23ai_medium'
```
```sql
CREATE TABLE
    vectortest1 (
        id VARCHAR2(40) PRIMARY KEY,
        file_name VARCHAR2(1024),
        content VARCHAR2 (32767),
        embedding VECTOR
    );
```

3. Install the dependencies

```bash
cd ~/src/oracle-23ai-vector-tutorial
npm install
```
---

## How to Run

1. Set up your environment:

```bash
# Load Oracle environment
. oraenv <<EOF
client
/opt/oracle/instantclient_23_8
EOF

# Oracle config
export TNS_ADMIN=${ORACLE_HOME}/network/admin/23ai/
export LD_LIBRARY_PATH=${ORACLE_HOME}:$LD_LIBRARY_PATH
```

2. Load PDF or text files into Oracle vector DB. Place your files under the `data/` directory. Then run:

```bash
npx tsx demo/loadVectorData.ts data/

## OUTPUT
[2025-07-22T11:12:46.949] [INFO] default - Loading files from dir: [data/]
[2025-07-22T11:12:46.952] [INFO] default - Connecting to database: 23ai - testvector23ai_high
[2025-07-22T11:12:53.318] [INFO] default - Connected to Oracle Autonomous DB!
[2025-07-22T11:12:53.320] [INFO] default - Loading LlamaParse
[2025-07-22T11:12:53.321] [INFO] default - Loading data from [data/]
[2025-07-22T11:12:55.197] [INFO] default - Loading storage context
[2025-07-22T11:12:55.198] [INFO] default - Split text and create embeddings. Store them in a VectorStoreIndex
[2025-07-22T11:13:18.142] [INFO] default - Adding documents: Total embeddings - 198
[2025-07-22T11:13:18.159] [INFO] default - Loading f2fd3d68-f0e4-4e6c-a699-8f44ac2d7fcb - exacm-exacs-maa-bestpractices-3428012.pdf
...
```

3. Run a direct vector query (Oracle DB only). This will display the raw data retreived from the database

```bash
npx tsx demo/Query23aiVector.ts

### OUTPUT
[2025-07-22T11:15:52.797] [INFO] default - Connecting to database: 23ai - testvector23ai_high
[2025-07-22T11:15:53.832] [INFO] default - Connected to Oracle Autonomous DB!
[2025-07-22T11:15:53.833] [INFO] default - 
Enter a phrase. Type 'quit' or 'exit' to exit: 
tell me about red fruits
[2025-07-22T11:16:00.297] [INFO] default - Searching for: tell me about red fruits
{
  ids: [
    'fd44e7bb-a27f-428b-80a7-0bdf14f72cd3',
    'd2d2fd1a-4f96-4a3c-95b8-755c0faa78fb',
    'ea649def-97c7-4c74-9960-85fd324aa38e',
    'a40caffb-04c4-40e1-a451-dba54ba0c7fe',
    '4f11c8d2-5ac2-48e6-aa36-a1a671c55c1b'
  ],
  similarities: [
    0.7603989366637377,
    0.8145588181888892,
    0.817172393695672,
    0.828347117847716,
    0.9143652984993617
  ],
  nodes: [
    Document {
      id_: 'fd44e7bb-a27f-428b-80a7-0bdf14f72cd3',
      metadata: [Object],
      excludedEmbedMetadataKeys: [],
      excludedLlmMetadataKeys: [],
      relationships: {},
      embedding: undefined,
      text: 'Ripe raspberries are red.',
      textTemplate: '',
      metadataSeparator: '\n'
    },
    Document {
      id_: 'd2d2fd1a-4f96-4a3c-95b8-755c0faa78fb',
      metadata: [Object],
      excludedEmbedMetadataKeys: [],
      excludedLlmMetadataKeys: [],
      relationships: {},
      embedding: undefined,
      text: 'Ripe cherries are red.',
      textTemplate: '',
      metadataSeparator: '\n'
    }
...
```

4. Run a LLaMAIndex-based query. This will query the Oracle 23ai Vector and send the output for the llama for parsing and better output

Ensure you have `ollama` running with the `llama3` model:

```bash
ollama run llama3
npx tsx demo/queryVector.ts

### OUTPUT
[2025-07-22T11:17:24.709] [INFO] default - Connecting to database: 23ai - testvector23ai_high
[2025-07-22T11:17:25.822] [INFO] default - Connected to Oracle Autonomous DB!
[2025-07-22T11:17:25.823] [INFO] default - Load vectorStore
[2025-07-22T11:17:25.824] [INFO] default - 
Enter a phrase. Type 'quit' or 'exit' to exit: 
Tell me about red fruits
[2025-07-22T11:17:33.231] [INFO] default - Query the index
[2025-07-22T11:18:03.050] [INFO] default - Returning response
Based on the given context information, I can conclude that:

Red fruits are ripe raspberries and ripe cherries.

[2025-07-22T11:18:03.051] [INFO] default - 
Enter a phrase. Type 'quit' or 'exit' to exit: 
When is Oracle CloudWorld

[2025-07-22T11:18:15.162] [INFO] default - Query the index
[2025-07-22T11:19:03.747] [INFO] default - Returning response
Based on the provided context information, there are two instances of Oracle CloudWorld:

1. Oracle CloudWorld London - This event will take place on 14 March 2024.
2. Oracle CloudWorld Dubai - This event will take place on 23 January 2024.

So, the answer to the query "When is Oracle CloudWorld?" is that it can occur on either 23 January 2024 (in Dubai) or 14 March 2024 (in London), depending on the specific instance.

...
```

---
