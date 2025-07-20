'use strict';
var gcoder = require('gcoder');

var MysqlJavaTypeMapFilterPlugin = module.exports = gcoder.Plugin.extend({
    constructor: function () {
    }
});

MysqlJavaTypeMapFilterPlugin.prototype.do = function (tables,config) {
    MysqlJavaTypeMapFilterPlugin.__super__.do();
    let tsTypeMap = {
        "int":"Long",
        "tinyint":"Integer",
        "smallint":"Integer",
        "bigint":"Long",
        "mediumint":"Long",
        "int unsigned":"Long",
        "float":"Float",
        "double":"Double",
        "decimal":"BigDecimal",
        "date":"Date",
        "datetime":"Date",
        "timestamp":"Date",
        "char":"String",
        "varchar":"String",
        "text":"String",
        "longtext":"String",
        "tinytext":"String",
        "mediumtext":"String",
        "blob":"byte[]",
        "bit":"Boolean",
        "json":"Object",
    }
    for(let table of tables){
        let splitArray = table.tableName.split("_");
        let abbr = "";
        for(let splitStr of splitArray){
            abbr+=splitStr.substr(0,1);
        }
        table.abbr = "${prefix}";
        table.prefix = table.tableName.split("_")[0];
        let fieldArray = []
        for(let field of table.fieldArray){
            let fieldType = field.fieldType.replace(/\(\d+,\d\)/,"");
            field.javaType = tsTypeMap[fieldType];
            if(!field.javaType){
                console.log(`${field.fieldType} not map javaType and skip`);
            }else{
                fieldArray.push(field);
            }
        }
        table.fieldArray = fieldArray;
    }
};
