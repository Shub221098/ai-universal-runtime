export class SemanticChunker {
    /**
     * Splits text into smaller chunks while respecting sentence boundaries.
     * Use this to improve RAG accuracy.
     */
    static chunk(text: string, maxChunkSize: number = 500, overlap: number = 50): string[] {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const chunks: string[] = [];
        let currentChunk = "";

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length <= maxChunkSize) {
                currentChunk += sentence;
            } else {
                if (currentChunk) chunks.push(currentChunk.trim());
                // Handle edge case where a single sentence is longer than maxChunkSize
                if (sentence.length > maxChunkSize) {
                    let tempSentence = sentence;
                    while (tempSentence.length > maxChunkSize) {
                        chunks.push(tempSentence.substring(0, maxChunkSize));
                        tempSentence = tempSentence.substring(maxChunkSize - overlap);
                    }
                    currentChunk = tempSentence;
                } else {
                    currentChunk = sentence;
                }
            }
        }

        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks;
    }
}
