# webpack5-cdn-plugin

> For webpack4, please refer to [webpack4-cdn-plugin](https://github.com/AngusFu/webpack4-cdn-plugin).

## Docs

### Install
```
npm i webpack-cdn-plugin-5 -D
```

### Usage

```tsx
const { Webpack5CDNPlugin } = require('webpack-cdn-plugin-5')

// webpack config
module.exports = {
  plugins: [
    // ...
    new Webpack5CDNPlugin({
      keepLocalFiles: false,
      manifestFilename: 'manifest.json',
      uploadContent({ file, content }) {
        // TODO 需要自己实现上传文件、重试、并发控制
        return uploadTaskManager.upload(content).then(result => {
          return `http://127.0.0.1:8080/${result.hash_url}`
        })
      }
    })
  ]
}
```

