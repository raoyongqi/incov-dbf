const fs = require('fs').promises; // 使用 fs 的 promise API
const path = require('path'); // 用于处理文件路径

async function convertShpToGeoJson() {
    try {
        const shpFolder = 'C:/Users/r/Desktop/dbf_encode/shp/';
        const geojsonFolder = 'C:/Users/r/Desktop/dbf_encode/geojson/';

        // 获取 SHP 文件夹中所有的文件
        const files = await fs.readdir(shpFolder);

        // 筛选出所有的 .shp 文件
        const shpFiles = files.filter(file => file.endsWith('.shp'));

        // 循环处理每一个 .shp 文件
        for (const shpFile of shpFiles) {
            const shpFilePath = path.join(shpFolder, shpFile);
            const dbfFilePath = shpFilePath.replace('.shp', '.dbf'); // DBF 文件路径与 SHP 文件相同，只是扩展名不同
            const geojsonFileName = shpFile.replace('.shp', '.geojson'); // GeoJSON 文件名
            const geojsonFilePath = path.join(geojsonFolder, geojsonFileName);

            // 读取 SHP 和 DBF 文件
            const shpBuffer = await fs.readFile(shpFilePath);
            const dbfBuffer = await fs.readFile(dbfFilePath);

            const {parseDbf, combine, parseShp} = await import('shpjs'); // 动态导入 shpjs

            console.log(`开始解析 SHP 文件：${shpFile}`);

            // 解析 DBF 文件
            const dbfData = parseDbf(dbfBuffer, 'GBK');

            // 转换为 GeoJSON
            const geojson = combine([
                parseShp(shpBuffer),
                dbfData
            ]);

            // 格式化为 JSON 字符串
            const geojsonString = JSON.stringify(geojson, null, 2);

            // 保存 GeoJSON 文件
            await fs.writeFile(geojsonFilePath, geojsonString, 'utf-8');
            console.log(`GeoJSON 已成功保存：${geojsonFileName}`);
        }

        console.log('所有 SHP 文件转换为 GeoJSON 完成！');
        
    } catch (error) {
        console.error('Error reading files or converting to GeoJSON:', error);
    }
}

// 调用函数
convertShpToGeoJson();
