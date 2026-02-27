import HtmlWebpackPlugin from "html-webpack-plugin";
import {TemplatePageType, TemplateStringType} from "./buildPagesList";

const createPluginInstance = (
    data: TemplatePageType,
    path: string,
    widgets: TemplateStringType,
): HtmlWebpackPlugin => {
    return new HtmlWebpackPlugin({
        template: path + '/' + data.path,
        filename: data.name,
        inject: 'body',
        minify: false,
        widgets,
    });
}

export default createPluginInstance;
