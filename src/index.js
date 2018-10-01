const p = require('path');
const { declare } = require('@babel/helper-plugin-utils');
const { types: t } = require('@babel/core');
const template = require('@babel/template').default;

const transform = require('./transform');

const BABEL_VERSION = 7;

module.exports = declare((api, options = {}) => {
    api.assertVersion(BABEL_VERSION);

    return {
        visitor: {
            Program: {
                enter(programPath, { filename }) {
                    programPath.traverse({
                        CallExpression(path) {
                            if(
                                path.node.callee.type === 'Identifier' &&
                                path.node.callee.name === 'require' &&
                                typeof path.node.arguments[0].value === 'string' &&
                                (
                                    path.node.arguments[0].value.endsWith('.ts') ||
                                    path.node.arguments[0].value.endsWith('.tsx')
                                )
                            ) {
                                const dir = p.dirname(p.resolve(filename));
                                const absolutePath = p.resolve(dir, path.node.arguments[0].value);
                                const res = transform(absolutePath, options);

                                if(res !== null) {
                                    const buildRequire = template(`
                                        (function(exports) {
                                            BODY
                                            return exports;
                                        })({});
                                    `);
                                    const iffe = buildRequire({
                                        BODY: res.ast.program.body
                                    });
                                    const ast = iffe;

                                    path.replaceWithMultiple(ast);
                                }
                            }
                        },

                        ImportDeclaration(path) {
                            if(
                                path.node.source.value.endsWith('.ts') ||
                                path.node.source.value.endsWith('.tsx')
                            ) {
                                const dir = p.dirname(p.resolve(filename));
                                const absolutePath = p.resolve(dir, path.node.source.value);
                                const res = transform(absolutePath, options);

                                if(res !== null) {
                                    const buildRequire = template(`
                                        (function(exports) {
                                            BODY
                                            return exports;
                                        })({});
                                    `);
                                    const iffe = buildRequire({
                                        BODY: res.ast.program.body
                                    });
                                    const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
                                    const declarators = [
                                        t.variableDeclarator(
                                            t.identifier(id.name),
                                            iffe.expression
                                        ),
                                        ...path.node.specifiers.map(specifier => {
                                            let name = specifier.local.name;
                                            let propertyName = specifier.type === 'ImportDefaultSpecifier' ?
                                                'default' :
                                                name;

                                            return t.variableDeclarator(
                                                t.identifier(name),
                                                t.memberExpression(
                                                    t.identifier(id.name),
                                                    t.identifier(propertyName)
                                                )
                                            );
                                        })
                                    ];
                                    const ast = t.variableDeclaration('var', declarators);

                                    path.replaceWithMultiple(ast);
                                }
                            }
                        }
                    });
                }
            }
        }
    };
});
