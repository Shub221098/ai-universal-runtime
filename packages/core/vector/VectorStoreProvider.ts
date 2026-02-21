export abstract class VectorStoreProvider {
    abstract add(vectors: number[][], metadata: any[], collection?: string): Promise<void>;
    abstract query(vector: number[], topK: number, collection?: string): Promise<any[]>;
}
