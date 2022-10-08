import path from "path";
import { ProvidePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

module.exports = {
    mode: "production",
    output: {
        publicPath: "/",
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    entry: "./src/index.tsx",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            buffer: require.resolve("buffer"),
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            os: require.resolve("os-browserify"),
            url: require.resolve("url"),
            path: require.resolve("path-browserify"),
            process: false,
            fs: false,
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]

            }, {
                test: /\.svg$/,
                use: [
                    "file-loader"
                ]

            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Production",
            template: "public/index.html"
        }),
        new ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ]
}



