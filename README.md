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

let cacheData = null;

// webpack config
module.exports = {
  plugins: [
    // ...
    new Webpack5CDNPlugin({
      keepLocalFiles: false,
      manifestFilename: 'manifest.json',
      uploadContent({ file, extname, content }) {
        const hash = md5(content)
        
        if (cacheData.has(hash)) {
          return Promise.resolve(cacheData.get(hash))
        }

        // NOTE 需要自己实现上传文件、重试、并发控制
        // demo: https://gist.github.com/AngusFu/b99b0ffb001b0bf4009d09b5e3b041d6
        return uploadTaskManager
          .upload(content)
          .then(result => {
            cacheData.set(hash, result.url)
            return result.url
          })
      },
      before() {
        cacheData = readCache()
      },
      done() {
        persistCache(cacheData)
      }
    })
  ]
}
```

