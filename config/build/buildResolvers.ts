import {ResolveOptions} from "webpack";

export function buildResolvers(): ResolveOptions {
    return {
        extensions: ['.ts', '.js'],
    }
}
