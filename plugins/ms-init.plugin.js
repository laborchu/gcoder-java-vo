'use strict';
let path = require('path');
var gcoder = require('gcoder');
var template = require('es6-template-string');

var MsInitPlugin = module.exports = gcoder.Plugin.extend({
    constructor: function () {
    }
});

MsInitPlugin.prototype.do = function (tables,config) {
    MsInitPlugin.__super__.do();
    let rootFolder = process.cwd();
    let gcoderFolder = path.join(__dirname, "../../");
    let gcoderPath = path.join(gcoderFolder, config.gcoder);
    let msPath = path.join(gcoderPath, "ms");

	let distPath = path.join(rootFolder, ".gcoder", "dist", config.gcoder);
    MsInitPlugin.__super__.createFolder(distPath);

    let baseModulePath = path.join(distPath, 'base');
    let basePackagePath = path.join(baseModulePath,"src/main/java",config.java.package.vo.replace(/\./g,'/'));
    MsInitPlugin.__super__.createFolder(basePackagePath);
    let basePath = path.join(msPath, "vo",'BaseVO.java');
    let baseDistPath = path.join(basePackagePath, 'BaseVO.java');
    MsInitPlugin.__super__.writeFileSync(basePath,baseDistPath,{
        config:config
    });
    let modulePomPath = path.join(msPath, "pom",'base-pom.xml');
    let modulePomDistPath = path.join(baseModulePath, 'pom.xml');
    MsInitPlugin.__super__.writeFileSync(modulePomPath,modulePomDistPath,{
        config:config
    });
    
    
    let prefixMap = {};
    let prefixList = [];
    for(let table of tables){
        if(table.prefix=='qrtz'){
            continue;
        }
        let modulePath = path.join(distPath, table.prefix);
        let modulePackagePath = path.join(modulePath,"src/main/java",config.java.package.vo.replace(/\./g,'/'),table.prefix);
        let xmlPackagePath = path.join(modulePath,"src/main/java/META-INF/mybatis");
        if(!prefixMap[table.prefix]){
            MsInitPlugin.__super__.createFolder(modulePackagePath);
            MsInitPlugin.__super__.createFolder(xmlPackagePath);

            modulePomPath = path.join(msPath, "pom",'module-pom.xml');
            modulePomDistPath = path.join(modulePath, 'pom.xml');
            MsInitPlugin.__super__.writeFileSync(modulePomPath,modulePomDistPath,{
                config:config,
                prefix:'-'+table.prefix
            });
            prefixList.push(table.prefix);
            prefixMap[table.prefix] = true;
        }

        let voTemplatePath = path.join(msPath, "vo",'${upperCamelName}VO.java');
        let voDistPath = path.join(modulePackagePath, table.upperCamelName+'VO.java');
        MsInitPlugin.__super__.writeFileSync(voTemplatePath,voDistPath,{
            table: table,
			config: config
        });

        let xmlTemplatePath = path.join(msPath, "mybatis",'${upperCamelName}.xml');
        let xmlDistPath = path.join(xmlPackagePath, table.upperCamelName+'.xml');
        MsInitPlugin.__super__.writeFileSync(xmlTemplatePath,xmlDistPath,{
            table: table,
			config: config
        });
    }

    let pomPath = path.join(msPath, "pom",'parent-pom.xml');
    let pomDistPath = path.join(distPath, 'pom.xml');
    MsInitPlugin.__super__.writeFileSync(pomPath,pomDistPath,{
        config:config,
        modules:prefixList
    });
};
