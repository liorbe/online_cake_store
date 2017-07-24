/**
 * Created by Gal and Lior on 01/06/2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var config = {
    userName: 'onlineAdmin',
    password: 'online123!@#',
    server: 'onlinestoreserver.database.windows.net',
    requestTimeout: 30000,
    options: {encrypt: true, database: 'onlineStoreDB'}
};
//var connection;

//----------------------------------------------------------------------------------------------------------------------
    exports.Select = function(connection,query,callback) {
    var req = new Request(query, function (err, rowCount) {
        if (err) {
            console.log(err);
            return;
        }
    });
    var ans = [];
    var properties = [];
    req.on('columnMetadata', function (columns) {
        columns.forEach(function (column) {
            if (column.colName != null)
                properties.push(column.colName);
        });
    });
    req.on('row', function (row) {
        var item = {};
        for (i=0; i<row.length; i++) {
            item[properties[i]] = row[i].value;
        }
        ans.push(item);
    });

    req.on('requestCompleted', function () {
        //don't forget handle your errors
        console.log('request Completed: '+ req.rowCount + ' row(s) returned');
        console.log(ans);
        callback(ans);
    });



    connection.execSql(req);


};

exports.InsertUpdate = function(connection,query, post,callback) {
    var req = new Request(query, function (err, rowCount) {
        if (err) {
            console.log(err);
            return;
        }
    });
    var ans = [];
    var properties = [];
    req.on('columnMetadata', function (columns) {
        columns.forEach(function (column) {
            if (column.colName != null)
                properties.push(column.colName);
        });
    });
    req.on('row', function (row) {
        var item = {};
        for (i=0; i<row.length; i++) {
            item[properties[i]] = row[i].value;
        }
        ans.push(item);
    });

    req.on('requestCompleted', function () {
        //don't forget handle your errors
        console.log('request Completed: '+ req.rowCount + ' row(s) returned');
        console.log(ans);
        callback(ans);
    });

    for(var i=0; i<post.length; i++)
    {
        req.addParameter(post[i].culomn, post[i].type , post[i].value);
    }

    connection.execSql(req);

};
