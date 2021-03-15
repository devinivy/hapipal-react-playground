'use strict';

const Util = require('util');
const Path = require('path');
const Stream = require('stream');
const Esbuild = require('esbuild');
const React = require('react');
const ReactDOM = require('react-dom/server');
const Trumpet = require('trumpet');
const Jsesc = require('jsesc');
const Inert = require('@hapi/inert');
const { html } = require('htm/react');

const internals = {};

exports.plugin = {
    name: 'vissr',
    // multiple: true,
    async register(server, options) {

        const {
            entryPoints,
            watch,
            outdir = '.build',
            relativeTo = server.realm.parent && server.realm.parent.settings.files.relativeTo,
            renderToNodeStream = ReactDOM.renderToNodeStream,
            doctype = '<!DOCTYPE html>'
        } = options;

        const resolve = (path) => Path.resolve(relativeTo, path);

        server.path(relativeTo);

        // Reload

        const bs = watch && require('browser-sync').create();

        if (bs) {
            server.ext('onPostStart', async () => {

                await Util.promisify(bs.init)({ proxy: server.info.uri });
            });
            server.ext('onPreStop', bs.exit);
        }

        // Build

        server.ext('onPreStart', async () => {

            await Esbuild.build({
                outdir: resolve(outdir),
                entryPoints: entryPoints.map(resolve),
                bundle: true,
                minify: true,
                define: {
                    'process.env.NODE_ENV': '"production"'
                },
                watch: watch && {
                    onRebuild(err, results) {

                        if (!err && bs) {
                            bs.reload();
                        }

                        if (watch.onRebuild) {
                            watch.onRebuild(err, results);
                        }
                    }
                },
                sourcemap: true,
                // Splitting
                format: 'esm',
                splitting: true
            });
        });

        // Serve

        await server.register(Inert);

        server.route({
            method: 'get',
            path: '/build/{p*}',
            options: {
                handler: {
                    directory: { path: outdir }
                }
            }
        });

        // Render html

        server.decorate('toolkit', 'html', function (...args) {

            const tr = Trumpet();
            const el = html(...args);
            const ignore = () => null;
            const passthrough = new Stream.PassThrough();

            // Render static page with <vissr-content /> placeholder
            const pageWithContent = Stream.pipeline(
                ReactDOM.renderToStaticNodeStream(
                    // TODO when this fails, error is not propagated
                    React.cloneElement(el, {}, html`<vissr-content />`)
                ),
                tr,
                passthrough,
                ignore
            );

            // Replace <vissr-content /> placeholder with hydratable page contents
            Stream.pipeline(
                renderToNodeStream(el.props.children),
                tr.createWriteStream('vissr-content', { outer: true }),
                ignore
            );

            passthrough.write(doctype);
            return this.response(pageWithContent).type('text/html');
        });

        server.decorate('toolkit', 'hydrate', function (entry) {

            const { Hydrate } = internals;
            const prefix = this.realm.modifiers.route.prefix || '/';
            // TODO cleanup the path manipulation, ensure it is safe
            const resolved = require.resolve(resolve(entry));
            const src = Path.posix.join(prefix, 'build', Path.relative(relativeTo, resolved));
            const Component = require(resolved);

            return function (props) {

                return html`
                    <${Hydrate} src=${src} Component=${Component} ...${props} />
                `;
            };
        });
    }
};

internals.Hydrate = function ({ src, Component, ...props }) {

    return html`
        <div id="app"><${Component} ...${props} /></div>
        <script dangerouslySetInnerHTML=${{ __html: `window.__INITIAL_DATA__ = ${Jsesc(props, { json: true, isScriptContext: true })};` }}></script>
        <script type="module" src=${src}></script>
    `;
};
