import oracledb from 'oracledb';
import {
    HuggingFaceEmbedding,
    HuggingFaceEmbeddingModelType,
    VectorStore,
    VectorStoreQuery,
    VectorStoreQueryResult,
    Document
} from "llamaindex";
import { OracleClient } from "./OracleClient"
import { logger } from "./applog";

export default class OracleVectorStore implements VectorStore {
    storesText = true;
    client: any;
    embedModel: any;
    dbName: string;
    tableName: string;
    embeddingModel: string = 'embed-multilingual-v3.0';

    constructor(config: { dbName: string, tableName: string }) {
        this.dbName = config.dbName;
        this.tableName = config.tableName;
    }

    async init() {
        const { connectADB } = await OracleClient();
        this.client = await connectADB(this.dbName);

        if (!this.embedModel) {
            this.embedModel = new HuggingFaceEmbedding({
                modelType: HuggingFaceEmbeddingModelType.XENOVA_ALL_MINILM_L6_V2
            });
        }
    }

    async embed(text: string): Promise<number[]> {
        return this.embedModel.getTextEmbedding(text)
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        return this.embedModel.embedDocuments(texts);
    }

    async embedQuery(text: string): Promise<number[]> {
        return this.embedModel.embedQuery(text);
    }

    async add(documents: any[]): Promise<string[]> {
        const ids: string[] = [];

        logger.info(`Adding documents: Total embeddings - ${documents.length}`)
        for (const doc of documents) {
            const id = doc.id ?? crypto.randomUUID();
            const text = doc.text || doc.getText();
            const embedding = await this.embed(text);
            const filename = doc.metadata.file_name
            logger.info(`Loading ${id} - ${filename}`)
            const sqlStmt = `BEGIN
              INSERT INTO ${this.tableName} (id, content, file_name, embedding)
              VALUES (
                :id,
                :text,
                :filename,
                :embed
              );
            END;`
            const float32VecArray = new Float32Array(embedding)

            await this.client.execute(
                sqlStmt,
                { id, text, filename, embed: float32VecArray }
            );

            ids.push(id);
        }

        return ids;
    }

    async query(query: VectorStoreQuery): Promise<VectorStoreQueryResult> {
        const { queryEmbedding, similarityTopK = 5 } = query;

        if (!queryEmbedding)
            throw new Error("Missing queryEmbedding");

        const float64VecArray = new Float32Array(queryEmbedding);
        const result = await this.client.execute(
            `SELECT id, content,VECTOR_DISTANCE(EMBEDDING, :1, EUCLIDEAN) as distance, file_name
                FROM ${this.tableName}
                WHERE VECTOR_DISTANCE(EMBEDDING, :1, EUCLIDEAN) <= 1
                ORDER BY distance
                FETCH FIRST :2 ROWS ONLY`,
            [float64VecArray, float64VecArray, similarityTopK],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const rows = result.rows
        return {
            ids: rows.map((r: any) => r.ID),
            similarities: rows.map((r: any) => r.DISTANCE),
            nodes: rows.map((r: any) => new Document({
                id_: r.ID,
                text: r.CONTENT,
                metadata: {
                    file_name: r.FILE_NAME
                }
            })),
        };
    }

    async delete(ids: string): Promise<void> {
        await this.client.execute(
            `DELETE FROM ${this.tableName} WHERE id IN (${ids})`
        );
    }

    async persist(): Promise<void> {
    }
}
