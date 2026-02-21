import * as dotenv from 'dotenv';
dotenv.config();

import { LLMFactory } from '../../packages/core/llm/LLMFactory';
import { aiConfig } from '../../packages/core/config/ai.config';

async function killerDemo() {
    console.clear();
    console.log('\x1b[36m%s\x1b[0m', '══════════════════════════════════════════════');
    console.log('\x1b[33m%s\x1b[0m', '     AI UNIVERSAL RUNTIME - LIVE DEMO');
    console.log('\x1b[36m%s\x1b[0m', '══════════════════════════════════════════════');

    const userQuery = process.argv[2] || 'Can you explain the adapter pattern?';

    console.log(`\n\x1b[1m[1] INJECTED CONFIGURATION:\x1b[0m`);
    console.log(`    - Framework:  \x1b[32m${aiConfig.framework}\x1b[0m`);
    console.log(`    - LLM Provider: \x1b[32m${aiConfig.llm.provider}\x1b[0m`);
    console.log(`    - Target Model: \x1b[32m${aiConfig.llm.model}\x1b[0m`);

    console.log(`\n\x1b[1m[2] FACTORY INSTANTIATION:\x1b[0m`);
    console.log(`    - Requesting provider from Factory...`);

    const startTime = Date.now();
    const llm = LLMFactory.create();

    console.log(`    - \x1b[32mSUCCESS:\x1b[0m Instantiated \x1b[1m${llm.constructor.name}\x1b[0m`);

    console.log(`\n\x1b[1m[3] EXECUTING REQUEST:\x1b[0m`);
    console.log(`    - Prompt: "${userQuery}"`);

    try {
        const startTime = Date.now();

        if (aiConfig.llm.capabilities?.streaming) {
            console.log(`\n\x1b[1m--- AI RESPONSE (STREAMING) ---\x1b[0m`);
            process.stdout.write('\x1b[37m');

            for await (const chunk of llm.stream(userQuery)) {
                process.stdout.write(chunk);
            }

            const duration = Date.now() - startTime;
            console.log(`\x1b[0m\n\n\x1b[1m--- COMPLETED IN ${duration}ms ---\x1b[0m\n`);
        } else {
            const response = await llm.generate(userQuery);
            const duration = Date.now() - startTime;

            console.log(`\n\x1b[1m--- AI RESPONSE (${duration}ms) ---\x1b[0m`);
            console.log(`\x1b[37m${response.text}\x1b[0m`);
            console.log(`\x1b[1m------------------------------------\x1b[0m\n`);
        }

        console.log(`\x1b[90m%s\x1b[0m`, `Hint: Try changing aiConfig.llm.provider to 'openai' in packages/core/config/ai.config.ts and run this again!`);
    } catch (error: any) {
        console.log(`\n\x1b[31m[!] ERROR:\x1b[0m ${error.message}`);
    }
}

killerDemo();
