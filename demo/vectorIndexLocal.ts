import { EmbeddingObject } from './indexDocuments.js'
import { logger } from './applog';

import {
    HuggingFaceEmbedding,
    Ollama,
    Settings,
    VectorStoreIndex,
} from "llamaindex";


export const vectorIndexLocal = async () => {

    Settings.llm = new Ollama({
        model: "llama3",
    });

    // BAAI/bge-small-en-v1.5
    Settings.embedModel = new HuggingFaceEmbedding({
        modelType: "BAAI/bge-large-en-v1.5",
        quantized: false,
    })

    const { loadOracleVector } = EmbeddingObject()

    const vectorStore = await loadOracleVector()
    logger.info('Load vectorStore')
    let index = await VectorStoreIndex.fromVectorStore(vectorStore)

    let queryEngine, response
    // { responseSynthesizer }
    queryEngine = await index.asQueryEngine();

    const faqQuery = async (query: string) => {
        try {
            logger.info('Query the index')
            response = await queryEngine.query({
                query: query,
            });
            logger.info('Returning response')
            return response.toString()
        }
        catch (err) {
            logger.error(err)
        }

    }

    return { faqQuery }
}