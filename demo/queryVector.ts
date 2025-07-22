import { vectorIndexLocal } from './vectorIndexLocal'
import { logger } from './applog';
import { readLineAsync } from './utils';

(async function main() {
    const { faqQuery } = await vectorIndexLocal()
    while (true) {
        logger.info("\nEnter a phrase. Type 'quit' or 'exit' to exit: ");
        const query: any = await readLineAsync();
        if (query === 'quit' || query === 'exit')
            break;
        if (query === '')
            continue;
        const response = await faqQuery(query)
        console.log(response)
    }
})()
