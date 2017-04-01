var express = require('express');
var query = require('./server/conn.js');
var session = require('express-session');//设置session
var cookieParser = require('cookie-parser');//解析cookie
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var moment = require('moment');

var options = {
	host: '127.0.0.1',
	user: 'root',
	password: 'newpass',
	database: 'sessionDB',
  port: 3306
};;

var app = express();

app.use(express.static(__dirname+'/public'));

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'keyboard cat',
  store: sessionStore,
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());//若需要使用签名，需要指定一个secret,字符串,否者会报错

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    //判断是否有cookie，这里如果存在cookie但是不存在session，利用cookie中的sid更新session
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
    //连接数据库，查找对应数据，并更新阅览量
    var sql = "select * from data where blogId = "+ blogId+";";
    query(sql,function(err,vals,fields) {
			let count = vals[0].count+1;
			sql = "update data set count ="+count+";";
			console.log(sql);
			query(sql,function(err,vals,fields){});
      res.send(vals);
    });
});
//查询对应类别标签的所有博客数据
app.get('/getCategory',function(req,res){
    var categoryId = req.query.categoryId;
		var sql = "";
		if(!!categoryId){
    	sql = "select data.blogId,data.title,data.content,data.writeTime,data.updateTime,data.description,data.count from data join addTags on data.blogId = addTags.blogId and addTags.tagId = "+categoryId+";";
		}else{
			sql = "select * from tag;";
		}
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
//查询输入对应的已存在的tags
app.get('/getTags',function(req,res){
    var tagStr = req.query.tagStr;
    var sql = "select tagId,tagName from tag where tagName like '%"+tagStr+"%' limit 5;";
    query(sql,function(err,vals,fields) {
      res.send(vals);
    });
});
//登陆验证
app.post('/login',function(req,res){
    //res.header("Content-Type", "application/json;charset=utf-8");
    var username = req.body.username;
    var password = req.body.password;
    //过滤
    var sql = "select * from user where username = '"+ username+"' and password = "+password+" ;";
    query(sql,function(err,vals,fields) {
      if(vals.length == 1){
        //登录成功
        //res.cookie('mycookie', '1234567890', { domain:'localhost',secure:false, maxAage:120000, httpOnly: true });
        //res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
        sessionStore.set(req.session.id, req.session, function(err){
           //res.cookie('sid',req.session.id,{domain:'localhost',secure:false, httpOnly: false});
					 res.append('Set-Cookie', 'sid='+req.session.id+'; maxAage:120000; Path=/; HttpOnly');
           console.log("---- mysql save");
           res.send("ok");
         });
        // req.session.save(function(err) {
        //   // session saved
        //   res.cookie('sid',req.session.id,{ maxAge: 900000, httpOnly: false});
        //   res.send("ok");
        // });
      }else{
        //登陆失败
        res.send("false");
      }

    });
});
//用来校验权限
function checkAuth(req,res){
		let sid = req.cookies.sid;
		//鉴权查询是异步的，因此需要返回promise
		return new Promise(function(resolve,reject){
			sessionStore.get(sid,function(err,session){
			 if(err||!session){
					console.log("--session not found--");
					reject();
			 }else{
					console.log("--session found--");
					resolve();
			 }
		 });
		});
}
//提交博客数据到数据库中保存
app.post('/postNew',function(req,res){
	  var promise = checkAuth(req,res);
		promise.then(()=>{
			let title = req.body.title;
			let category = req.body.category;
			let alCateArr = req.body.alCateArr;
			let delCateArr = req.body.delCateArr;
			let content = req.body.content;
			let description = req.body.description;
			let blogId = req.body.blogId;
			let currentTime = moment().local().format("YYYY-MM-DD HH:mm:ss");
			let sql="";
			//更新博客
			if(!!blogId){
				sql = "update data set title = '"+ title+"', content = '"+ content+"', updateTime = '"+currentTime+"',description = '"+description+"' where blogId = "+ blogId+";";
			}else{
				blogId = moment().unix();
				sql = "insert into data(blogId,title,content,writeTime,description) values("+blogId+",'"+title+"','"+content+"','"+currentTime+"','"+description+"');";
			}
			//更新标签
			let factory = require('./server/util.js');
			for(let i = 0; i < category.length; i++){
				let uid = factory.uuid(9,10);
				sql += "insert into tag(tagId,tagName,num) values("+uid+",'"+category[i]+"',1);";
				//更新addTags表
				sql += "insert into addTags(tagId,blogId) values("+uid+","+blogId+");";
			}
			//更新已存在标签的关联关系
			for(let i = 0; i < alCateArr.length; i++){
				 sql += "insert into addTags(tagId,tagName) values("+alCateArr[i].tagId+",'"+alCateArr[i].tagName+"')";
			}
			//删除已存在的标签的关联关系
			for(let i=0; i < delCateArr.length;i++){
				 sql += "delete from addTags where tagId = "+delCateArr[i].tagId+" and blogId= "+blogId+";";
			}
			//批量操作数据库
			console.log(sql);
			query(sql,function(err,vals,fields){
					console.log("sql excuted");
					res.send("ok");
			});
		}).catch(()=>{
			  res.send("bad");
		});
});
//删除博客数据
app.post('/deletePost',function(req,res){
	 var promise = checkAuth(req,res);
	 promise.then(()=>{
		 let blogId = req.body.blogId;
		 let sql = "delete from data where blogId = "+blogId+";";
				 sql += "delete from addTags where blogId = "+blogId+";";
		 console.log(sql);
		 query(sql,function(err,vals,fields){
				 console.log("sql excuted");
				 res.send("ok");
		 });
	 }).catch(()=>{
		  res.send("bad");
	 });
});
//删除tag
app.post('/deleteTag',function(req,res){
	 var promise = checkAuth(req,res);
	 promise.then(()=>{
		 let tagId = req.body.tagId;
		 console.log(tagId);
		 let sql = "delete from tag where tagId = "+tagId+";";
		 console.log(sql);
		 query(sql,function(err,vals,fields){
				 console.log("sql excuted");
				 res.send("ok");
		 });
	 }).catch(()=>{
		  res.send("bad");
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
