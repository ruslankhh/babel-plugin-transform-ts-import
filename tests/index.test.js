const path = require('path');
const glob = require('glob');
const { transformFileSync } = require('@babel/core');
const plugin = require('../src');

function transform(filePath, options, pluginOptions = {}) {
    return (
        transformFileSync(filePath, Object.assign(
            {
                filename: filePath,
                plugins: [[plugin, pluginOptions]],
                generatorOpts: {
                    comments: false,
                    quotes: 'single',
                    jsescOption: { quotes: 'single' }
                }
            },
            options
        )).code || ''
    );
}

describe('babel-plugin-transform-ts-const', () => {
    glob
        .sync('./fixtures/**/*.js', { cwd: __dirname, dot: false, strict: true })
        .forEach(filePath => {
            it(`transforms ${filePath}`, () => {
                expect(transform(path.join(__dirname, filePath))).toMatchSnapshot();
            });
        });
});
