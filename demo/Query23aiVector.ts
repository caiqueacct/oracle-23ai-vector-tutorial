import { logger } from './applog';
import { VectorStoreQuery, VectorStoreQueryMode } from "llamaindex";

import OracleVectorStore from './OracleVectorStore';
import config from 'config';
import { readLineAsync } from './utils';

const runQuery = async () => {
    const topK = 5; // Return the top 5 similar results
    const tableName: string = config.get('oracle.tableName')
    const vectorStore = new OracleVectorStore({
        dbName: "23ai",
        tableName: tableName
    });
    await vectorStore.init()
    while (true) {
        // Get the text input to vectorize
        logger.info("\nEnter a phrase. Type 'quit' or 'exit' to exit: ");
        const text = await readLineAsync();
        if (text === 'quit' || text === 'exit')
            break;
        if (text === '')
            continue;
        // Create the vector embedding [a JSON object]
        const sentence = [text];
        logger.info(`Searching for: ${sentence.toString()}`)
        const queryEmbedding = await vectorStore.embed(sentence.toString())
        const query: VectorStoreQuery = {
            queryEmbedding: queryEmbedding,
            similarityTopK: topK,
            mode: VectorStoreQueryMode.DEFAULT
        };
        const response = await vectorStore.query(query)
        console.debug(response)
    } // End of while loop
}

(async function run() {
    await runQuery()
})()