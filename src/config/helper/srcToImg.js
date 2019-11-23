// 导入：模块
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

// 包装
const writeFile = promisify(fs.writeFile);


module.exports = async (src, dir) => {
    // 对传入的src判断 是url 还是 base64


    if (/\.(jpg|png|gif)$/.test(src)) {
        await _urlToImg(src, dir);
    } else {
        await _base64ToImg(src,dir);
    }
};

// url -> image
const _urlToImg = promisify((url, dir, callback) => {
    const mod = /^https:/.test(url) ? https : http; // https or http
    const ext = path.extname(url); // 解析出拓展名
    const file = path.join(dir, `${Date.now()}${ext}`); // 拼凑存储后的文件名

    mod.get(url, res => {
        res.pipe(fs.createWriteStream(file))
            .on('finish', () => {
                callback();
                console.log(file,'url category: http/https');
            })
    });
});

// base64 -> image
const _base64ToImg = async function (base64Str, dir) {
    // data: image/jpeg; base64,/asasasdasd

    try {
        const matches = base64Str.match(/^data:(.+?);base64,(.+)/);
        const ext = matches[1].split('/')[1].replace('jpeg', 'jpg');
        const file = path.join(dir, `${Date.now()}.${ext}`); // 文件名

        await writeFile(file, matches[2], 'base64');
        console.log(file, 'url category: base64');
    } catch(err) {
        console.log('非法 base64 字符串！');
    }

};
