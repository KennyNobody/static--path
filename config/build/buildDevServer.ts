import {BuildOptions} from "./types/config";
import {Configuration as DevServerConfiguration} from "webpack-dev-server";
import path from "path";

export function buildDevServer(options:BuildOptions): DevServerConfiguration {
    return {
        port: options.port,
        open: true,
        hot: true,
        client: {
            overlay: true,
            progress: true,
        },
        compress: false,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        watchFiles: [
            "./src/**/*.ts",
            "./src/**/*.js",
            "./src/**/*.css",
            "./src/**/*.scss",
            "./src/**/*.html",
        ],
    }
}
