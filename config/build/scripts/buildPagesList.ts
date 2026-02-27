import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import getPageTemplates from "../scripts/getPageTemplates";
import getIncludesPages from "../scripts/getIncludesPages";
import {getWidgets} from "./getWidgets";
import {BuildPaths} from "../types/config";

export interface TemplateStringType {
    [key: string]: string;
}

export interface TemplatePageType {
    name: string;
    path: string;
}

export function buildPagesList(paths: BuildPaths): webpack.WebpackPluginInstance[] {
    const pages: TemplatePageType[] = getIncludesPages(paths.htmlPages);
    const pagesArray: HtmlWebpackPlugin[] = [];
    const widgets: TemplateStringType = getWidgets(paths);

    pages.forEach((el: TemplatePageType) => {
        const item: HtmlWebpackPlugin = getPageTemplates(el, paths.htmlPages, widgets);
        pagesArray.push(item);
    })

    return pagesArray;
}
