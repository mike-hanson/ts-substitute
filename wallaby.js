module.exports = (wallaby) => {

    return {
        files: [
            { pattern: 'src/**/*.ts', load: false },            
            { pattern: 'src/tests/**/*.test.ts', ignore: true }
        ],
        tests: [
            'src/tests/**/*.test.ts'
        ],
        env: {
            type: 'node',
            runner: 'node'
        },
        compilers: {
            'src/**/*.ts': wallaby.compilers.typeScript()
        },
        debug: true
    };
}