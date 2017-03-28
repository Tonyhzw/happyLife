var express = require('express');
var query = require('./server/conn.js');
var parseurl = require('parseurl');//解析url
var session = require('express-session');//设置session
var cookieParser = require('cookie-parser');//解析cookie
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));

app.use(session({
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  // var views = req.session.views
  // if (!views) {
  //   views = req.session.views = {}
  // }
  // // get the url pathname
  // var pathname = parseurl(req).pathname
  // // count the views
  // views[pathname] = (views[pathname] || 0) + 1

  next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());//若需要使用签名，需要指定一个secret,字符串,否者会报错

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    next();
});
// 查询所有博客数据
app.get('/getAll',function(req,res){
    var pageNum = req.query.pageNum;
    //连接数据库
    query("select * from data;",function(err,vals,fields) {
      console.dir(req.session.id);
      // Cookies that have not been signed
      console.log('Cookies: ', req.cookies)

      // Cookies that have been signed
      console.log('Signed Cookies: ', req.signedCookies)
      res.send(vals);
    });
});
//查询对应博客id的博客数据
app.get('/getBlog',function(req,res){
    var blogId = req.query.blogId;
    //连接数据库
    var sql="select * from data where blogId = "+ blogId+";";
    query(sql,function(err,vals,fields) {
      res.send(vals);
    });
});
//查询对应类别标签的所有博客数据
app.get('/getCategory',function(req,res){
    var categoryId = req.query.categoryId;
    var sql = "select data.blogId,data.title,data.content,data.writeTime,data.updateTime from data join addTags on data.blogId = addTags.blogId and addTags.tagId = "+categoryId+";";
    query(sql,function(err,vals,fields) {
      res.send(vals);
    });
});
//查询对应博客的所有类别标签
app.get('/getCategoryForBlog',function(req,res){
    var blogId = req.query.blogId;
    var sql = "select tag.tagId,tag.tagName from tag join addTags on tag.tagId = addTags.tagId and addTags.blogId = "+blogId+";";
    query(sql,function(err,vals,fields) {
      res.send(vals);
    });
});
//登陆验证
app.post('/login',function(req,res){
    res.header("Content-Type", "application/json;charset=utf-8");
    var username = req.body.username;
    var password = req.body.password;
    //过滤
    var sql = "select * from user where username = '"+ username+"' and password = "+password+" ;";
    query(sql,function(err,vals,fields) {
      if(vals.length == 1){
        //登录成功
        //res.cookie('mycookie', '1234567890', { domain:'localhost',secure:false, maxAage:120000, httpOnly: true });
        //res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
        req.session.save(function(err) {
          // session saved
          res.cookie('sid',req.session.id,{ maxAge: 900000, httpOnly: false});
          res.send("ok");
        });
      }else{
        //登陆失败
        res.send("false");
      }

    });
});

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/"+ "index_prod.html" );
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
