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
        // TODO 需要自己实现上传文件、重试、并发控制
        const hash = md5(content);
        
        if (cache[hash]) {
          return cache[hash]
        }

        return uploadTaskManager.upload(content).then(result => {
          cache[hash] = result.url
          return `http://127.0.0.1:8080/${result.url}`
        })
      },
      before() {
        cacheData = readCache();
      },
      done() {
        persistCache(cacheData);
      }
    })
  ]
}
```

