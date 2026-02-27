import {buildWebpackConfig} from "./config/build/buildWebpackConfig";
import {BuildEnv, BuildPaths} from "./config/build/types/config";
import path from "path";

export default (env: BuildEnv) => {
    const paths: BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.ts'),
        build: path.resolve(__dirname, 'dist'),
        htmlEntry: path.resolve(__dirname, 'src', 'main', 'pages', 'index', 'index.html'),
        htmlPages: path.resolve(__dirname, 'src', 'main', 'pages'),
        htmlWidgets: path.resolve(__dirname, 'src', 'main', 'widgets'),
    }

    const mode = env.mode || 'development';
    const port = env.port || 3000;

    const isDev = mode === 'development';

    return buildWebpackConfig({
        mode,
        paths,
        isDev,
        port
    });
};
