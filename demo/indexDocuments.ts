import dotenv from 'dotenv';
import config from 'config';

import OracleVectorStore from "./OracleVectorStore"

import { VectorStoreIndex, storageContextFromDefaults, SimpleDirectoryReader, LlamaParseReader } from "llamaindex"
import { logger } from './applog';

export const EmbeddingObject = () => {

    const loadIndexData = async (vectorStore: any, filePath: string) => {
        dotenv.config();
        logger.info('Loading LlamaParse')
        const reader = new LlamaParseReader({ resultType: "text" });
        logger.info(`Loading data from [${filePath}]`)
        const documents = await new SimpleDirectoryReader().loadData({
            defaultReader: reader,
            directoryPath: filePath
        });
        logger.info('Loading storage context')
        const ctx = await storageContextFromDefaults({ vectorStore: vectorStore });
        logger.info('Split text and create embeddings. Store them in a VectorStoreIndex')
        const index = await VectorStoreIndex.fromDocuments(documents, {
            storageContext: ctx,
        });
        return index
    }

    const loadOracleVector = async () => {
        const tableName: string = config.get("oracle.tableName") as string
        const vectorStore = new OracleVectorStore({
            dbName: "23ai",
            tableName: tableName
        });
        await vectorStore.init()
        return vectorStore
    }

    return {
        loadIndexData,
        loadOracleVector
    }

}