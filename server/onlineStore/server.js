/**
 * Created by Gal and Lior on 01/06/2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Connection = require('tedious').Connection;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require('cors');
var TYPES = require('tedious').TYPES;
app.use(cors());
var DButilsAzure = require('./DBUtils');

var config = {
    userName: 'onlineAdmin',
    password: 'online123!@#',
    server: 'onlinestoreserver.database.windows.net',
    requestTimeout: 30000,
    options: {encrypt: true, database: 'onlineStoreDB'}
};

var connection = new Connection(config);
app.locals.users = [];


var connected = false;
connection.on('connect', function(err) {
    if (err) {
        console.error('error connecting: ' + err.message);
    }
    else {
        console.log("Connected Azure");
        connected = true;
    }
});




function checkLogin(req) {
    let token = req.headers["my-token"];
    let user = req.headers["user"];
    if (!token || !user)
        return false;
    let validToken = app.locals.users[user];
    if (validToken.trim() == token.trim())
        return true;
    else
        return false;
}


var port = 4000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------
// Get all categories
app.get('/categories', function (req,res) {
    if(req.query.client_id !== undefined  )
    {
        DButilsAzure.Select(connection, 'select * from categories where category_id = any( select category_id from usersByCategories where client_id = \''+req.query.client_id+'\')', function (result) {
            res.send(result);
        });

    }
    else {
        DButilsAzure.Select(connection, 'Select * from categories', function (result) {
            res.send(result);
        });
    }
});
//-------------------------------------------------------------------------------------------------------------------

// Get all cakes (products) or get by category_ID - parameter: category
app.get('/cakes', function (req,res) {
    //Get cackes by category_ID - parameter: category
    if(req.query.category !== undefined  )
    {
        DButilsAzure.Select(connection, 'select * from cakes where cake_id = any( select cake_id from cakesByCategories where category_id = \''+req.query.category+'\')', function (result) {
            res.send(result);
        });
    }
    else {
        DButilsAzure.Select(connection, 'Select * from cakes', function (result) {
            res.send(result);
        });
    }
});

//-------------------------------------------------------------------------------------------------------------------

//Get cakes (products) by cake_ID
app.get('/cakes/:id', function (req,res) {
    DButilsAzure.Select(connection, 'Select * from cackes WHERE cake_id = '+ req.params.id, function (result) {
        res.send(result);
    });

});

//-------------------------------------------------------------------------------------------------------------------

//Get orders by order_ID
app.get('/orders/:id', function(req, res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");

    else{
        //responsetours = req.params.id !== undefined ?
        DButilsAzure.Select(connection, 'Select * from orders WHERE order_id = '+ req.params.id, function (result) {
            res.send(result);
        });
    }
});


//-------------------------------------------------------------------------------------------------------------------

//Get orders by order_ID
app.get('/cakesInOrder/:id', function(req, res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");

    else{
        //responsetours = req.params.id !== undefined ?
        DButilsAzure.Select(connection, 'Select * from cakes where cake_id in (select cake_id from cakesInOrders WHERE order_id = '+ req.params.id+')', function (result) {
            res.send(result);
        });
    }
});

//-------------------------------------------------------------------------------------------------------------------

//GET orders: if a parmeter is given - get orders by client_id (parameter: client_id), if not- get all orders
app.get('/orders', function(req, res) {
    //responsetours = req.params.id !== undefined ?
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");

    else{
        if(req.query.client_id !== undefined  )
        {
            DButilsAzure.Select(connection, 'Select * from orders WHERE client_id = '+ req.query.client_id, function (result) {
                res.send(result);
            });
        }
        else
        {
            DButilsAzure.Select(connection, 'SSelect * from orders', function (result) {
                res.send(result);
            });
        }
    }
});


//-------------------------------------------------------------------------------------------------------------------

//Get user by client_ID
app.get('/users/:id', function (req,res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");

    else{
        DButilsAzure.Select(connection, 'Select * from users WHERE client_id = '+ req.params.id, function (result) {
            res.send(result);
        });
    }

});


//-------------------------------------------------------------------------------------------------------------------
//
// //Get all users emails
// app.get('/users', function (req,res) {
//     if (!checkLogin(req))
//         res.status(403).send("you are not logged in");
//
//     DButilsAzure.Select(connection, 'Select mail from users', function (result) {
//         res.send(result);
//     });
//
// });
//-------------------------------------------------------------------------------------------------------------------

//Get all exchangeRates
app.get('/exchangeRates', function (req,res) {
    DButilsAzure.Select(connection, 'Select * from exchangeRates', function (result) {
        res.send(result);
    });
});

//-------------------------------------------------------------------------------------------------------------------

//Get password retrival by answres: school (primary school name) and surname (mother's surname before marrige)
app.get('/passwordRetrival', function (req,res) {
    DButilsAzure.Select(connection, 'Select password from users WHERE primary_school_name = \'' + req.query.school+'\'' +' AND mother_surname = '+'\'' + req.query.surname+'\'' +' AND username = '+'\''+ req.query.username+'\'', function (result) {
        res.send(result);
    });
});

//-------------------------------------------------------------------------------------------------------------------

//Get all conditors
app.get('/conditors', function(req, res) {
    DButilsAzure.Select(connection, 'Select * from conditors', function (result) {
        res.send(result);
    });

});

//-------------------------------------------------------------------------------------------------------------------

//Get conditors by conditor_ID
app.get('/conditors/:id', function(req, res) {
    DButilsAzure.Select(connection, 'Select * from conditors WHERE client_id = '+ req.query.id, function (result) {
        res.send(result);
    });

});

//-------------------------------------------------------------------------------------------------------------------

//Get shopping cart by clientID (parameter-clientID)
app.get('/shoppingCart', function(req, res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");

    else{
        if (req.query.clientID === undefined) {
        } else {
            var cart = new Object();
            DButilsAzure.Select(connection, 'select cakes.cake_id, cakes.cake_name, cakes.description, cakes.shape, cakes.picture_path, cakes.weight, shoppingCarts.price, shoppingCarts.amount  from shoppingCarts, cakes where shoppingCarts.client_id=' + '\'' + req.query.clientID + '\'' + ' AND cakes.cake_id = shoppingCarts.cake_id', function (result) {

                var data = result;
                cart.client_id = req.query.clientID;
                cart.products = [];
                for (var i = 0; i < data.length; i++) {
                    var product = new Object();
                    product.cake_id = data[i].cake_id;
                    product.cake_name = data[i].cake_name;
                    product.amount = data[i].amount;
                    product.description = data[i].description;
                    product.weight = data[i].weight;
                    product.price = data[i].price;
                    product.shape = data[i].shape;
                    product.picture_path = data[i].picture_path;
                    cart.products.push(product);
                }
                res.send(cart);
            });

        }

    }
});

//-------------------------------------------------------------------------------------------------------------------

//GET the cakes that were added in the last month
app.get('/cakesLastMonth', function(req, res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");

    else{
        DButilsAzure.Select(connection, 'select * from cakes where adding_date >= DATEADD (month,-1,GETDATE())', function (result) {
            res.send(result);
        });
    }
});

//-------------------------------------------------------------------------------------------------------------------

// GET recomended cakes by client_ID
app.get('/recomendedCakes/:id', function(req, res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");

    else{
        DButilsAzure.Select(connection, 'select cakes.cake_id, cakes.cake_name, cakes.description,cakes.shape, cakes.picture_path, cakes.weight, cakes.price from cakesInOrders,cakes where cakes.cake_id = cakesInOrders.cake_id AND order_id IN( select order_id from orders where client_id IN ( select client_id from usersByCategories where client_id<> '+req.params.id+' AND category_id IN ( select category_id from usersByCategories where usersByCategories.client_id = '+req.params.id+' ) group by client_id  )) group by cakes.cake_id, cakes.cake_name, cakes.description, cakes.shape, cakes.picture_path, cakes.weight, cakes.price ', function (result) {
            res.send(result);
        });
    }

});

//-------------------------------------------------------------------------------------------------------------------

// GET the 5 hottest cakes
app.get('/hotCakes', function(req, res) {

    DButilsAzure.Select(connection, 'select TOP 5 SUM (cake_amount) as [cake_amount], cakes.cake_id, cakes.cake_name, cakes.description, cakes.shape, cakes.picture_path, cakes.weight, cakes.price from orders,cakesInOrders,cakes where orders.order_date>=DATEADD (week, -1,GETDATE()) AND orders.order_id=cakesInOrders.order_id AND cakes.cake_id = cakesInOrders.cake_id group by cakesInOrders.cake_id, cakes.cake_id, cakes.cake_name, cakes.description, cakes.shape, cakes.picture_path, cakes.weight,cakes.price order by cake_amount DESC', function (result) {
        res.send(result);
    });
});
//-------------------------------------------------------------------------------------------------------------------

//POST login - if success return true, otherwise return false (json of the paramters is given in the body)
app.post('/login', function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var returnVal = '';

    DButilsAzure.Select(connection, 'Select * from users WHERE username = \''+ username +'\'', function (result) {
        for(var i= password.length; i<10; i++)
            password+=' ';
        if (result.length>0)
        {
            if( result[0].password == password)
            {
                returnVal = result[0].client_id;
                app.locals.users[username] = returnVal;
            }

        }

        res.send(returnVal);
    });

});

//-------------------------------------------------------------------------------------------------------------------

//POST a register - create new user in the DB (json of the paramters is given in the body)
app.post('/register', function(req, res) {
    var returnVal = [{result:true}];
    var query = "";
    DButilsAzure.Select(connection, 'Select * from users WHERE mail = \''+ req.body.mail +'\'', function (result) {

        if( result.length == 0)
        {
            var client_id = Math.floor(Math.random() * 1000) + 1;
            var post  = [
                {culomn:'a', value: client_id  , type: TYPES.NVarChar},
                {culomn:'e', value:req.body.first_name, type: TYPES.NVarChar},
                {culomn:'f', value:req.body.last_name, type: TYPES.NVarChar},
                {culomn:'i', value:req.body.address, type: TYPES.NVarChar},
                {culomn:'h', value:req.body.city, type: TYPES.NVarChar},
                {culomn:'g', value:req.body.country, type: TYPES.NVarChar},
                {culomn:'b', value:req.body.username, type: TYPES.NVarChar},
                {culomn:'c', value:req.body.password, type: TYPES.NVarChar},
                {culomn:'d', value:req.body.mail, type: TYPES.NVarChar},
                {culomn:'j', value:req.body.phone, type: TYPES.NVarChar},
                {culomn:'k', value:req.body.cellular, type: TYPES.NVarChar},
                {culomn:'l', value:req.body.credit_card, type: TYPES.NVarChar},
                {culomn:'m', value:req.body.primary_school, type: TYPES.NVarChar},
                {culomn:'n', value:req.body.mother_surname, type: TYPES.NVarChar},
            ];
            for( var i=0; i< req.body.categories.length; i++)
            {
                post.push( {culomn:'a'+i, value:client_id, type: TYPES.NChar});
                post.push( {culomn:'b'+i, value:req.body.categories[i].category_id, type: TYPES.NChar});
                query += 'insert into usersByCategories  (client_id , category_id) values (@'+'a'+i+',@'+'b'+i+');';
            }
            DButilsAzure.InsertUpdate(connection, 'insert into users  (client_id , username, password, mail, first_name, last_name, country, city, address, phone, cellular, credit_card_number, primary_school_name, mother_surname ) values (@a, @b,@c, @d,@e, @f,@g, @h,@i, @j,@k, @l,@m, @n);'+query,post, function (result) {
                // res.send(returnVal);
            });
        }
        else
        {
            returnVal = [{result:false}];
            // res.send(returnVal);
        }
        res.send(returnVal);
    });


});
//-------------------------------------------------------------------------------------------------------------------

// POST a new order - create new order in the DB (json of the paramters is given in the body)
app.post('/order', function(req, res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");
    else{

        var order_id = Math.floor(Math.random() * 10000) + 1;
        var returnVal = [{result:true}];
        var post  = [
            {culomn:'a', value:order_id, type: TYPES.NChar},
            {culomn:'b', value:req.body.client_id  , type: TYPES.NChar},
            {culomn:'c', value:req.body.date, type: TYPES.Date},
            {culomn:'d', value:req.body.shipment, type: TYPES.Date},
            {culomn:'e', value:req.body.currency, type: TYPES.NChar},
            {culomn:'f', value:req.body.total_amount, type: TYPES.Int},
        ];
        var insert = 'insert into orders  (order_id, client_id, order_date, shipment_date, currency, total_amount) values (@a, @b,@c, @d,@e, @f);'
        for( var i=0; i< req.body.products.length; i++)
        {
            post.push( {culomn:'a'+i, value:order_id, type: TYPES.NChar});
            post.push( {culomn:'b'+i, value:req.body.products[i].cake_id, type: TYPES.NChar});
            post.push( {culomn:'c'+i, value:req.body.products[i].cake_amount, type: TYPES.Int});
            insert += 'insert into cakesInOrders  (order_id, cake_id, cake_amount) values (@'+'a'+i+',@'+'b'+i+',@'+'c'+i+');';
        }
        DButilsAzure.InsertUpdate(connection,insert ,post, function (result) {
            res.send(returnVal);
        });
    }
});
//-------------------------------------------------------------------------------------------------------------------

// update a shopping cart of user (json of the paramters is given in the body)
app.put('/shoppingCart', function (req, res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");

    else{
        var returnVal = [{result:true}];
        var cart_id = Math.floor(Math.random() * 10000) + 1;
        var post  = [];
        var query = 'delete from shoppingCarts where client_id ='+req.query.clientID+';'
        for( var i=0; i< req.body.products.length; i++)
        {
            post.push( {culomn:'a'+i, value:cart_id, type: TYPES.NChar});
            post.push( {culomn:'b'+i, value:req.body.products[i].cake_id, type: TYPES.NChar});
            post.push( {culomn:'c'+i, value:req.query.clientID, type: TYPES.NChar});
            post.push( {culomn:'d'+i, value:req.body.products[i].price, type: TYPES.Float});
            post.push( {culomn:'e'+i, value:req.body.products[i].amount, type: TYPES.Int});
            query += 'insert into shoppingCarts  (cart_id, cake_id, client_id , price, amount) values (@'+'a'+i+',@'+'b'+i+',@'+'c'+i+',@'+'d'+i+',@'+'e'+i+');';
        }
        DButilsAzure.InsertUpdate(connection,query,post, function (result) {
            res.send(returnVal);
        });
    }
});
//-------------------------------------------------------------------------------------------------------------------

//update inventory of a cake
app.put('/updateInventory', function(req, res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");
    else{

        var resultToSend = [{result:true}];
        var post  = [
            {culomn:'a', value:req.body.cake_id, type: TYPES.NVarChar},
            {culomn:'b', value:req.body.stock_amount, type: TYPES.NVarChar}
        ];
        DButilsAzure.InsertUpdate(connection,'update cakes set stock_amount = @b where cake_id=@a',post, function (result) {
            res.send(resultToSend);
        });
    }
});

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            console.error('error connecting: ' + err.message);
        }
        else {
            console.log("Connected Azure");
            connected = true;
        }
    });
});