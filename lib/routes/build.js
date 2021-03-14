'use strict';

const Esbuild = require('esbuild');

module.exports = {
    method: 'get',
    path: '/build/{p*}',
    options: {
        async handler({ params: { p } }, h) {

            const { outputFiles: [{ contents }] } = await Esbuild.build({
                entryPoints: [`${__dirname}/../public/${p}`],
                bundle: true,
                write: false,
                minify: true,
                define: {
                    'process.env.NODE_ENV': '"production"'
                }
            });

            return h.response(Buffer.from(contents.buffer)).type('text/javascript');
        }
    }
};
