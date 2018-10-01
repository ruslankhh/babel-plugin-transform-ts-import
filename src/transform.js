const { transformFileSync } = require('@babel/core');

const defaultOptions = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-typescript'
    ],
    generatorOpts: {
        comments: false,
        quotes: 'single',
        jsescOption: { quotes: 'single' }
    },
    ast: true,
    babelrc: false
};

module.exports = function transform(filePath, options) {
    const transformOptions = Object.assign(
        { filename: filePath },
        defaultOptions,
        options
    );

    return transformFileSync(filePath, transformOptions);
};
