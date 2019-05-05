const novelWebConfig = require('./novelWebSiteConfig')
const dbConfig = require('./dbConfig')
const folderConfig = require('./folderConfig')
const WXConfig = require('./WXConfig')

module.exports =  {
	APP_PORT: 3100,
	HTTPS_PORT: 443,
	SECRET: 'YOMI',
	IMG_SERVER: 'http://img.yomij.cn/',
	novelWebConfig,
	dbConfig,
	folderConfig,
	WXConfig
}
