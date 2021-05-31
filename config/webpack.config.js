const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  mode: "development", //指定 的构建环境
  // 入口
  entry: {
    app: "./src/index",
  },
  // 打包出口
  output: {
    path: resolve("../dist"),
    filename: "js/[name].[hash].js",
    publicPath: "/",
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve("./../dist/index.html"), // html模板的生成路径
      template: "./index.html", //html模板
      inject: true, // true：默认值，script标签位于html文件的 body 底部
      hash: true, // 在打包的资源插入html会加上hash
      //  html 文件进行压缩
      minify: {
        removeComments: true, //去注释
        collapseWhitespace: true, //压缩空格
        removeAttributeQuotes: true, //去除属性 标签的 引号  例如 <p id="test" /> 输出 <p id=test/>
      },
    }),
  ],
  // 开发环境本地启动的服务配置
  devServer: {
    clientLogLevel: "none", //关闭webpack加载过程中绘制浏览器控制台打印
    historyApiFallback: true, // 当找不到路径的时候，默认加载index.html文件
    hot: true,
    contentBase: false, // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
    compress: true, // 一切服务都启用gzip 压缩：
    port: "8081", // 指定段靠谱
    publicPath: "/", // 访问资源加前缀
    proxy: {
      // 接口请求代理
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, //一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/, //屏蔽不需要处理的文件（文件夹）（可选）
        loader: "babel-loader", //loader的名称（必须）
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader", // 创建 <style></style>
          },
          {
            loader: "css-loader", // 转换css
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader", // 编译 Less -> CSS
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
          name: "static/img/[name].[hash:7].[ext]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
          name: "static/fonts/[name].[hash:7].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".json"], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
    alias: {
      "@": path.join(__dirname, "..", "src"), // 在项目中使用@符号代替src路径，导入文件路径更方便
    },
  },
};
