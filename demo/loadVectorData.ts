import { EmbeddingObject } from './indexDocuments'
import { logger } from './applog';

import { Ollama, Settings, HuggingFaceEmbedding } from "llamaindex"

Settings.llm = new Ollama({
    model: "llama3",
});

// BAAI/bge-small-en-v1.5
Settings.embedModel = new HuggingFaceEmbedding({
    modelType: "BAAI/bge-large-en-v1.5",
    quantized: false,
});

async function main(path: string) {
    const { loadOracleVector, loadIndexData } = EmbeddingObject()
    logger.info(`Loading files from dir: [${path}]`)
    const vectorStore = await loadOracleVector()
    await loadIndexData(vectorStore, path)
}

const args = process.argv
const filePath = args[2]

if (args.length != 3) {
    logger.error(`Usage: loadVectorData.ts filePath`)
    process.exit(0)
}

main(filePath).catch(console.error);