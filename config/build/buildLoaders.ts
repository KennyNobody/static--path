import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {BuildOptions} from "./types/config";

export function buildLoaders({isDev}: BuildOptions): webpack.RuleSetRule[] {
    const typeScriptLoader = {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    };
    
    const slyleLoader = {
        test: /\.scss|css$/i,
        use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                  url: {
                      filter: (url: string | string[]) => {
                          return url.includes('src/');
                      },
                  }
              }
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            'autoprefixer'
                        ]
                    }
                },
            },
            "sass-loader",
        ],
    }
    
    const svgLoader = {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
            extract: true,
            spriteFilename: 'sprite.svg',
            publicPath: '/assets/',
        }
    }
    
    return [
        typeScriptLoader,
        slyleLoader,
        svgLoader,
    ]
}
