import { dirname, join } from 'path';
import { format, parse } from 'url';

const ASSET_LOOKUP_DEF = `
;(function () {
  __webpack_require__.__webpack_asset_map__ = 1;
  __webpack_require__.__asset__ = function (path, wR) {
    return __webpack_require__.__webpack_asset_map__[path] || (wR.p + path);
  };
})();
`;
export const replacePublicPath = function (str: string) {
  return (
    str
      .replace(
        /__webpack_require__\.p\s*\=\s*["']/g,
        (m) => `${ASSET_LOOKUP_DEF}\n${m}`
      )
      // 基于一个假设：本行后面没有其他多余内容
      .replace(
        /(?:\(__webpack_require__\.p\s*\+\s*)([^\n]+?)\)(;?)$/gm,
        (_, g1, g2) =>
          `__webpack_require__.__asset__(${g1}, __webpack_require__)${g2}`
      )
      .replace(
        /(?:__webpack_require__\.p\s*\+\s*)([^\n]+?)(;?)$/gm,
        (_, g1, g2) =>
          `__webpack_require__.__asset__(${g1}, __webpack_require__)${g2}`
      )
  );
};

export const injectAssetManifest = function (content: string, json: string) {
  return content.replace(
    /__webpack_asset_map__\s*=\s*1/g,
    () => `__webpack_asset_map__=${json}`
  );
};

export const replaceCSSUrls = function (
  filename: string,
  content: string,
  urlMap: Map<string, string>
) {
  // SEE https://www.regextester.com/106463
  const re = /url\((?!['"]?(?:data:|https?:|\/\/))(['"]?)([^'")]*)\1\)/g;

  return content.replace(re, (match, _, path) => {
    const { search, hash, pathname } = parse(path);
    const extra = format({ search, hash });
    const name = /^[.]{1,2}\//.test(path)
      ? join(dirname(filename), pathname ?? '')
      : pathname;
    const url = urlMap.get(name ?? '');

    return url ? match.replace(path, url + extra) : match;
  });
};

export const interpolateHTMLAssets = function (
  input: string,
  urlMap: Map<string, string>,
  manifestJSON: string
) {
  const replaceImports = function (source: string) {
    const reIgnorePath = /^(?:(https?:)?\/\/)|(?:data:)/;
    const reImport =
      /(?:<(?:link|script|img)[^>]+(?:src|href)\s*=\s*)(['"]?)([^'"\s>]+)\1/g;

    return source.replace(reImport, (match, _, path) => {
      if (reIgnorePath.test(path)) return match;

      // avoid query strings that may affect the result
      const file = path.split('?')[0];
      const url = urlMap.get(file);
      return url ? match.replace(path, url) : match;
    });
  };

  return injectAssetManifest(replaceImports(input), manifestJSON);
};
