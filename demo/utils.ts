import readline from 'readline';

export const readLineAsync = () => {
    const rl = readline.createInterface({
        input: process.stdin
    });
    return new Promise((resolve) => {
        rl.prompt();
        rl.on('line', (line) => {
            rl.close();
            resolve(line);
        });
    });
};