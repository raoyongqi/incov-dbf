const fs = require('fs').promises; // 使用 fs 的 promise API
const iconv = require('iconv-lite'); // 导入 iconv-lite

async function convertShpToGeoJson() {
    try {
        console.log('开始读取 SHP 文件...');
        const shpBuffer = await fs.readFile('C:/Users/r/Desktop/dbf_encode/shp/内蒙古自治区.shp');
        console.log('成功读取 SHP 文件。');

        console.log('开始读取 DBF 文件...');
        const dbfBuffer = await fs.readFile('C:/Users/r/Desktop/dbf_encode/shp/内蒙古自治区.dbf');
        console.log('成功读取 DBF 文件。');

        const { default: shp, parseDbf, combine, parseShp } = await import('shpjs'); // 动态导入 shpjs

        console.log('开始解析 DBF 文件...');
        const s1 = parseDbf(dbfBuffer, 'GBK');
        console.log('成功解析 DBF 文件。');

        // 转换为 GeoJSON
        const geojson = combine([
            parseShp(shpBuffer),
            s1
        ]);

        console.log('GeoJSON 生成成功:', geojson);

        // 保存 GeoJSON 到文件
        const geojsonString = JSON.stringify(geojson, null, 2); // 格式化为 JSON 字符串
        await fs.writeFile('C:/Users/r/Desktop/dbf_encode/shp/内蒙古自治区.geojson', geojsonString, 'utf-8');
        console.log('GeoJSON 已成功保存到文件。');

    } catch (error) {
        console.error('Error reading files or converting to GeoJSON:', error);
    }
}

// 调用函数
convertShpToGeoJson();
