import path from "path";
import { Configuration as WebpackConfiguration, HotModuleReplacementPlugin, ProvidePlugin } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    mode: "development",
    output: {
        publicPath: "/",
    },
    entry: "./src/index.tsx",
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
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
        }),
        new HotModuleReplacementPlugin(),
        new ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ],
    devtool: "inline-source-map",
    devServer: {
        static: path.join(__dirname, "build"),
        historyApiFallback: true,
        open: true,
        hot: true,
        port: 3000,
        proxy: {
            "/auth": {
                target: "http://localhost:5000",
                secure: false
            },
            "/api": {
                target: "http://localhost:5000",
                secure: false

            }
        }
    },
};

export default config;
