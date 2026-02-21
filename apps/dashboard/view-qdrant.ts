import * as dotenv from 'dotenv';
dotenv.config();

import { aiConfig } from '../../packages/core/config/ai.config';

async function dashboard() {
    const url = process.env.QDRANT_URL || 'http://localhost:6333';
    const collection = aiConfig.vectorStore.collectionName || 'ai_runtime_collection';

    console.clear();
    console.log('\x1b[35m%s\x1b[0m', '══════════════════════════════════════════════');
    console.log('\x1b[33m%s\x1b[0m', '      QDRANT VECTOR STORE DASHBOARD');
    console.log('\x1b[35m%s\x1b[0m', '══════════════════════════════════════════════');

    try {
        // Fetch collection info
        const colRes = await fetch(`${url}/collections/${collection}`);
        if (!colRes.ok) throw new Error(`Collection "${collection}" not found.`);
        const colData = await colRes.json();

        console.log(`\n\x1b[1m📍 Collection:\x1b[0m \x1b[32m${collection}\x1b[0m`);
        console.log(`\x1b[1m📊 Point Count:\x1b[0m \x1b[32m${colData.result.points_count}\x1b[0m`);
        console.log(`\x1b[1m📏 Vector Size:\x1b[0m \x1b[32m${colData.result.config.params.vectors.size}\x1b[0m`);

        // Fetch points
        console.log(`\n\x1b[1m🕒 Recent Points:\x1b[0m`);
        const pointsRes = await fetch(`${url}/collections/${collection}/points/scroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit: 5, with_payload: true, with_vector: false })
        });
        const pointsData = await pointsRes.json();

        if (pointsData.result.points.length === 0) {
            console.log('\x1b[90m   (No points found in this collection)\x1b[0m');
        }

        pointsData.result.points.forEach((p: any, i: number) => {
            console.log(`\n  \x1b[36m[Point #${i + 1}]\x1b[0m ID: ${p.id}`);
            console.log(`  \x1b[90mPayload:\x1b[0m ${JSON.stringify(p.payload, null, 2).replace(/\n/g, '\n           ')}`);
        });

        console.log('\n\x1b[35m%s\x1b[0m', '══════════════════════════════════════════════');
    } catch (error: any) {
        console.log(`\n\x1b[31m[!] ERROR:\x1b[0m ${error.message}`);
    }
}

dashboard();
