# webpack5-cdn-plugin

> For webpack4, please refer to [webpack4-cdn-plugin](https://github.com/AngusFu/webpack4-cdn-plugin).

## Docs

### Install
```
npm i webpack5-cdn-plugin -D
```

### Usage

```tsx
const { Webpack5CDNPlugin } = require('webpack5-cdn-plugin')

// webpack config
module.exports = {
  plugins: [
    // ...
    new Webpack5CDNPlugin({
      manifestFilename: 'manifest.json',
      uploadContent({ file, content }) {
        // 需要自己实现上传文件、重试、并发控制
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(`http://127.0.0.1:8080/${file}`)
          }, 200)
        })
      }
    })
  ]
}
```

