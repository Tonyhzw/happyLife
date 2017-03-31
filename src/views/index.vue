<template>
<div id="app">
    <div class="layout">
        <Row type="flex">
            <i-col span="6" class="layout-menu-left">
              <Row class="row category">
                <h2 class="title"><Icon type="ios-pricetags"></Icon><span class="content">文章分类</span></h2>
                <div class="content">
                    <ul>
                      <li v-for="cateAll in cateAllArr"><a v-link="{ name:'category',params:{category:cateAll.tagId}}">{{cateAll.tagName}}</a></li>
                    </ul>
                </div>
              </Row>
              <!-- <Row class="row wordCloud">
                <h2 class="title"><Icon type="ios-cloud"></Icon><span class="content">网站词云</span></h2>
                <div class="content"></div>
              </Row> -->
              <Row class="row links">
                <h2 class="title"><Icon type="link"></Icon><span class="content">友情链接</span></h2>
                <div class="content">
                    <a href="http://blog.csdn.net/datou0529"><img src="./../../public/img/csdn.png" alt="csdn" width="32" height="32"/></a>
                    <a href="https://github.com/Tonyhzw"><svg aria-hidden="true" class="octicon octicon-mark-github" height="32" version="1.1" viewBox="0 0 16 16" width="32"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>
                    <a href="https://toutiao.io/subjects/31058"><img src="./../../public/img/128.png" alt="开发者头条" width="32" height="32"/></a>
                </div>
              </Row>
            </i-col>
            <i-col span="16" offset="2" class="main-content">
               <div v-if="!!categoryId" class="category-title">
                  <Icon type="ios-pricetag"></Icon><span class="category">{{getCategoryName}}</span>
               </div>
               <div class="post-content">
                 <div class="post" v-for="item in blogData" key="item.blogId">
                 <h2 class="title left">
                   <a v-link="{ name : 'post', params : {id:item.blogId} }">{{item.title}}</a>
                 </h2>
                 <div class="meta left">
                    <p>
                      <span class="time">发表时间: {{displayTime(item.writeTime)}}</span>
                      <span class="category">归类至：
                        <a v-for="list in item.category" v-link="{ name:'category',params:{category:list.tagId}}">{{list.tagName}}</a>
                      </span>
                      <span class="count">阅读量：<span>{{item.count}}</span></span>
                    </p>
                 </div>
                 <div class="description left">
                   <p>{{displayDescription(item.description)}}</p>
                 </div>
               </div>
               </div>
            </i-col>
        </Row>
    </div>
</div>
</template>
<script>
import echarts from 'echarts';
// import store from './../store/store.js'
import axios from 'axios';
import moment from 'moment';

export default {
    ready() {
        //取回所有的分类信息
        this.getCategoryAll();
        //按条件取回其他数据
        if(!!this.categoryId)  this.getCategory();
        else this.getAll();
    },
    components:{

    },
    data(){
      return{
      }
    },
    watch:{
      categoryId:function(){
         this.getCategory();//类型变化时自动更新
      }
    },
    computed:{
      categoryId:function(){//如何设置为data，则无法更新视图
        return this.$route.params.category;
      },
      blogData:function(){
        return this.$store.state.blogData;
      },
      cateAllArr:function(){
        return this.$store.state.cateAllArr;
      },
      getCategoryName:function(){
        var blogData = this.$store.state.blogData;
        var tagId = this.$route.params.category;
        if(!!this.blogData){//取消默认值
          for(let i=0; i< blogData.length; i++){
            let category = blogData[i].category;
            for(let j=0; j< category.length; j++){
               if(category[j].tagId == tagId){
                  return category[j].tagName;
               }
            }
          }
        }
      }
    },
    methods:{
      getAll(){
        axios.get('/getAll',{
          params:{
            pageNum:1
          }
        }).then((response) => {
            var data = response.data;
            data.forEach((val)=>{
                this.getCategoryForBlog(val.blogId);
                val.category=[];
            });
            this.$store.commit('getBlogData',{
               data:data
            });
          }).catch(function (error) {
            console.log(error);
          });
      },
      getCategory(){
        axios.get('/getCategory',{
          params: {
            categoryId:this.$route.params.category,
            pageNum:1
          }
        }).then((response) => {
            var data = response.data;
            data.forEach((val)=>{
                this.getCategoryForBlog(val.blogId);
                val.category=[];
            });
            this.$store.commit('getBlogData',{
                data:data
            });
        }).catch((error)=>{
            console.log(error);
        });
      },
      getCategoryAll(){
        axios.get('/getCategory',{
          params: {
            categoryId:null,
            pageNum:1
          }
        }).then((response) => {
            var data = response.data;
            this.$store.commit('getCategoryAll',{
                data:data
            });
        }).catch((error)=>{
            console.log(error);
        });
      },
      displayDescription(str){
        if(!!str){
          return str;
        }else{
          return "本篇没有简要介绍噢...";
        }
      },
      getCategoryForBlog(id){
        axios.get('/getCategoryForBlog',{
          params: {
            blogId:id
          }
        }).then((response) => {
            var data = { blogId :id, data: response.data};
            this.$store.commit('addTagsForBlog',{
                data:data
            });
        }).catch(function(error){
            console.log(error);
        });
      },
      drawEcharts(){
        require("./china.js");
        var geoCoordMap = {
            '上海': [121.4648, 31.2891],
            '东莞': [113.8953, 22.901],
            '东营': [118.7073, 37.5513],
            '中山': [113.4229, 22.478],
            '临汾': [111.4783, 36.1615],
            '临沂': [118.3118, 35.2936],
            '丹东': [124.541, 40.4242],
            '丽水': [119.5642, 28.1854],
            '乌鲁木齐': [87.9236, 43.5883],
            '佛山': [112.8955, 23.1097],
            '保定': [115.0488, 39.0948],
            '兰州': [103.5901, 36.3043],
            '包头': [110.3467, 41.4899],
            '北京': [116.4551, 40.2539],
            '北海': [109.314, 21.6211],
            '南京': [118.8062, 31.9208],
            '南宁': [108.479, 23.1152],
            '南昌': [116.0046, 28.6633],
            '南通': [121.1023, 32.1625],
            '厦门': [118.1689, 24.6478],
            '台州': [121.1353, 28.6688],
            '合肥': [117.29, 32.0581],
            '呼和浩特': [111.4124, 40.4901],
            '咸阳': [108.4131, 34.8706],
            '哈尔滨': [127.9688, 45.368],
            '唐山': [118.4766, 39.6826],
            '嘉兴': [120.9155, 30.6354],
            '大同': [113.7854, 39.8035],
            '大连': [122.2229, 39.4409],
            '天津': [117.4219, 39.4189],
            '太原': [112.3352, 37.9413],
            '威海': [121.9482, 37.1393],
            '宁波': [121.5967, 29.6466],
            '宝鸡': [107.1826, 34.3433],
            '宿迁': [118.5535, 33.7775],
            '常州': [119.4543, 31.5582],
            '广州': [113.5107, 23.2196],
            '廊坊': [116.521, 39.0509],
            '延安': [109.1052, 36.4252],
            '张家口': [115.1477, 40.8527],
            '徐州': [117.5208, 34.3268],
            '德州': [116.6858, 37.2107],
            '惠州': [114.6204, 23.1647],
            '成都': [103.9526, 30.7617],
            '扬州': [119.4653, 32.8162],
            '承德': [117.5757, 41.4075],
            '拉萨': [91.1865, 30.1465],
            '无锡': [120.3442, 31.5527],
            '日照': [119.2786, 35.5023],
            '昆明': [102.9199, 25.4663],
            '杭州': [119.5313, 29.8773],
            '枣庄': [117.323, 34.8926],
            '柳州': [109.3799, 24.9774],
            '株洲': [113.5327, 27.0319],
            '武汉': [114.3896, 30.6628],
            '汕头': [117.1692, 23.3405],
            '江门': [112.6318, 22.1484],
            '沈阳': [123.1238, 42.1216],
            '沧州': [116.8286, 38.2104],
            '河源': [114.917, 23.9722],
            '泉州': [118.3228, 25.1147],
            '泰安': [117.0264, 36.0516],
            '泰州': [120.0586, 32.5525],
            '济南': [117.1582, 36.8701],
            '济宁': [116.8286, 35.3375],
            '海口': [110.3893, 19.8516],
            '淄博': [118.0371, 36.6064],
            '淮安': [118.927, 33.4039],
            '深圳': [114.5435, 22.5439],
            '清远': [112.9175, 24.3292],
            '温州': [120.498, 27.8119],
            '渭南': [109.7864, 35.0299],
            '湖州': [119.8608, 30.7782],
            '湘潭': [112.5439, 27.7075],
            '滨州': [117.8174, 37.4963],
            '潍坊': [119.0918, 36.524],
            '烟台': [120.7397, 37.5128],
            '玉溪': [101.9312, 23.8898],
            '珠海': [113.7305, 22.1155],
            '盐城': [120.2234, 33.5577],
            '盘锦': [121.9482, 41.0449],
            '石家庄': [114.4995, 38.1006],
            '福州': [119.4543, 25.9222],
            '秦皇岛': [119.2126, 40.0232],
            '绍兴': [120.564, 29.7565],
            '聊城': [115.9167, 36.4032],
            '肇庆': [112.1265, 23.5822],
            '舟山': [122.2559, 30.2234],
            '苏州': [120.6519, 31.3989],
            '莱芜': [117.6526, 36.2714],
            '菏泽': [115.6201, 35.2057],
            '营口': [122.4316, 40.4297],
            '葫芦岛': [120.1575, 40.578],
            '衡水': [115.8838, 37.7161],
            '衢州': [118.6853, 28.8666],
            '西宁': [101.4038, 36.8207],
            '西安': [109.1162, 34.2004],
            '贵阳': [106.6992, 26.7682],
            '连云港': [119.1248, 34.552],
            '邢台': [114.8071, 37.2821],
            '邯郸': [114.4775, 36.535],
            '郑州': [113.4668, 34.6234],
            '鄂尔多斯': [108.9734, 39.2487],
            '重庆': [107.7539, 30.1904],
            '金华': [120.0037, 29.1028],
            '铜川': [109.0393, 35.1947],
            '银川': [106.3586, 38.1775],
            '镇江': [119.4763, 31.9702],
            '长春': [125.8154, 44.2584],
            '长沙': [113.0823, 28.2568],
            '长治': [112.8625, 36.4746],
            '阳泉': [113.4778, 38.0951],
            '青岛': [120.4651, 36.3373],
            '韶关': [113.7964, 24.7028]
        };

        var BJData = [
            [{
                name: '北京'
            }, {
                name: '上海',
                value: 95
            }],
            [{
                name: '北京'
            }, {
                name: '广州',
                value: 90
            }],
            [{
                name: '北京'
            }, {
                name: '大连',
                value: 80
            }],
            [{
                name: '北京'
            }, {
                name: '南宁',
                value: 70
            }],
            [{
                name: '北京'
            }, {
                name: '南昌',
                value: 60
            }],
            [{
                name: '北京'
            }, {
                name: '拉萨',
                value: 50
            }],
            [{
                name: '北京'
            }, {
                name: '长春',
                value: 40
            }],
            [{
                name: '北京'
            }, {
                name: '包头',
                value: 30
            }],
            [{
                name: '北京'
            }, {
                name: '重庆',
                value: 20
            }],
            [{
                name: '北京'
            }, {
                name: '常州',
                value: 10
            }]
        ];

        var SHData = [
            [{
                name: '上海'
            }, {
                name: '包头',
                value: 95
            }],
            [{
                name: '上海'
            }, {
                name: '昆明',
                value: 90
            }],
            [{
                name: '上海'
            }, {
                name: '广州',
                value: 80
            }],
            [{
                name: '上海'
            }, {
                name: '郑州',
                value: 70
            }],
            [{
                name: '上海'
            }, {
                name: '长春',
                value: 60
            }],
            [{
                name: '上海'
            }, {
                name: '重庆',
                value: 50
            }],
            [{
                name: '上海'
            }, {
                name: '长沙',
                value: 40
            }],
            [{
                name: '上海'
            }, {
                name: '北京',
                value: 30
            }],
            [{
                name: '上海'
            }, {
                name: '丹东',
                value: 20
            }],
            [{
                name: '上海'
            }, {
                name: '大连',
                value: 10
            }]
        ];

        var GZData = [
            [{
                name: '广州'
            }, {
                name: '福州',
                value: 95
            }],
            [{
                name: '广州'
            }, {
                name: '太原',
                value: 90
            }],
            [{
                name: '广州'
            }, {
                name: '长春',
                value: 80
            }],
            [{
                name: '广州'
            }, {
                name: '重庆',
                value: 70
            }],
            [{
                name: '广州'
            }, {
                name: '西安',
                value: 60
            }],
            [{
                name: '广州'
            }, {
                name: '成都',
                value: 50
            }],
            [{
                name: '广州'
            }, {
                name: '常州',
                value: 40
            }],
            [{
                name: '广州'
            }, {
                name: '北京',
                value: 30
            }],
            [{
                name: '广州'
            }, {
                name: '北海',
                value: 20
            }],
            [{
                name: '广州'
            }, {
                name: '海口',
                value: 10
            }]
        ];

        var planePath =
            'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDM4XzgiPjxnPjxnPjxwYXRoIGQ9Ik0yNjYuMjkxLDEyNy40OTNjLTAuODk3LDAtMS40OTgtMC4xMy0xLjk3MS0wLjIzYy0yLjIwOC0wLjQ3Ni0zLjM1MS0xLjc0OS0zLjkxNS0yLjczNSAgICAgYy0wLjk0Mi0xLjYzNC0wLjQzOS0zLjcxNywxLjE0Ni00LjczNmMyMi40MjktMTQuNDMzLDUyLjg0Mi0zNC4yMDYsNzUuNTUzLTQ5LjI5MWMtMTguNjc4LDExLjI3My00MC42MDYsMjUuNTEtNTMuMywzMy43NTcgICAgIGMtMjMuMDkzLDE0Ljk5MS0yMy4wOTMsMTQuOTk3LTI1LjExOCwxNC41MDZjLTAuOTQ2LTAuMjI1LTEuNzc0LTAuODQtMi4yNjItMS42OGMtMi40OC00LjI5NywxLjMtOS4zODUsMTQuOTk4LTE4Ljc0OCAgICAgYy0wLjkxNi0xLjU0My0wLjUzNC0zLjU0MiwwLjkyMi00LjYyN2wyMy45OTYtMTcuOTc4Yy0wLjgzMS0xLjY1OS0wLjIzLTMuNjk2LDEuMzk1LTQuNjMzYzAuMzA0LTAuMTc2LDAuNjE5LTAuMjk3LDAuOTQtMC4zNzYgICAgIGMyLjA0NC0wLjk3OSwxMS41NjQtNi41OTgsMjAuMDE5LTExLjcyMmMxLjYxMy0wLjk3NCwzLjY5OS0wLjUxOSw0Ljc2MSwxLjA0M2MwLjg5NywxLjMzNywwLjc3LDMuMDgzLTAuMjM3LDQuMjY2bDMwLjAzNy0xNy4zNDQgICAgIGMwLjgxOC0wLjQ2NywxLjc3Ny0wLjU5OCwyLjY4Ny0wLjM1MmMwLjg5NywwLjI0MywxLjY3NCwwLjgzNywyLjE0MSwxLjY0NmMwLjQxOSwwLjczMSwwLjYxMiwxLjQzOCwwLjU4MiwyLjEzOCAgICAgYzYuNjA0LTMuMTIsMTAuNTY0LTQuMTU3LDEyLjc5Ni0zLjYyMWMxLjI5MiwwLjMxLDIuMzU0LDEuMDgzLDIuOTg0LDIuMTY4YzEuNzgyLDMuMDg2LTAuODg2LDUuMDM2LTUuMzAxLDguMjU5ICAgICBjLTIuNzU5LDIuMDE0LTYuODU4LDQuODY3LTEyLjE3MSw4LjQ4N2MtOC45MzMsNi4wNjItMjEuNDQ0LDE0LjM3NS0zNy4xOTksMjQuNzA5Yy0xMS42NTUsNy42MzgtMjMuMzk2LDE1LjI3Ni0zMi45NzgsMjEuNDg2ICAgICBjOC43NTEtNC43NDIsMjEuMDc5LTEyLjA2OCwzOC4zOTktMjMuMzU3YzI2LjI0Ni0xNy4xMDIsNTEuMDUtMzQuOTA3LDUxLjI5Mi0zNS4wODNjMS41ODMtMS4xNCwzLjc5MS0wLjc3Niw0LjkzMSwwLjgwNyAgICAgYzEuMTQsMS41ODYsMC43NzYsMy43OTMtMC44MDcsNC45MzFjLTAuMjQ5LDAuMTc2LTI0Ljk3OSwxNy45MjktNTEuMjMxLDM1LjA1MkMyODMuODQ4LDEyMy45MzQsMjcwLjk5NywxMjcuNDkzLDI2Ni4yOTEsMTI3LjQ5MyAgICAgeiIgc3R5bGU9ImZpbGw6I0Q3MUE2MDsiLz48L2c+PGc+PHBhdGggZD0iTTk3LjI1NiwyMTEuMDgyYy0wLjUwMywwLTAuOTYxLTAuMDUxLTEuMzgtMC4xNDNjLTEuNDc5LTAuMzM2LTIuNjg3LTEuMjAxLTMuNDAyLTIuNDM4ICAgICBjLTAuNDg4LTAuODQzLTAuNjA0LTEuODUtMC4zMjgtMi43OGMwLjQ0My0xLjQ3NCwwLjY2NC0xLjU4Niw0LjQyMS0zLjQ2OWMwLjA5NC0wLjA0NSwwLjE4OC0wLjA5MSwwLjI4NS0wLjE0MyAgICAgYy0wLjM1OC0wLjI3Ni0wLjY2MS0wLjYyMi0wLjg5Mi0xLjAyMmMtMC40OTctMC44NTgtMC45NzMtMi4yOC0wLjQ0Ni00LjE5YzAuNC0xLjQyOCwxLjAzMS0zLjcwOCw3LjUzMi05LjM2MyAgICAgYy0wLjM3LTAuMjg4LTAuNjc5LTAuNjUyLTAuOTIyLTEuMDY3Yy0xLjcwNC0yLjk0NywwLjM3OS00LjY4Miw1LjE2Ny04LjAzNWMtMC4wMjctMC4wMDMtMC4wNDktMC4wMTItMC4wNzMtMC4wMTUgICAgIGMtMS4wODktMC4yNzMtMS45ODktMC45NDMtMi41MjktMS44OGMtMC45NTgtMS42NjItMC40MjEtMy43ODEsMS4yMS00Ljc3OWM5LjIwNi01LjY0MywxOS41MjctMTIuMDA0LDMwLjIxMy0xOC42NTEgICAgIGMtMS4wMTMsMC4yODUtMS42NzEsMC4yNDUtMi4zMDgsMC4wOTRjLTEuMDIxLTAuMjQzLTEuODc0LTAuODczLTIuMzg5LTEuNzcxYy0wLjIwNy0wLjM2MS0wLjM0Ni0wLjc0My0wLjQxOC0xLjEzMSAgICAgYy0yLjgzOCwxLjE5OC00LjMsMS4zODMtNS4zNDYsMS4xMTZjLTEuMDM0LTAuMjU3LTEuODkyLTAuOS0yLjQxMS0xLjgwNGMtMC45NzctMS42ODYtMC4zOTQtMy44NDgsMS4yOTItNC44MjQgICAgIGMwLjc2MS0wLjQ0LDEuNjI1LTAuNTYxLDIuNDI5LTAuNDA2YzYuMTY3LTEuOTExLDM4LjMyNC0yMS44MTcsNTkuODA0LTM1LjExM2M0MC4wMTMtMjQuNzcsNDAuNDQzLTI0LjY2NCw0Mi44MjEtMjQuMDY3ICAgICBjMC45MjUsMC4yMzQsMS43ODYsMC44OCwyLjI2OCwxLjcwOGMwLjAzMywwLjA2MSwwLjA3LDAuMTI3LDAuMTAzLDAuMTg4YzIuNjg0LTAuOTYxLDQuNTk0LTEuMjM0LDUuOTI1LTAuOTE5ICAgICBjMS4yNTgsMC4zLDIuMjg3LDEuMDQ5LDIuODk2LDIuMTFjMS45NSwzLjM4MS0xLjUxLDUuOTk1LTUuODkyLDkuMzA2Yy0wLjEzNCwwLjEwMS0wLjI3MywwLjIwMy0wLjQwOSwwLjMxICAgICBjMC4zMzMsMC4wMDMsMC42MDYsMC4wNzMsMC45MDksMC4xNDhjMC45MjgsMC4yMzMsMS43OTUsMC44ODIsMi4yNzcsMS43MWMwLjk1NSwxLjY1LDAuNDIxLDMuNzU3LTEuMTk0LDQuNzY3ICAgICBjLTEuNDQ3LDAuODk4LTIuOTE3LDEuODEzLTQuNDAzLDIuNzQxYzEuNjI1LTAuNjg4LDIuMTExLTAuNTYxLDIuNzkzLTAuMzg1YzAuOTI1LDAuMjMzLDEuNzM0LDAuODQ5LDIuMjEzLDEuNjc0ICAgICBjMC4yNzMsMC40NzYsMC40MzEsMS4wMDMsMC40NjQsMS41NGMzLjkwMy0wLjkzNCw1LjY0OS0wLjU1OCw2LjgwMS0wLjMxM2MxLjUxNiwwLjMyNSwyLjU4NiwwLjk3MSwzLjMzNSwxLjY3NyAgICAgYzEuODMyLTAuMzg4LDMuMzU3LTAuNDQzLDQuNi0wLjE2MWMyLjE0MSwwLjQ4MiwzLjI2MiwxLjc1LDMuODI5LDIuNzI2YzAuOTc3LDEuNjkyLDAuMzk1LDMuODUxLTEuMjkyLDQuODI3ICAgICBjLTEuNDc3LDAuODUzLTMuMzA4LDAuNTE5LTQuMzk2LTAuN2MtMC4yODUtMC4wMTUtMC43MDEsMC4wMTUtMS4zMTYsMC4xNDNjLTEuMTk1LDMuNjg0LTYuMjk1LDEzLjMwOC02OS45NTYsNDguNjQyICAgICBjLTEyLjAyMyw2LjY3MS0yNS4yNTUsMTMuNzgxLTM5LjU3NiwyMS4yNjJDMTE2LjM1OCwyMDMuNzI5LDEwMy41MDgsMjExLjA3Niw5Ny4yNTYsMjExLjA4MnogTTIyMi4yMDMsMTIzLjk1NSAgICAgYy0xMS4yNCw1LjY3My0yOC40MzksMTUuNTctNTQuNzAxLDMyLjY5M2MtMjIuMDMyLDE0LjM1Ny00My4zODgsMjkuMjI0LTU1LjY5OCwzNy45MTVjOC4zNjMtNC4yNTcsMTYuNDI1LTguNDEyLDI0LjE2Ny0xMi40NSAgICAgYzEwLjQtNi45NTYsMjEuNDI5LTE0LjU4MiwzMS4xNDktMjEuMzA4QzE5MC43MDgsMTQ0LjQ4OSwyMDguNzM0LDEzMi4yMjEsMjIyLjIwMywxMjMuOTU1eiBNMjMwLjUxNywxMjcuMjI0ICAgICBjLTIuMzg5LDEuNDAxLTUuMDU4LDMuMDE3LTguMDM1LDQuODc1Yy03LjA5Miw0LjQzLTE1LjAwMyw5LjY1Mi0yMy4yNjYsMTUuMjRDMjE0LjI3NywxMzguNDQyLDIyNC4xMDcsMTMxLjkzOCwyMzAuNTE3LDEyNy4yMjR6ICAgICAiIHN0eWxlPSJmaWxsOiNENzFBNjA7Ii8+PC9nPjxnPjxwYXRoIGQ9Ik05MS41MDEsMjAwLjcyN2MtMC4yNTUsMC0wLjUxOS0wLjAzMy0wLjgxMy0wLjA5N2MtMC45NjctMC4yMTItMS44MDctMC44MjItMi4zMDEtMS42OCAgICAgYy0wLjM3LTAuNjQtMC4zNy0wLjY0LTAuOTctNC4xODRjLTAuMDc2LTAuNDQ5LTAuMTczLTEuMDE5LTAuMjc2LTEuNjM1Yy0xLjA4LDAuNzE5LTIuMTc3LDEuMTM3LTMuNDYsMC45MDcgICAgIGMtMS4xMDEtMC4xOTQtMi4wNS0wLjg2MS0yLjYwNy0xLjgyNWMtMC45NTUtMS42NTMtMC41MTYtMi43NzEsMC43MjItNC42ODVjLTAuOTk1LDAuNzEtMS45OCwxLjQzMi0yLjkxNCwyLjEzMiAgICAgYy0xLjU0NiwxLjE2NS0zLjc0MiwwLjg2NC00LjkyMS0wLjY3Yy0xLjE4My0xLjUyOC0wLjkxLTMuNzI5LDAuNjA5LTQuOTI0bDIuMzY1LTEuODY1Yy0wLjU2Ny0wLjMyNS0xLjA0Ni0wLjc5Mi0xLjM3OS0xLjM3NCAgICAgYy0wLjQ3LTAuODE2LTAuNTk4LTEuODA0LTAuMzQ5LTIuNzE0YzAuNDQ5LTEuNjQ2LDAuNS0xLjgyOSwxNi41MDEtMTAuODk4Yy0wLjI0Ni0wLjA0Mi0wLjQ2MS0wLjA4OC0wLjY2MS0wLjEzICAgICBjLTIuMzUzLTAuNTAzLTMuNTYzLTEuODUzLTQuMTY2LTIuODk2Yy0wLjU1Mi0wLjk1NS0xLjA3Ny0yLjUyLTAuNDU4LTQuNTU0YzAuOTQtMy4xMDIsNC42MTgtNi42MDcsMTEuNDkyLTExLjA4ICAgICBjLTAuMDE1LTAuNTU1LDAuMDYxLTEuMTE5LDAuMjI4LTEuNjgzYzEuMzQ5LTQuNTY2LDkuNTIxLTEwLjA0OSwyNy43MTEtMTkuNzc5Yy0wLjM5NS0xLjI2MS0wLjA0OS0yLjY1NiwwLjkwOS0zLjU4NyAgICAgYy0wLjg1NSwwLjA0Ni0xLjM5Mi0wLjA3Mi0xLjgzNC0wLjE2OWMtMS4zNjUtMC4zMDMtMi40NzUtMS4wOTUtMy4xMzItMi4yMjljLTAuOTM3LTEuNjI4LTAuNDM3LTMuNzA4LDEuMTQtNC43M2w2LjAzNC0zLjkxMiAgICAgYy0wLjExNS0wLjE0OC0wLjIyMS0wLjMwMy0wLjMxMi0wLjQ2NGMtMC45NzctMS42ODktMC4zOTctMy44NTEsMS4yOTItNC44MjdjMC45ODUtMC41NjQsMi4xMi0wLjYwNCwzLjA5Ni0wLjIxNSAgICAgYzQuNTcyLTEuMzA0LDIxLjE4LTEyLjQ2OCwzMi4zMzUtMTkuOTY3YzI0LTE2LjEzNywyOC44LTE4Ljg0MiwzMi4wNzQtMTguMDg0YzEuMTA3LDAuMjU3LDIuMDIyLDAuOTI4LDIuNTc4LDEuODgzICAgICBjMC4yMzYsMC40MjEsMC4zODUsMC44NjEsMC40NDMsMS4zMTNjMC4yNzktMC4wMTIsMC41NjMsMC4wMjEsMC44NDYsMC4wODVjMC45NjQsMC4yMTUsMS43OTgsMC44MjIsMi4yOTUsMS42OCAgICAgYzEuNjQ0LDIuODU0LTAuNTYxLDQuNDkxLTMuOTA5LDYuOTcxYy0xLjkzNSwxLjQzNC00LjcyMSwzLjQ0NC04LjA3OCw1Ljg0Yy0wLjI0NiwwLjE3My0wLjQ5NywwLjM1NS0wLjc0OSwwLjUzNyAgICAgYzEuOTgtMS4xMzEsMy44NDItMi4xNzcsNS41ODUtMy4xMzhjMy4zMDgtMi4yMDIsNi42MDctNC40MTUsOS44NjEtNi42MjNjMC44MS0wLjU1NSwxLjgxMy0wLjczNiwyLjc3MS0wLjUyMSAgICAgYzAuMjczLDAuMDY0LDAuNTM0LDAuMTU4LDAuNzc2LDAuMjc5YzEwLjg4My01LjAwNiwxMy42NjktNC4zODgsMTUuMzA0LTQuMDIxYzIuMDIyLDAuNDQ5LDMuMDc0LDEuNjI1LDMuNTk5LDIuNTMyICAgICBjMC42MjcsMS4wODksMS4yMjgsMi44NzgsMC41MTUsNS4yMTZjLTAuODMxLDIuNzM1LTMuNTU0LDUuNzkxLTguMDIsOS4yNjNjLTAuMDMzLDAuMzEyLTAuMDk0LDAuNjM3LTAuMTg4LDAuOTc5ICAgICBjLTIuODExLDEwLjMxMy00NC4xMzYsMzUuNzQ3LTExMC40NjgsNzMuNDM5bC0xNC40NywxMS40MTZjMC41MTIsMS4xMjUsMC40LDIuNDQxLTAuMzEzLDMuNDcyICAgICBjLTEuMjI1LDEuNzczLTIuNTA3LDMuNjMyLTMuNjksNS4zNTdjMC4xODUsMC4yMDMsMC4zNDksMC40MjgsMC40OTEsMC42N2MwLjM5NywwLjY4NSwwLjU4OCwxLjMyMiwxLjM0Myw1LjY2NCAgICAgYzIuNDMyLTEuNTQxLDMuNzE3LTEuOTQxLDUuMTM2LTEuNjI4YzEuMDI1LDAuMjI4LDEuOTExLDAuODcsMi40MjksMS43NjhjMC45NzYsMS42OTIsMC4zOTcsMy44NTQtMS4yOTIsNC44MjggICAgIGMtMC41MTUsMC4yOTctMS4wNjcsMC40NDktMS42MjIsMC40NzNjLTEuMDY3LDAuNTg4LTMuMTQxLDIuMDUtMy44OSwyLjU4QzkzLjQzNSwyMDAuMTQyLDkyLjYwNywyMDAuNzI3LDkxLjUwMSwyMDAuNzI3eiAgICAgIE0xNjAuMzY1LDEyMy43NjdjLTEuNjM0LDAuODEzLTMuMjk5LDEuNjMyLTQuOTg1LDIuNDYyYy0yMy41MzMsMTEuNTk4LTU1LjEwMSwyNy4xNTMtNjEuMjI2LDMzLjk3MyAgICAgYzQuNDI3LTAuNTY3LDE4LjgyNy01LjQ5NSw2NC4wOTQtMzUuMDQ2QzE1OC45NTIsMTI0LjY5NSwxNTkuNjYxLDEyNC4yMjgsMTYwLjM2NSwxMjMuNzY3eiBNMjExLjU3NSw4NC4xMjQgICAgIGMtMS41OTIsMy42OTYtNi44NjUsOC4wNzItMTUuMzUyLDEzLjM4MWMxLjU1OS0wLjg1MiwzLjA3NS0xLjY5NSw0LjUzNi0yLjUyNWMxNC43NzktOC4zOTQsMTkuNTQ4LTEyLjc5MywyMS4wNzctMTQuODE1ICAgICBDMjE5LjYwNyw4MC41NywyMTYuMDk5LDgxLjk0NywyMTEuNTc1LDg0LjEyNHoiIHN0eWxlPSJmaWxsOiNENzFBNjA7Ii8+PC9nPjxnPjxwYXRoIGQ9Ik01OC44NzUsMjE5Ljc3NWMtMC4zMTgsMC0wLjU2Ny0wLjA2MS0wLjgyOC0wLjEyNWMtMC45MzEtMC4yMzMtMS43NzctMC44NjQtMi4yNTYtMS42OTUgICAgIGMtMS41NjItMi43MDItMC4yNTQtNC41MDYsNS43MTktOS43MzljLTEuMjc2LDAuNzczLTIuNTUzLDEuNTUyLTMuODA4LDIuMzIzYy0xLjU0NywwLjkzNy0zLjU0OCwwLjU3LTQuNjQ4LTAuODY0ICAgICBjLTEuMTAxLTEuNDQtMC45MzctMy40NjksMC4zNzYtNC43MTVsNi4yMS01Ljg4MmwtMC42NzYsMC4zODhjLTEuNDU4LDAuODM3LTMuMzAyLDAuNTM3LTQuNDE1LTAuNzE5ICAgICBjLTEuMTEtMS4yNjEtMS4xODMtMy4xMzItMC4xNjktNC40NjlsNi4xOTQtOC4xOTNjLTAuNDY0LTAuMzQtMC44NjQtMC43NzktMS4xNjEtMS4yOTJjLTAuNjY0LTEuMTU1LTAuNjI1LTIuNTgxLDAuMS0zLjY5NiAgICAgYzAsMCwxLjUwMS0yLjMwNywzLjQzNi01LjI3NmMtNi4wNjgsMy41MDItNi42NjUsMy4zNTQtNy44MzMsMy4wNTdjLTAuOTI4LTAuMjMzLTEuNzQtMC44NDktMi4yMTYtMS42NzcgICAgIGMtMS41OTUtMi43NiwwLjQwOS00LjY1OCw0LjQtOC40MzZjMS44NC0xLjc0MSw0LjE4OC0zLjg4NCw2LjYwNy02LjA3MWMtMC4zMTMtMC4yNjQtMC41NzktMC41NzktMC43ODYtMC45NCAgICAgYy0wLjUwMy0wLjg2Ny0wLjc2NC0xLjY1NS0wLjYyNS0yLjU0NGMtMC4wNDgtMC4wMDktMC4wOTEtMC4wMjEtMC4xMzYtMC4wMzNjLTEuMTA0LTAuMjQ2LTIuMDE3LTAuOTEtMi41NjUtMS44NjIgICAgIGMtMS42NDQtMi44NDQsMC4xMDktNC41NTEsNS4xNTItOC4wODRjLTAuMS0wLjEyNy0wLjE4OC0wLjI2MS0wLjI3LTAuNDAzYy0wLjQ3My0wLjgxOS0wLjYwNC0xLjg1LTAuMzUyLTIuNzYzICAgICBjMC40ODgtMS43ODMsMC42MjUtMi4yOCwxOS4xOS0xMi44MzVjLTAuNDczLTAuMzczLTAuODctMC44MzEtMS4xNzMtMS4zNTVjLTAuNTY0LTAuOTc5LTEuMTA2LTIuNTgxLTAuNDk0LTQuNjgyICAgICBjMS43MTMtNS44NzEsMTIuNTA1LTEzLjA5OSwzNC4wNzYtMjQuNzk0Yy0wLjA2Ni0wLjQ2MS0wLjAzNi0wLjkzNywwLjA4OC0xLjM5OGMwLjI0Ni0wLjkwOSwwLjg0My0xLjY4LDEuNjU5LTIuMTQ2ICAgICBjOC4xMTctNC42MzYsMTYuNDIyLTkuNTA2LDI0LjI5NC0xNC4yMzljLTAuMzQzLTAuMzAzLTAuNjQzLTAuNjY0LTAuODc5LTEuMDc2Yy0xLjMwNy0yLjI1OS0wLjE4Mi0zLjkzLDIuNDQ3LTYuNTcxICAgICBjLTIuMzc3LDEuNTEtNC43NjcsMy4wNS03LjA5NSw0LjU2NmMtMC44MTUsMC41MzQtMS44MDcsMC43MDctMi43NTMsMC40NzljLTAuOTQtMC4yMjgtMS43NTMtMC44MjgtMi4yMzgtMS42NzEgICAgIGMtMS4yNTUtMi4xOC0wLjU3OS0zLjM0MSwyLjc0OC02LjY0MWMtNS44OTIsMy43MjctOC40MTcsNC42ODItMTAuNDYxLDQuMjE1Yy0xLjEyMi0wLjI0OS0yLjA0My0wLjkyNS0yLjYwNC0xLjg5OCAgICAgYy0wLjk3OS0xLjY4OS0wLjM5Ny0zLjg1MSwxLjI5Mi00LjgyN2MwLjgxLTAuNDcsMS43MzQtMC41NzYsMi41NzQtMC4zNzZjMi44NzUtMS4xNDMsMTEuMjA3LTYuODY1LDE2Ljg0Ny0xMC43MzcgICAgIGMxMy45ODQtOS42LDE3LjU1NC0xMS43ODMsMjAuNDE5LTExLjEzMWMxLjA5MSwwLjI0NiwxLjk5MiwwLjkwNywyLjU0MSwxLjg1M2MwLjgyMSwxLjQzMSwwLjU0OSwzLjIzOC0wLjY1OCw0LjM2ICAgICBjLTEuMTI1LDEuMDQzLTIuMjY1LDIuMTAxLTMuNDA1LDMuMTZjNi4yNTktMy4zMiw3LjQxMS0zLjA0Nyw4LjMxMi0yLjgzMmMxLjAyNSwwLjI0NiwxLjg3MSwwLjg3MywyLjM4OSwxLjc3MSAgICAgYzAuNzYxLDEuMzIyLDAuNTg1LDIuOTY5LTAuNDAzLDQuMDk0YzkuNzY3LTYuOTA0LDE0LjA0Mi05LjMwOSwxNy4wOTktOC42NTFjMS4yMTksMC4yNjEsMi4yMjYsMC45ODIsMi44MzUsMi4wMzggICAgIGMwLjI3OSwwLjQ4OCwwLjQ1NSwxLjAyOCwwLjUxOSwxLjU4M2MwLjIzMy0wLjE2MSwwLjQ3LTAuMzE4LDAuNzA0LTAuNDc5YzAuODEtMC41NTUsMS44MTMtMC43NDYsMi43NzQtMC41MjcgICAgIGMwLjk2NCwwLjIxNSwxLjc4NiwwLjgyMSwyLjI3NywxLjY3N2MwLjUxMiwwLjg4OCwxLjAwNiwyLjMyOSwwLjQ4OCw0LjIxMWMwLjAzNy0wLjAyNywwLjA3My0wLjA1NCwwLjExMi0wLjA4MiAgICAgYzAuODEzLTAuNTU4LDEuODIyLTAuNzU1LDIuNzg0LTAuNTRjMC45NjEsMC4yMjIsMS43ODksMC44MjgsMi4yODMsMS42ODNjMC42MjUsMS4wOCwwLjc3LDIuMzgsMC40MTUsMy42NjYgICAgIGMtMi4xMDcsNy43MDgtMzEuNTgsMjUuNjM4LTkyLjUwOSw2MC4wMWMtMS4xNTgsMS42OTgtMy44NjYsMy41NjMtOC4xMDgsNi40ODljLTIuMjE2LDEuNTMxLTQuODIxLDMuMjktNy42MDIsNS4xNCAgICAgYzEuMDg1LDIuNTQ3LTEuMjIyLDQuMzA5LTMuMTAyLDUuNzQzYy0xLjI2NSwwLjk2NC0zLjA1NywyLjI4LTUuMSwzLjc4MWMtMS4wMDMsMC43MzctMi4yMTMsMS42MjgtMy41MywyLjYwMiAgICAgYzAuMDYxLDAuMDg4LDAuMTE5LDAuMTc5LDAuMTcsMC4yN2MxLjU4LDIuNzM1LTAuNDczLDQuNjc2LTQuMjAyLDguMTk5Yy0xLjA3NCwxLjAxLTIuMzMyLDIuMTcxLTMuNjc1LDMuNDAyICAgICBjMC40MjEsMC4xNzMsMC44MTksMC40MzEsMS4xNTUsMC43NzNjMi4wMjksMi4wMjUsMS4wOTgsMy40NTQtMS4zODksNy4yNjhsLTMuMjg0LDUuMDM3YzAuODMxLDAuMjkxLDEuNTM0LDAuODczLDEuOTgzLDEuNjQ2ICAgICBjMC43MDksMS4yMzEsMC42MTIsMi43NjktMC4yNCwzLjg5OWwtMy4zNTksNC40MzlsMTEuNTE2LTYuNjQ2YzEuNTQ5LTAuODk3LDMuNTI2LTAuNDg4LDQuNTk3LDAuOTQ2czAuODk3LDMuNDQ1LTAuNDAzLDQuNjc2ICAgICBsLTUuOTE4LDUuNjA5YzEuNzUyLTAuNzQzLDIuMjU5LTAuNjEyLDIuOTA4LTAuNDQ2YzAuOTI1LDAuMjMzLDEuNzM3LDAuODQ5LDIuMjE2LDEuNjcxYzEuMzA0LDIuMjYyLDAuNTg4LDQuNTI0LTIuNjM1LDguMDgxICAgICBjMS4zNjctMC4yNTIsMi44MjYsMC4zNDIsMy42MTcsMS41OThjMS4wMzQsMS42NTYsMC41MzcsMy44MzYtMS4xMTksNC44NzNDNjQuNjI0LDIxNy45NTgsNjAuNjI0LDIxOS43NzUsNTguODc1LDIxOS43NzV6ICAgICAgTTE1NC4xODgsOTAuMjc2Yy0zLjMxMSwxLjczNy02LjgzMiwzLjU2OS0xMC41Nyw1LjUwNmMtMTguODg1LDkuOC00Ni4zMjksMjQuMDQtNTMuMzYxLDMxLjA3NCAgICAgQzk5Ljc1NywxMjMuOTE4LDEyNS4xNjEsMTA4Ljk5MSwxNTQuMTg4LDkwLjI3NnoiIHN0eWxlPSJmaWxsOiNENzFBNjA7Ii8+PC9nPjxnPjxwYXRoIGQ9Ik0yNjAuMTA4LDQ2MS44NjFjLTAuMjE5LDAtMC40NDktMC4wMTgtMC42OTEtMC4wNjFjLTEuMDA3LTAuMi0xLjg4Ni0wLjgzMS0yLjM5Ni0xLjcxNiAgICAgYy0wLjg5Ny0xLjU3MS0wLjQzMS0yLjY3NSwwLjQwMy00LjQzOWMtNC4wNjMsMi4yOTgtNS4xOTEsMi4wNjItNi4wNCwxLjg4Yy0xLjA2Ny0wLjIzLTEuOTgtMC44OTctMi41MTctMS44MTkgICAgIGMtMC45MS0xLjU3Ny0wLjQ3My0zLjU5LDEuMDE2LTQuNjQ2bDAuOTg1LTAuNjk3Yy0wLjE4Mi0wLjE5My0wLjM0My0wLjQwNi0wLjQ3My0wLjYzMWMtMC44NC0xLjQ2MS0xLjAwMS0yLjg3NC0wLjAyMS00LjY1MSAgICAgYy0xLjY4NiwwLjk0Ni0zLjgyNCwwLjM0Ni00Ljc5MS0xLjMzNGMtMC40NDktMC43ODgtMC41NjEtMS42NzQtMC4zODUtMi40OThjLTEuMDk1LTAuMTIyLTIuMTE3LTAuNzU5LTIuNjkzLTEuNzk2ICAgICBjLTAuMjQzLTAuNDM3LTAuMzg1LTAuOTAzLTAuNDMtMS4zN2MtMS4yOTUsMC42NDMtMi4wMTcsMS4wMDctMi4wNTksMS4wMzFjLTEuNzA3LDAuODQzLTMuNzgxLDAuMTc2LTQuNjc5LTEuNTA0ICAgICBjLTAuOTA0LTEuNjgtMC4zMDMtMy43NzIsMS4zNDYtNC43MjVsMC4zNzktMC4yMThjLTAuMzMzLTAuMjYxLTAuNjIxLTAuNTc2LTAuODU4LTAuOTY1Yy0wLjk5OC0xLjYyNS0wLjUwOS0zLjc2NiwxLjEwMS00LjgwMyAgICAgbDEzLjQzOS04LjY4NWwtMTguNjQyLDEwLjc1OWMtMS42OTIsMC45NzctMy44NTEsMC40LTQuODI0LTEuMjkyYy0wLjM1OC0wLjYxMi0wLjcwOS0xLjUyOC0wLjY2MS0yLjcxMSAgICAgYy02LjUyNSwzLjYwMy05LjgsNC42ODItMTEuNjg3LDQuMjI4Yy0xLjEyMi0wLjI2Mi0yLjA1LTAuOTQ2LTIuNjEtMS45MTdjLTAuNDk0LTAuODQ5LTAuNjA5LTEuODY3LTAuMzE1LTIuODA4ICAgICBjMC4wNDItMC4xMzQsMC4wOTEtMC4yNjcsMC4xNDgtMC4zOTVjLTEuMzk1LDAuMTM0LTIuMTY1LTAuMDQ4LTIuNzg3LTAuMTkzYy0xLjQxNi0wLjM0LTIuNTYyLTEuMTY1LTMuMjI5LTIuMzIzICAgICBjLTAuNzU4LTEuMzEtMS40NzQtMy40NzUtMC42MTYtNi4zOTdjMC4xNjctMC41NzYsMC40MDMtMS4xNzcsMC43MDEtMS43ODNjLTAuMzQzLTAuMjcyLTAuNjM3LTAuNjE4LTAuODY0LTEuMDE5ICAgICBjLTAuOTUyLTEuNjg3LTAuMzczLTMuODI3LDEuMzEtNC43OTdsOS42MTItNS41NTZjMC43MjgtMC42MDUsMS40ODktMS4yMywyLjI4My0xLjg2N2MtMC44NzksMC4yNjctMS43MDQsMC41MDMtMi40NzUsMC43MDMgICAgIGwtMTQuNTk3LDguNDI0Yy0wLjgxMywwLjQ3My0xLjc3NywwLjU5NC0yLjY4MSwwLjM1N2MtMC45MDYtMC4yNDgtMS42NzctMC44MzEtMi4xNDYtMS42NDkgICAgIGMtMC41ODgtMS4wMTMtMS4xNDktMi42OTgtMC40OTQtNC45MzdjMC4zOTQtMS4zNTMsMS4zMTktMi44NjIsMi43NTMtNC41M2MtMC4xODItMC4yMjQtMC4zMzYtMC40NDItMC40NzMtMC42NjEgICAgIGMtNC4zNTQsMS4zMTYtNy44MjksMS43MTctMTAuNDEzLDEuMTQxYy0yLjkwNS0wLjY0OC00LjQwMy0yLjMyMi01LjE1Mi0zLjYyYy0wLjQ5NC0wLjg2MS0wLjYwNi0xLjg4Ny0wLjMwNi0yLjgzMiAgICAgYzAuMy0wLjk1MiwwLjk4OC0xLjcyOSwxLjg4OS0yLjE0N2MwLjkxNi0wLjQyNCwxLjg0LTAuODQzLDIuNzktMS4yODVjLTUuNzI4LDEuMzQ2LTguMTM5LDAuODEzLTkuNjczLDAuNDYxICAgICBjLTIuOTc4LTAuNjY3LTQuNDc2LTIuMzIzLTUuMjEyLTMuNTljLTAuOTYxLTEuNjY4LTAuNDE1LTMuNzkxLDEuMjI4LTQuNzkxbDIxLjc1Ni0xMy4xOTZjLTIuNTk2LDEuMjEzLTQuODkxLDIuMjM3LTYuOTE3LDMuMDkzICAgICBjLTYuNTgsNC4zNzItMTAuMzUyLDYuOTA3LTEwLjUwOSw3LjAxMWMtMC44MTYsMC41MzktMS44MTYsMC43MjgtMi43NjksMC41MDljLTAuOTU1LTAuMjI1LTEuNzc0LTAuODMtMi4yNjItMS42NzQgICAgIGMtMC4yNDktMC40MzEtMC40OTEtMS4wMDYtMC42MDQtMS43MWMtMC4xMDMtMC4wMjQtMC4xOTctMC4wNDgtMC4yOTEtMC4wNjZjLTAuOTU1LTAuMjMtMS42NzctMC42MzEtMi4yMjMtMS4wNzkgICAgIGMtMS4wMjUtMC4wNTUtMS44OTItMC4xNzctMi42NDctMC4zNDZjLTMuNDE3LTAuNzUyLTUuMTI3LTIuNjM5LTUuOTY4LTQuMDgyYy0wLjY0Ni0xLjEyMi0xLjI2MS0zLjAwOC0wLjUwMy01LjU5OCAgICAgYzAuMDg1LTAuMzAzLDAuMTg1LTAuNjMsMC4zMTgtMS4wMTNjLTEuMzUtMC44NDMtMi4xODMtMS44OC0yLjY4OS0yLjc1OWMtMC42OTQtMS4yMDEtMS4zNTUtMy4xOTYtMC41Ny01Ljg5NSAgICAgYzAuMDE5LTAuMDY2LDAuMDQtMC4xMjcsMC4wNTgtMC4xODhsLTEwLjMzNyw1Ljk2OGMtMS42OCwwLjk3Ny0zLjgzMywwLjQtNC44MTUtMS4yNzNjLTAuOTc5LTEuNjgtMC40MjQtMy44MzMsMS4yNDMtNC44MjEgICAgIGwyLjg2My0xLjcwNGMtMC40MjItMC4yOTEtMC43NzMtMC42NjctMS4wMzctMS4xMjJjLTIuMjAyLTAuNzIyLTMuNDAyLTIuMTA0LTQuMDMzLTMuMTk2Yy0wLjI3Mi0wLjQ3OS0wLjU0Mi0xLjA0OS0wLjc1Mi0xLjcxNiAgICAgbC01LjcwNywzLjI5M2MtMC44MTMsMC40NjctMS43NzcsMC41OTUtMi42OCwwLjM1MmMtMC45MDctMC4yMzYtMS42NzctMC44MzEtMi4xNDctMS42NDljLTAuMTQzLTAuMjQyLTAuMjg1LTAuNTI3LTAuNDE2LTAuODM3ICAgICBjLTAuNzI1LDAuMTA0LTEuMzE5LDAuMDkxLTEuNzk1LTAuMDI0Yy0xLjE1Mi0wLjI3Mi0yLjA5OC0wLjk2NC0yLjY2OC0xLjk1MmMtMC40ODgtMC44NDMtMC42MTMtMS45NDctMC4zMjgtMi44NzUgICAgIGMwLjAwOS0wLjAzNiwwLjAyMS0wLjA2NiwwLjAzLTAuMDk3Yy0wLjU3Ni0wLjU0Ni0wLjk4OS0xLjEwOS0xLjI4LTEuNjE5Yy0wLjk3My0xLjY4LTAuNC0zLjg0NSwxLjI4Ni00LjgyMSAgICAgYzIuNDE3LTEuNDA3LDQuODY0LTIuODIsNy4zMjMtNC4yNTFjLTAuMTkxLTAuMDkxLTAuMzc2LTAuMjA2LTAuNTQ5LTAuMzM0Yy0yLjc5MiwwLjMxLTUuMTU4LDAuMjQ5LTcuMTAyLTAuMTgyICAgICBjLTMuODgxLTAuODQ5LTUuODE4LTIuOTcyLTYuNzU1LTQuNTkxYy0wLjk2MS0xLjY2OC0wLjQxNi0zLjc5LDEuMjIyLTQuNzkxbDEuMTczLTAuNzA5Yy0xLjQ3NCwwLjI3Mi0yLjY2MywwLjI5MS0zLjU4NywwLjA3OCAgICAgYy0xLjQ0OS0wLjMzOS0yLjYzMi0xLjE5NC0zLjMyMy0yLjM4M2MtMC4yMTgtMC4zODgtMC40MzktMC44OC0wLjU3My0xLjQ2MmMtMy40MzMsMS43MTctNS4zNDYsMi42NS01LjQ2NywyLjcxMSAgICAgYy0xLjcwNywwLjg1LTMuNzgxLDAuMTg4LTQuNjgyLTEuNDk4Yy0wLjg5Ny0xLjY3NC0wLjMwMy0zLjc2NiwxLjM1My00LjcxOGw5LjA2OS01LjIzOWMtNC40MywyLjA2Ny03LjM0NywyLjgwMi05LjE1NCwyLjQwMSAgICAgYy0xLjMwNC0wLjI5OC0yLjM3NC0xLjA2Mi0zLjAwOC0yLjE2NWMtMC45NjEtMS42NjItMC40MTYtMy43OSwxLjIyNS00Ljc4NWw4MC4wNTYtNDguNjA5YzQuNTIxLTMuMTI5LDkuMTA5LTYuMzEsMTMuNzE1LTkuNTA5ICAgICBjLTM0LjMwNiwyMC4yNDYtNjgsNDAuMjA5LTk4LjI3OSw1OC4yMjFjLTEuNjc0LDEtMy44MzksMC40NTUtNC44MzYtMS4yMjZjLTEuMDAxLTEuNjY3LTAuNDU1LTMuODM5LDEuMjEzLTQuODMzICAgICBjMTUuNzczLTkuNDY3LDM1LjcwNC0yMS40NDMsNTguMDUxLTM0Ljg3NmMtMTAuNzE5LDUuODk1LTIwLjM3MywxMS4yLTI4LjYyNCwxNS43M2MtMTAuNTkxLDUuODIyLTE5LjA3OCwxMC40ODUtMjMuNDI2LDEyLjkwNSAgICAgbC0zLjM1MSwxLjkyOWMtMS4yNDMsMC43MjgtMi43OTYsMC42MTgtMy45My0wLjI2N2MtMC45NzktMC43NTItMS40NzctMS45NTktMS4zNDktMy4xNjZjLTEuMjE5LDAtMi40MDUtMC42MzEtMy4wNTctMS43NjUgICAgIGMtMC41NDMtMC45MzQtMC42NzYtMi4wNjItMC4zNzYtMy4xNTljMC4xNjQtMC42MjUsMC4zNjctMS4zNTksMS43MTMtMi44MzJsLTMuMjE0LDEuODYxYy0xLjIyOCwwLjcwOS0yLjY5OSwwLjYwMS0zLjc4Ny0wLjE1OCAgICAgYy00LjAwMywxLjA2Mi03LjE0NCwxLjM0Ny05LjQwMywwLjgxM2MtMi42NDctMC42MjUtNC4wMDktMi4xNDctNC42ODItMy4zMTdjLTAuNzctMS4zMzQtMS41LTMuNTI5LTAuNjk3LTYuNDk1ICAgICBjLTEuNjYyLTAuODM3LTIuNjMyLTIuMDE0LTMuMTg5LTIuOTgzYy0wLjUwMy0wLjg4LTAuOTg5LTIuMzIzLTAuNDI4LTQuMjc1YzAuMjQ5LTAuODYxLDAuNTc2LTEuOTk1LDIuMDc3LTMuODk0ICAgICBjLTAuMDI3LTAuNDEyLDAuMDE4LTAuODMxLDAuMTMzLTEuMjMxYzAuMTc2LTAuNTg4LDAuMy0xLjAxMywxLjUxOS0xLjg4bC0wLjA0NS0wLjA3MmMwLjA2My0wLjA0MywwLjY1Mi0wLjQyMiwxLjcyNS0xLjExICAgICBjLTAuMTczLTAuMjA2LTAuMzI3LTAuNDE4LTAuNDU4LTAuNjUxYy0wLjk2MS0xLjY2NS0wLjQxNi0zLjc5MSwxLjIyOC00Ljc4NWwxLjExOS0wLjY3OWMtMi4zOCwwLjkxNi00LjQxOCwxLjYxOS02LjE2NywyLjE1OSAgICAgYy0xLjc0MywwLjk3Ni0yLjY5OCwxLjUxLTIuNzgzLDEuNTYxYy0xLjE2NywwLjY0OS0yLjUzNSwwLjU3My0zLjU5My0wLjA4MWMtMi40NzgsMC4zMDMtMy43MjEsMC4wMTItNC42MjQtMC4yICAgICBjLTIuMzU5LTAuNTU1LTMuNTU3LTEuODkzLTQuMTUxLTIuOTE0Yy0wLjQ3Ni0wLjgzMS0wLjYtMS44MTYtMC4zMzYtMi43MzVjMC4yNjQtMC45MTgsMC44ODktMS42OTUsMS43MjktMi4xNDQgICAgIGMwLjEwOS0wLjA1OCwyLjYxNy0xLjQwMSw2Ljk4LTMuNzYzYy0wLjI4OC0wLjAzMy0wLjUyMS0wLjA5NC0wLjc0OS0wLjE1MWMtMC4xMTItMC4wMjctMC4yMjEtMC4wNTgtMC4zMjUtMC4wOTQgICAgIGMtNS40NywyLjQzMi05LjI4NCwzLjMzLTExLjcxLDIuNzc0Yy0xLjUyOC0wLjM1Mi0yLjc3NC0xLjI0My0zLjUwOC0yLjUxMWMtMC41MjQtMC45MTItMC43MTItMS45NjgtMC41NDYtMy4wMjkgICAgIGMtMC40ODgtMC40MzEtMC44MzEtMC44OTUtMS4wNjQtMS4zMDdjLTAuOTEtMS41NjctMC40NzktMy41NjMsMC45ODgtNC42MjRsNi4wMTktNC4zNTdjLTAuNTkxLTAuMzI1LTEuMDgyLTAuODA0LTEuNDI4LTEuNDAxICAgICBjLTEuMzU4LTIuMzUzLTAuMjM3LTQuMzE4LDMuNzUxLTkuODc5Yy0yLjQ3MiwxLjUzMS00Ljg0MywzLjAyOS02LjQ0LDQuMDM2Yy02LjIzMSwzLjkzNi02LjIzNywzLjkzNi03Ljc5NiwzLjU0OCAgICAgYy0wLjkzNy0wLjIzLTEuNzQxLTAuODM0LTIuMjItMS42NjVjLTEuNDU1LTIuNTIzLTAuODEtNC42MzMsNi4yNC0xMC41MjVjLTAuNjI1LTEuMzE5LTAuMzczLTIuODk2LDAuNjQ5LTMuOTYgICAgIGMwLjYxOS0wLjYzNywxLjI0Ny0xLjI5MiwxLjg3MS0xLjk0NGMtMC4wMzctMC4wNjEtMC4wNy0wLjExMi0wLjEwNi0wLjE3Yy0wLjM5MS0wLjY4Mi0wLjc2MS0xLjMxNi0wLjYzLTIuMzA0ICAgICBjLTUuOTE2LDMuMTgxLTcuMzE0LDIuODY1LTguMTY5LDIuNjcxYy0xLjEwMS0wLjI0Ni0yLjAwNy0wLjkwNC0yLjU1OS0xLjg1NmMtMS40NjgtMi41NDEtMC40NjEtNS4wMTgsNC41ODQtOS45MjQgICAgIGMtMS4xMDQtMC4yNDYtMi4wMTYtMC45MDYtMi41NjUtMS44NjVjLTEuMzI1LTIuMjkyLTAuNDg1LTQuMjc1LDIuNzgtNy42NjhjLTAuNywwLjE0LTEuMzMxLDAuMTM3LTEuOTM4LDAuMDAzICAgICBjLTEuMTQ2LTAuMjQ1LTIuMDk1LTAuOTI4LTIuNjY4LTEuOTI1Yy0wLjY1NS0xLjEzMS0wLjYxOC0yLjQ5OSwwLjAyMS0zLjU3OGMtNS4wNjQsMi44NDEtNS43MDEsMi42NzctNi45MDEsMi4zNzQgICAgIGMtMC45MjgtMC4yMy0xLjc3NC0wLjg2Ny0yLjI1LTEuNjk1Yy0xLjY1NS0yLjg2OCwwLjgyOC01LjIwMyw0LjI2Ny04LjQzNmMwLjM4Mi0wLjM2NywwLjgwMy0wLjc1NSwxLjI0OS0xLjE2MSAgICAgYy0wLjQwOS0wLjMwOS0wLjc1NS0wLjY5Ny0xLjAxOS0xLjE0OWMtMC44NTgtMS40ODktMC41MjUtMy4zNzgsMC43OTQtNC40ODJjNC4wOS0zLjQxMSw4LjI5My02Ljk4NiwxMi4yNDQtMTAuNDE2ICAgICBjLTE0LjEzNiw5LjA1NC0xNC45MTUsOS4yOTctMTYuOTM1LDguODA5Yy0wLjkzNy0wLjIzLTEuODE2LTAuODc5LTIuMjk1LTEuNzE2Yy0xLjU4OS0yLjc0Ny0wLjU5Ny00LjcyNyw2LjQ3MS0xMC4yNDkgICAgIGMtMS43NzcsMC41NjEtMi40MzUsMC40MDMtMi44OTksMC4yOTRjLTEuMDczLTAuMjQ5LTEuOTU4LTAuODk3LTIuNDk1LTEuODI5Yy0xLjc3NC0zLjA3NywwLjU0Mi00Ljc5Nyw2LjE0LTguOTQxICAgICBjMi41MzUtMS44NzcsNS44NC00LjI1MSw5LjQ1Mi02LjgzMmMtMC45OTItMC4zLTEuODEtMC45NC0yLjMyMy0xLjgyM2MtMC45NTUtMS42NTgtMC40MTYtMy43ODEsMS4yMTYtNC43ODEgICAgIGMxOS40NzMtMTEuOTIzLDM5Ljg4Mi0yNS4zMjIsNTIuOTMzLTM0Ljk0Yy0xNC40ODIsOC40MjEtMzQuMjQzLDIwLjgxMy00My44NTIsMjYuODM4Yy0xMy41MTgsOC40ODQtMTMuNTIzLDguNDg3LTE1LjE1Miw4LjA4MSAgICAgYy0wLjkzNC0wLjIzLTEuNzM0LTAuODM0LTIuMjE3LTEuNjY1Yy0yLjExLTMuNjY2LDEuODAxLTcuMTc3LDYuNzM1LTExLjA1OWMyLjUzOC0xLjk5OCw1LjgxLTQuMzc1LDkuOTEyLTcuMjA1ICAgICBjLTAuNzA0LTAuMjk0LTEuMzAxLTAuODE4LTEuNjgzLTEuNDg1Yy0yLjAwMS0zLjQ2NiwwLjUyNS03LjA2NSwxMC4zNjEtMTQuNDYxYy0xLjY5NS0zLjE0MSwxLjIzNy01LjQsNi4wNTUtOS4xMTEgICAgIGMzLjEyMy0yLjQwOCw3LjI4My01LjQzNywxMS43MjItOC42NjNjLTAuMTIxLTAuMTEyLTAuMjM2LTAuMjMtMC4zMzktMC4zNThjLTEuMjM0LTEuNTEtMS4wMTMtMy43MzksMC41LTQuOTczICAgICBjMTIuNDc0LTEwLjE4OCwyMC43ODItMTUsMjQuNjk3LTE0LjI3NWMxLjM3NiwwLjI1MSwyLjUwNywxLjAzNCwzLjE4NCwyLjIwMWMxLjIwMSwyLjA4LDAuNDM5LDMuOTEyLTEuODA0LDYuMTczICAgICBjNC42MzMtMi43Miw5LjI5MS01LjQ1OCwxMy43NTQtOC4wODdjNy4yMjYtNC4zMTIsMTIuMDY4LTcuMTI4LDEyLjE2Mi03LjE4NmMxLjY4My0wLjk3NiwzLjgzOS0wLjQxMyw0LjgyNCwxLjI2OCAgICAgYzAuMzY0LDAuNjI1LDAuNTE5LDEuMzA3LDAuNDc5LDEuOThjMTQuNDA5LTcuODc4LDE1Ljk5OC03LjQ4LDE3LjM2NS03LjE0NGMxLjAzNCwwLjI1OCwxLjg5MiwwLjg5OCwyLjQxMSwxLjc5NSAgICAgYzIuMTEsMy42NjMtMS4wNDYsNS42OTEtMTIuNzkyLDEzLjI0NGMtNy40NTYsNC43OTEtMTcuOTQ4LDExLjI3MS0yOS4wNTgsMTguMTMzYy0wLjE4MiwwLjEwOS0wLjM1OCwwLjIyMS0wLjU0LDAuMzMxICAgICBjMC4zNTQtMC4wMTUsMC42NTgsMC4wMzMsMC45MzEsMC4xYzEuMDU1LDAuMjY0LDEuOTI4LDAuOTEzLDIuNDUzLDEuODI4YzIuMjksMy45NTctMS43NjUsOC4yNzgtMTAuMDM0LDE0Ljg2NCAgICAgYy00Ljk3MywzLjk2Ni0xMS44ODMsOC45NTEtMjAuNTYxLDE0Ljg0M2MwLjY2NCwyLjgyLTIuMzYyLDUuNjY0LTExLjMxOSwxMi40ODZjMC43MTIsMC4yOTQsMS4zMTYsMC44MjIsMS43MSwxLjQ5OCAgICAgYzEuNjkyLDIuOTMyLDAuMzYxLDUuNjE5LTYuOTExLDExLjU4M2MwLjE4MiwwLjAyNCwwLjM2MSwwLjA1OCwwLjU0LDAuMTAzYzEuMDIyLDAuMjQ2LDEuODcxLDAuODc2LDIuMzksMS43NzcgICAgIGMxLjIxOSwyLjExNywyLjEzNSwzLjY5My0xMi40MzIsMTYuODE2YzAuNDI3LDAuMjk0LDAuNzg1LDAuNjgyLDEuMDUyLDEuMTM3YzAuODYxLDEuNDk1LDAuNTE2LDMuMzkzLTAuODE1LDQuNDkxICAgICBjLTAuMTQsMC4xMTItMC4yNzYsMC4yMjctMC40MTYsMC4zNDJjMS4xMTktMC41MDMsMS41MTktMC40LDIuMjY1LTAuMjEyYzAuOTIyLDAuMjM2LDEuNzE5LDAuODQsMi4xOTUsMS42NjUgICAgIGMwLjg0OSwxLjQ3NCwxLjAwNywyLjQxNC0wLjYxOSw0LjUwOWMwLjM3Ni0wLjAyMSwwLjczNCwwLjAxNSwxLjA5OCwwLjA5MWMxLjA3LDAuMjMsMS45ODksMC44OTUsMi41MjksMS44MzIgICAgIGMxLjQ0MywyLjQ5OSwwLjM2NCw0Ljg3Ni0zLjYxNyw5YzAuOTU1LTAuNjU4LDEuODkyLTEuMzA3LDIuODA4LTEuOTUzYzAuODEzLTAuNTczLDEuODI4LTAuNzczLDIuNzkyLTAuNTYxICAgICBjMC45NjcsMC4yMTUsMS44MDQsMC44MjgsMi4yOTgsMS42ODNjMS43MDQsMi45NSwwLjQxNiw0LjM4MS04LjMxNywxMS43MWMxLjA1OC0wLjcyNSwyLjEwNy0xLjQ0MywzLjEzMi0yLjE1MyAgICAgYzEuNTIyLTEuMDU4LDMuNjAyLTAuNzU4LDQuNzY3LDAuNjg4YzEuMTYxLDEuNDQsMS4wMTMsMy41NDItMC4zNDksNC44MDNjLTIuNTIyLDIuMzQxLTUuMjE1LDQuOTQyLTcuNTg2LDcuMzM0ICAgICBjMC4yMzYsMC4yMjgsMC40MzksMC40ODgsMC42MDQsMC43NjdjMC4xNzMsMC4yOTcsMC4zMTUsMC41NjcsMC40MTgsMC44MzFjMS43MjItMS4wMzcsMy40NzItMi4wODksNS4xNzYtMy4xMjMgICAgIGMxLjYyNS0wLjk5MiwzLjc0OC0wLjUxMyw0Ljc5MSwxLjA4OGMxLjA0MywxLjU5NSwwLjYyNywzLjczMy0wLjkzNCw0LjgyNGMtMS4yMzQsMC44NjEtMi40ODksMS43NS0zLjc1MSwyLjY1ICAgICBjMC41MzEsMC4zMjIsMC45ODksMC43NzYsMS4yODksMS4yOTVjMS4zNzYsMi4zODYsMC4xNTgsNC43NzYtMy41MDUsOS45NjdjMy44MDItMi4zNTYsNy45NzgtNS4wMjQsMTEuMzg2LTcuMjAxICAgICBjMTguOTM5LTEyLjEwNCwyMC41MS0xMi44MjMsMjIuODA1LTEyLjI2MmMwLjkzNCwwLjIyNywxLjgzNywwLjg5NCwyLjMyMywxLjczNGMwLjc4OSwxLjM2OCwwLjU2NCwzLjA2OC0wLjQ4NSw0LjE4NCAgICAgYzE0LjM0NS04LjI4MSwzMS45NTctMTcuNjUsNTIuMDE0LTI4LjAxNGM1LjY5Ny0zLjcyNCwxMS40MDctNy40NzEsMTcuMDgtMTEuMTg5YzU3LjY1Ny0zNy44MjMsNzQuNTQzLTQ4LjI1Nyw4MC4wNDctNDcuMzA4ICAgICBjNC4yMzYtMS41NTUsNy40NTMtMi4xMjUsOS42MTgtMS42MjVjMi4xNzQsMC40OTcsMy4zMDUsMS43NzcsMy44NzIsMi43NTljMC41OTgsMS4wMzEsMC43MywyLjI1NiwwLjM3OSwzLjQ1MSAgICAgYy0wLjM1NywxLjIwMS0xLjM4NiwyLjU1LTMuMzYyLDQuMjI3YzAuMzk3LDAuODQ5LDAuNjg1LDIuMDk4LDAuMjI3LDMuN2MtMC40NywxLjY1NS0xLjIzNCw0LjMyNC0xMS4yMjgsMTIuMDcxbDU1Ljk3OC0zMi4zMTcgICAgIGM0OC42NjYtMzEuMTc0LDg1LjM1NS01NS40ODYsODUuODktNTUuODM4YzAuODEzLTAuNTM3LDEuODEzLTAuNzE5LDIuNzU5LTAuNDk0YzAuOTUyLDAuMjIyLDEuNzcxLDAuODMxLDIuMjU2LDEuNjcxICAgICBjMC4zMjgsMC41NzMsMC41MDQsMS4yMTMsMC41MjcsMS44NzFsOS4wNTUtNS4yMjFjMS42NjgtMC45NzEsMy44MTQtMC40MDksNC44MDMsMS4yNjFjMC45MDMsMS41MjUsMC41MjEsMy40NjMtMC44MTgsNC41NDggICAgIGMzLjE0MS0xLjMwNCw1LjcwNi0yLjI0NCw3LjgwNS0yLjkxMWMwLjc2NC0wLjQ4NSwxLjE4My0wLjc0OSwxLjIzNy0wLjc4NWMwLjgxMy0wLjUxMywxLjgwMS0wLjY3MywyLjczNC0wLjQzNyAgICAgYzAuMDk4LDAuMDIxLDAuMTc3LDAuMDQ4LDAuMjczLDAuMDc2YzMuMjUtMC42Nyw0LjY0Ni0wLjMzMSw1LjY2NC0wLjA4NWMyLjAyNSwwLjQ4NSwzLjA2OCwxLjY1OSwzLjU4NCwyLjU1MyAgICAgYzAuNDc5LDAuODMxLDAuNjAxLDEuODIyLDAuMzQsMi43NDRjLTAuMjY3LDAuOTI1LTAuODk3LDEuNjk4LTEuNzQ3LDIuMTQ2Yy0wLjEyNywwLjA2Ny0yLjE1MiwxLjEzNy01Ljc5NywzLjA3MiAgICAgYzAuMzUyLDAuMzA5LDAuNjQ4LDAuNjczLDAuODg1LDEuMDg1YzAuMjMsMC4zOTIsMC40NTUsMC44NTIsMC42MzcsMS4zOGMwLjYzMS0wLjQ0MywxLjI1Ni0wLjg3NiwxLjg2Mi0xLjMxICAgICBjMC44MTMtMC41NzMsMS44MjUtMC43ODIsMi44MDItMC41NjdjMC4zMTUsMC4wNzMsMC42MTgsMC4xODUsMC45MDMsMC4zMzZjNC44Ny0xLjkyOCw4LjI5LTIuNjE3LDEwLjQtMi4xMTYgICAgIGMxLjkwNCwwLjQ1MiwyLjkwNSwxLjU3NywzLjQwOCwyLjQ0N2MwLjQ5MSwwLjg0OSwwLjYwNiwxLjg4LDAuMzIxLDIuODE3Yy0wLjQ5MSwxLjU5Mi0wLjU2NCwxLjgyMi0xOC44NiwxMC43MDcgICAgIGMtMy4yNSwyLjc0MS03LjY1OSw1Ljg2Ny0xMy4xNzgsOS4zOTFjLTAuMDI0LDAuMDE5LTAuMDQ5LDAuMDM3LTAuMDYxLDAuMDUyYzE4LjczMi0xMC43MTYsMzAuMzE1LTE3LjMwMiwzMC42MTktMTcuNDggICAgIGMxLjY5MS0wLjk2MSwzLjg0NS0wLjM3Myw0LjgxNSwxLjMxNmMwLjk3LDEuNjg5LDAuMzg4LDMuODQyLTEuMjk4LDQuODE1bC0xNzEuNDgyLDk5LjAwNCAgICAgYy02LjEzMSwzLjk1NC0xMi4xMTYsNy43ODctMTcuOTc1LDExLjUxM0w0NDAuMjExLDgxLjYxM2MxLjY5Mi0wLjk3NiwzLjg1MS0wLjQsNC44MjcsMS4yOTJjMC4yMjUsMC4zODgsMC40NDksMC45MDYsMC41NDYsMS41NCAgICAgbDUuMzc5LTMuMTAyYzAuODEzLTAuNDcsMS43NzctMC41OTEsMi42ODEtMC4zNTVjMC45MDMsMC4yNDMsMS42OCwwLjgzNywyLjE0MSwxLjY0NmMxLjc3NywzLjA3OC0wLjczOSw0Ljc0Mi00LjkxOCw3LjQ5OSAgICAgYy0xLjYzOCwxLjA4NS0zLjgyLDIuNDkzLTYuNTIsNC4yMDZjMTQuOTc5LTcuOTM1LDE2LjE4LTcuNjI5LDE3LjQ3OC03LjI4NmMwLjkxNiwwLjI0LDEuODAxLDAuODk3LDIuMjc0LDEuNzE2ICAgICBjMC45NTgsMS42NjIsMC40MTIsMy43ODctMS4yMjYsNC43ODJsLTkuMDY1LDUuNTA2YzEuNjk4LDAuOTU4LDMuMDQ0LDIuMjkyLDQuMDIxLDMuOTgxYzAuNzMzLDEuMjY0LDEuNDI1LDMuMjc0LDAuOTQ2LDYuMDA2ICAgICBjMi44ODYtMS41MTksNC40ODEtMi4zNTksNC41OTEtMi40MTljMS43MS0wLjg5MiwzLjgwOC0wLjI1OCw0LjczNiwxLjQyOGMwLjEzOSwwLjI1MSwwLjI0OCwwLjUyMSwwLjMyNywwLjc5MiAgICAgYzIuMDY3LDAuNzIyLDMuMTg5LDIuMDI1LDMuNzc4LDMuMDUzYzAuOTY0LDEuNjU5LDAuNDE4LDMuNzg3LTEuMjIsNC43ODJsLTU5LjcwOSwzNi4yNTZjLTQuMywyLjg5Ni04Ljk4Nyw1Ljk4NS0xNC4xMTIsOS4yNzIgICAgIGMtMTkuNzU4LDEyLjY4NC00NC4yOTQsMjcuMzU0LTczLjI5NCw0My44MTJMMTI4LjQ1NywzMjQuNjg2YzEuNzU2LDAuMDg1LDMuODM2LTAuMTA0LDYuMjI1LTAuNTU4ICAgICBjNi41NDEtMy43MTIsMjUuNzEzLTE0LjU2Nyw1MS44MTEtMjkuNDk3YzIyLjQxNy0xNC4xNDgsNTMuODU3LTMyLjU1NCw5OC4wOTQtNTYuNjE0YzUuNDE2LTMuMTYzLDEwLjg1LTYuMzM3LDE2LjI4OS05LjUyNCAgICAgYzM4LjA0Mi0yMi4yNzQsNjcuODcyLTQwLjEwNiw5MS4yNjMtNTQuMzY3YzMzLjctMjIuNzY2LDYzLjcxMy00My42MzMsODQuODgzLTU4LjY2MWMwLjgwNy0wLjU3LDEuODI2LTAuNzc5LDIuODAyLTAuNTY3ICAgICBjMC45NzEsMC4yMDksMS44MDgsMC44MjIsMi4yOTksMS42ODNjMC41ODIsMS4wMDMsMC43MjIsMi4yMTYsMC40LDMuNDExYy0wLjM3NiwxLjM4LTAuOTQ2LDMuNDYtMTAuODI1LDEwLjk3NCAgICAgYzAuNzc2LDAuMjgyLDEuNDQzLDAuODMxLDEuODU1LDEuNTU5YzAuNDQ5LDAuNzc2LDAuNjAxLDEuNDg5LDAuNTM0LDIuMTYyYzAuNzI4LTAuMzY0LDEuNTU5LTAuNDY3LDIuMzU4LTAuMjg1ICAgICBjMC45NjUsMC4yMTgsMS43ODMsMC44MjUsMi4yOCwxLjY3N2MwLjkzNSwxLjYyMiwxLjgxMyw0LjMzOSwwLjY4LDguMDljLTAuMjMsMC43NDktMC41MzQsMS41MjUtMC45MjgsMi4zMjkgICAgIGMwLjAzLDAuMDA5LDAuMDU0LDAuMDE1LDAuMDc4LDAuMDIxYzIuMjgsMC41MDksMy43NTQsMS42MTMsNC42ODIsMi43MDVjMi45MDUsMC45NTgsNC40NTIsMi43MSw1LjI1Miw0LjA5NiAgICAgYzAuOTcxLDEuNjc3LDAuNDA2LDMuODE3LTEuMjU1LDQuODAzbC0zLjY0NSwyLjE2OGMwLjQwNiwwLjI4NSwwLjc2NCwwLjY2NCwxLjAzLDEuMTI4YzAuNTIxLDAuOTA0LDEuMDI1LDIuMzk4LDAuNDQ5LDQuMzc1ICAgICBjLTAuNDYxLDEuNTgzLTEuNzQsMy40MTctMy44OTQsNS41NTJjMC42ODYsMC4yNzYsMS4yOTIsMC43NjcsMS42OTgsMS40NDZjMC45NjQsMS41ODYsMC41MzMsMy42NTEtMC45ODgsNC43MjEgICAgIGMtMC4yLDAuMTQ2LTYuMzYyLDQuNDY2LTE2LjgwNSwxMS42OTJjOS45ODEtNS4yMjUsMTUuODUzLTguMjYsMTYuMDY0LTguMzY2YzEuNjU1LTAuODU1LDMuNjc1LTAuMjgyLDQuNjQsMS4zMDQgICAgIGMwLjk1OCwxLjU4OSwwLjUyNywzLjY1LTAuOTg5LDQuNzIxYy0wLjEwMywwLjA3My0xLjc1OSwxLjIzNy00Ljc0MiwzLjMxN2MwLjgyNSwwLjI1MiwxLjU1MywwLjgwMSwyLjAyLDEuNTk4ICAgICBjMC45NTgsMS42MjgsMC40NTUsMy43MjktMS4xMjgsNC43NTFjLTAuMTIxLDAuMDc2LTIuMTIyLDEuMzcxLTUuNzEzLDMuNjcyYzAuNTUzLDAuNDg4LDAuOTQsMS4wMTYsMS4yMDcsMS40NzcgICAgIGMwLjk1OCwxLjY2NSwwLjQxMiwzLjc5My0xLjIyNSw0Ljc4OGwtMjUuMzEzLDE1LjM1NWMyLjM2NC0xLjAyOCw0LjU5Ny0xLjkzNSw2LjY4My0yLjcwOGM3LjI0Ny00Ljk3MywxMS40NDMtNy44NzUsMTEuNjAxLTcuOTkgICAgIGMwLjgxOS0wLjU2NywxLjgzMi0wLjc2MSwyLjc5Ni0wLjU0NmMwLjk1OCwwLjIxNSwxLjc4OSwwLjgyNSwyLjI4LDEuNjhjMC44MTgsMS40MTMsMC44MTgsMi42MDItMC4xMjcsMy45NDIgICAgIGMyLjU3MSwwLjY2NywzLjkxMSwyLjE4LDQuNTkxLDMuMzQxYzAuOTU4LDEuNjY1LDEuODQzLDQuNDYzLDAuNjE4LDguMzIzYy0yLjA1Niw2LjQ4Ni0xMC4wMTIsMTQuOTU1LTI0LjEzLDI1LjYzNyAgICAgYy0wLjAyNCwwLjUwMy0wLjEwOSwxLjA0Ni0wLjI4NSwxLjYyNWMtMC41NzYsMS45ODktMi4yOCw0LjMtNS4wNDYsNi45NDNjMC4wNDksMC4wNzMsMC4wOTEsMC4xNCwwLjEzNCwwLjIxOSAgICAgYzAuNDM3LDAuNzU4LDAuODY3LDIuMDA4LDAuNDA2LDMuNjY5Yy0wLjQ2NywxLjY4LTEuMjM3LDQuNDU3LTE1LjMzNywxNC43MThjMC41MSwxLjAzMSwwLjYxMiwyLjIzMiwwLjI1NSwzLjQxNSAgICAgYy0wLjg2NywyLjk2NS01Ljc3OSw3LjAwNC0xNi4xMTksMTMuMjMyYzAuNDM3LDAuMjkxLDAuODE4LDAuNjkxLDEuMDg1LDEuMTY0YzAuODAxLDEuMzgzLDEuNTQ3LDMuNjg4LDAuNTY0LDYuODY1ICAgICBjLTEuMDc5LDMuNTE3LTMuODAzLDEyLjMyOS00NS4yNzYsMzguNTA5YzAuMzE1LDEuNDA2LTAuMjYxLDIuOTA0LTEuNTI4LDMuNzI5bC0yMy4xOTYsMTQuOTg1ICAgICBjMC4yMywwLjAxOCwwLjQ2NywwLjA1NCwwLjcxLDAuMTE1YzAuODk3LDAuMjQ4LDEuNjc0LDAuODQzLDIuMTQ2LDEuNjQ4YzAuNTU4LDAuOTc3LDEuMDkyLDIuNTksMC40MzcsNC43NDMgICAgIGMtMC41MjEsMS43NDYtMS41NzcsNS4yMjEtMTQuMTczLDE0LjNjLTEuMzg5LDIuMjEzLTUuMjIxLDYuMTE5LTE3LjM5MywxNC4yMzhjLTAuMzMzLDEuMTUyLTEuMDYxLDIuODMzLTYuNDcxLDcuMTAyICAgICBjMS4wMzcsMy4xOTYtMi43MTcsNS43MzctNy43NTYsOS4xMzNjLTMuOTk2LDIuNzExLTkuNTI3LDYuMTg3LTE1LjQxNiw5Ljg4NmMwLjQ5OCwwLjMyMSwwLjkyMiwwLjc1OCwxLjIzMSwxLjI5MSAgICAgYzAuOTAzLDEuNTc3LDAuNDY3LDMuNTkxLTEuMDE5LDQuNjQ2bC0yMy42NywxNi44MTZjMC4wMywxLjUyMi0wLjgyNCwzLjg5NC0zLjMyMyw5LjI3MmMwLjc0NiwxLjY0NCwwLjE0LDMuNjE0LTEuNDQ5LDQuNTMgICAgIGMtMC4yNDksMC4xNC0wLjUwOSwwLjI0OS0wLjc3MSwwLjMzNGMtMC4wNDIsMC4wMy0wLjA4NCwwLjA2MS0wLjEyMSwwLjA5MUMyNjIuMjY1LDQ2MS4xNywyNjEuMzczLDQ2MS44NjEsMjYwLjEwOCw0NjEuODYxeiAgICAgIE0yMTguOTkyLDQwOC43OTJjLTMuNTQ1LDMuMTQ3LTUuODQ2LDUuODg5LTYuNjA3LDguMTAzYzQuNzc2LTAuODk3LDIxLjU2NS03LjQxMSw4MC4yNjItNDIuODIgICAgIGMzMS4yNjgtMjAuNTk1LDU2LjI4My0zNi42MjksNzMuNDUyLTQ1LjY5NWM5LjI5Ni01LjkxOSwxNy43NzQtMTEuMzU4LDI0LjkyNS0xNS45NzRjLTExLjE1Myw1LjkxMy0yNC43NDMsMTIuOTQxLTQxLjEyMywyMS4zNjQgICAgIGMtMC4xNTEsMC4wNzktMC4zMSwwLjE1Mi0wLjQ2MSwwLjIzNmMtNi44ODksNC4wNzYtMTQuMjU3LDguNDA2LTIyLjE0MSwxMy4wMTVDMjgyLjQ3MSwzNzMuMiwyMzcuNTM0LDM5OC40MjgsMjE4Ljk5Miw0MDguNzkyeiAgICAgIE0yNjEuNTgyLDM2Ni40MmMtNy4wNTMsMy44NDYtMTMuNzIxLDcuNTU3LTE5Ljg0MywxMS4wNjJjLTcuMjQ3LDQuMTYtMTMuMTQ1LDcuNzIxLTE3Ljk0NywxMC43NTlMMjYxLjU4MiwzNjYuNDJ6ICAgICAgTTMwMC4yNTIsMzEyLjYxMUwxODUuNjA3LDM4Mi4xN2MxLjMxOS0wLjMxNSwyLjg3Mi0wLjc0LDQuNzA2LTEuMzM0YzIuMDU5LTEuODQ0LDUuNjQ2LTQuMjA5LDExLjE5NS03Ljc5MyAgICAgYzcuMjktNC43MTIsMTcuODY5LTExLjI2OCwzMi4zNTEtMjAuMDQ5YzE2LjA1Mi05LjcyOCwzNS41MTktMjEuMzQ3LDU2LjA4OS0zMy41NjYgICAgIEMyOTMuNDA0LDMxNy4xMzUsMjk2Ljg1NSwzMTQuODYxLDMwMC4yNTIsMzEyLjYxMXogTTE2Ny4zODQsMzY2LjI0NGMwLjIsMC4yMjUsMC41NywwLjQwNiwxLjA5OCwwLjU0ICAgICBjMC4yLTAuNTUyLDAuNS0xLjIyNSwxLjAwOS0yLjA1NmMtMC41NzMsMC4wNDMtMS4wOTEsMC4wNjYtMS41NywwLjA0OUMxNjcuNTIzLDM2NS40OTksMTY3LjQwOCwzNjUuOTcyLDE2Ny4zODQsMzY2LjI0NHogICAgICBNMTgxLjQ1NywzNjIuMDQ4Yy0wLjg2NywwLjc3Ni0xLjYxNiwxLjQ3NC0yLjI2NSwyLjExNmMwLjc3My0wLjY4NSwxLjYzOC0xLjQyNSwyLjYxMS0yLjIyNiAgICAgQzE4MS42ODcsMzYxLjk3NiwxODEuNTcyLDM2Mi4wMTgsMTgxLjQ1NywzNjIuMDQ4eiBNMTgwLjAzOCwzNDEuMzQ0Yy0xNS4wNDMsMTAuOTM1LTE1LjcyOCwxNC42MjItMTUuNjAxLDE1LjQ2NSAgICAgYzAuMDcsMC4xMDksMC4yLDAuMjA2LDAuMzYxLDAuMzAzYzQuMDQyLTQuNjU3LDEyLjI4OS0xMi4wMDcsMjkuNjkxLTI0LjExMUwxODAuMDM4LDM0MS4zNDR6IE00MjguNDM0LDIwNS43NyAgICAgYy0yOS4zMiwxNS42NjQtNjcuMzg3LDM2LjI4LTEwNS4xODYsNTcuNTU3Yy00NS44NTksMjUuODEtODIuMzQ5LDQ3LjUyNi0xMDguNDYyLDY0LjUzNyAgICAgYy0yMC45NjEsMTMuNjU3LTMyLjY4MSwyMi42NTYtMzkuMjIxLDI4LjUwMmMwLjc3OS0wLjIxMiwxLjYxLTAuNDQ4LDIuNDktMC43MTVjMTQuNzEyLTEyLjY5OSw1Mi4yOTktMzguNCwxNTAuNDk5LTkyLjk3MyAgICAgYzI4LjIxOC0xNS42NzQsNTYuNDIzLTMwLjk1Myw4MC43NzctNDMuOTc2QzQxNi4wNDUsMjE0LjE4MSw0MjIuNDQyLDIwOS44NDgsNDI4LjQzNCwyMDUuNzd6IE0zNDEuMTU1LDI2My43NjkgICAgIGMtMy43NjYsMi4wODctNy41NDQsNC4xNzktMTEuMzE1LDYuMjc3Yy00NC45MzIsMjUuMDAzLTgwLjgzMiw0Ni4wMDQtMTA2LjcwOSw2Mi40MjZjLTcuMTMyLDQuNTMtMTMuMjAyLDguNTIxLTE4LjM4MSwxMi4wNSAgICAgYzEuODM0LTAuODkxLDMuNzM1LTEuODM3LDUuNzMzLTIuODQ0YzIyLjY0Ny0xNC42OTMsNTkuMDI3LTM2LjU5OSwxMTcuNjctNjkuNjAxYzAuMjk4LTAuMTcsMC41ODMtMC4zNCwwLjg4Ni0wLjUxICAgICBjMS44NzQtMS4yLDMuNzcxLTIuNDEzLDUuNjg4LTMuNjVDMzM2Ljg4LDI2Ni41NCwzMzkuMDIxLDI2NS4xNTcsMzQxLjE1NSwyNjMuNzY5eiBNMTQ3LjgwOSwzNDIuMzQ1ICAgICBjLTAuMDIxLDAuMDYxLTAuMDQzLDAuMTIxLTAuMDU4LDAuMTgzYy0wLjE2NywwLjU1OC0wLjIwMywwLjk3LTAuMTc5LDEuMjczYzAuODA0LTAuODk4LDEuOTE0LTEuOTc4LDMuNDY5LTMuMzE3ICAgICBMMTQ3LjgwOSwzNDIuMzQ1eiBNMzQzLjY3MiwyNzEuNDY1Yy04LjQ1OSw1LjE5LTE3LjI5NSwxMC42NjEtMjYuNTAxLDE2LjQxNmMtMjMuMTk2LDE0LjUxMi00Ni4xOCwyOS4yMjUtNjYuNTgzLDQyLjQzOCAgICAgYzE0Ljk1Mi04LjYsMzIuNzU2LTE5LjA5Nyw1My45ODgtMzEuOTExYzEwLjI5MS02LjQyOCwyMS4zMzUtMTMuNDQ0LDMzLjE5Ni0yMS4wODZjOS4yNTQtNS45NjEsMTguNDQxLTExLjk0NiwyNy40MzYtMTcuODU0ICAgICBDMzU4LjExNywyNjMuNDA1LDM1MC45MDcsMjY3LjQyLDM0My42NzIsMjcxLjQ2NXogTTIxMC41MjksMzEwLjgwNGMtOS43MzYsNi42NTMtMTkuMDA5LDEzLjA0NS0yNy42MiwxOS4wMTkgICAgIGM0LjkzMy0yLjg0NSwxMC41NTItNi4yMSwxNi45NTMtMTAuMmMxMC44MzEtNi43NjIsMjIuNjYzLTE0LjQ5NCwzNS4yMzQtMjIuOTA1ICAgICBDMjI2LjE1NywzMDEuOTU2LDIxNy45OTEsMzA2LjYzMiwyMTAuNTI5LDMxMC44MDR6IE0yOTMuNjExLDMyNS40NzRjLTEuNTY0LDEuMDM3LTMuMTExLDIuMDU2LTQuNjU4LDMuMDgxICAgICBjNC44MDQtMi45MjMsOS43NC01Ljk2MSwxNC44MjEtOS4xMTVDMzAwLjM2NywzMjEuNDU5LDI5Ni45NzcsMzIzLjQ3MywyOTMuNjExLDMyNS40NzR6IE0zMjYuNTc3LDMxOC4yNTcgICAgIGMtNC40MjEsMy4wNzUtOC43NDUsNi4wNzctMTIuOTcyLDkuMDA2YzQ4LjM4OC0yNC45NjEsOTYuNzYzLTUxLjY1NiwxMjcuMDkxLTcyLjYyMWMyLjU4My0xLjg1Myw1LjExOC0zLjY4Nyw3LjYxLTUuNDk1ICAgICBjMC4xNjQtMC4xMTIsMC4zMzQtMC4yMTIsMC41MDQtMC4zYzQuMTk2LTMuMTExLDcuOTA4LTYuMDY3LDExLjA2Mi04LjgzM2MtMi40NDQsMS40ODktNS42NTgsMy40MTEtOS43MzksNS44MzEgICAgIGMtMTAuMDU1LDUuOTQzLTI0LjM1NSwxNC4yODQtNDAuOTIzLDIzLjkzOUMzODcuMTcyLDI4Mi42MzUsMzU2Ljk4OSwzMDAuMjM0LDMyNi41NzcsMzE4LjI1N3ogTTM5MS4wNTMsMzIwLjc4NiAgICAgYzEuMTEsMC41NzYsMS43NzcsMS4zOTUsMi4xNTksMi4wNjJjMC4wMTMsMC4wMDYsMC4wMTMsMC4wMTksMC4wMTksMC4wM2M3LjM2OC01LjM5MSwxMy4wMDgtMTAuMTcsMTYuNDM1LTE0LjExNyAgICAgQzQwNS4wMTQsMzExLjc4LDM5OC42NTIsMzE1LjkwNCwzOTEuMDUzLDMyMC43ODZ6IE0zNzMuMTA4LDMxMC4xOTFjLTQuNDU3LDMuMDE0LTguOTkzLDYuMDU5LTEzLjYwMyw5LjEzM2wxNy4yMTctOS45MzkgICAgIGMxMS4xNDEtNi43ODYsMjAuNDEzLTEyLjU4MywyOC4xMzMtMTcuNTJMMzczLjEwOCwzMTAuMTkxeiBNMTIyLjQ3NSwzMTIuNzUxYy0wLjM5NywwLjQxOC0wLjczNCwwLjc5NC0xLjAyNSwxLjE0ICAgICBjNC4wODctMS4zMjIsMTMuMDE3LTUuNDIxLDMyLjUyOS0xNy4wOTZDMTQxLjE3NCwzMDMuMzMzLDEzMC40MDMsMzA4Ljc2NywxMjIuNDc1LDMxMi43NTF6IE0yMzguNzg2LDI4MS40NDYgICAgIGMtMC45OTUsMC42NDQtMS45OTIsMS4yOTItMi45NjksMS45MjlsNy4zOTMtNC4yN0MyNDEuNzI4LDI3OS44ODgsMjQwLjI1LDI4MC42NjQsMjM4Ljc4NiwyODEuNDQ2eiBNNzQuODg0LDI3OC4zMDUgICAgIGMwLjU5NywwLjMyMiwyLjA0NywwLjU3LDUuNTI4LTAuMzA5Yy0wLjAxMi0wLjY2MSwwLjAzMy0xLjMzNCwwLjEzNi0yLjAzOGMtMC4yNjctMC4wODUtMC41MjEtMC4xODItMC43NjctMC4yODUgICAgIGMtMS42NDYsMC4zODMtMy4xNjMsMC42MzEtNC41NDIsMC43NTljLTAuMTE1LDAuMjYxLTAuMjA3LDAuNTE2LTAuMjc2LDAuNzUyQzc0Ljc2NiwyNzcuODM4LDc0LjgyNCwyNzguMTUzLDc0Ljg4NCwyNzguMzA1eiAgICAgIE0zMDMuMjA1LDI1OC42MDhjLTIuNDg2LDEuNzIyLTQuOTQyLDMuNDItNy4zNzUsNS4xMTJsMTcuMTMzLTEwLjE5MUMzMDkuNzM2LDI1NS4yMTUsMzA2LjQ3OSwyNTYuOTA3LDMwMy4yMDUsMjU4LjYwOHogICAgICBNMTIxLjc4NiwyNDkuMDA4Yy04LjEwMiw0LjE2My0xNS4zOTcsNy45NjUtMjEuNDgzLDExLjIzNEMxMDYuMjY4LDI1Ny4zNjUsMTEzLjM2LDI1My42ODEsMTIxLjc4NiwyNDkuMDA4eiBNNDQ2Ljg3LDIzOS41NjMgICAgIGMtNi4zOTMsMy4xMi0xNS41NTYsOC4yMi0yOC42NzksMTYuNDc3Yy0yLjA1LDEuMjkyLTQuMTU0LDIuNjI2LTYuMjg5LDMuOTk5QzQyNS40OTksMjUyLjExMyw0MzcuODU4LDI0NC44OTYsNDQ2Ljg3LDIzOS41NjN6ICAgICAgTTEzMC43NTUsMjM2LjM0OWMtMC4zMzYsMC4yMjUtMC42NjQsMC40NDktMC45OTUsMC42NzZjMTAuNTM3LTUuMzYxLDIzLjA3Mi0xMS42ODYsMzcuOTY2LTE5LjE3NSAgICAgYzkuNjYxLTQuODU3LDE5Ljc5MS05Ljk1MiwzMC4yMS0xNS4yMTNjMy42MDUtMi4zMTksNy4yMzUtNC42NiwxMC44ODktNy4wMjhDMTgwLjM4NiwyMTAuNjYzLDE1My4zMDYsMjI0LjcwOCwxMzAuNzU1LDIzNi4zNDl6ICAgICAgTTQ2MC42LDIyNy44OTVjMC43NTIsMCwxLjQzOCwwLjA3LDIuMDU2LDAuMjA5YzIuNTE3LDAuNTYxLDMuODI2LDIuMDI4LDQuNDgxLDMuMTU5YzAuMjA2LDAuMzczLDAuMzU3LDAuNzIyLDAuNDYxLDEuMDU5ICAgICBjMi4wMjUtMi40NDEsMy4zOTYtNC42NTQsNC4wMTUtNi41OTVjMC41NDYtMS43MDQsMC4xMjctMi40MTktMC4wMTItMi42NTNjLTAuNDg1LTAuMzM0LTIuNDc1LTAuOTc3LTkuNjY3LDEuNDgyICAgICBjLTAuMjg1LDAuMTg1LTAuNTc2LDAuMzc2LTAuODY3LDAuNTY0Yy0xLjY4LDEuMDc3LTMuNTI5LDIuMjU2LTUuNTczLDMuNTQ0QzQ1Ny40MzQsMjI4LjE1Niw0NTkuMTQ0LDIyNy44OTUsNDYwLjYsMjI3Ljg5NXogICAgICBNNDQ1LjI1NywxMDQuMjQ5TDI0NC43MzIsMjI2LjAxMmMxNC4xNTctOC4wOTksMjkuODY3LTE2Ljk2OCw0Ny4yNi0yNi42NzFjMjguMjIzLTE1LjczNCw1Ni40NjUtMzEuMTc0LDgxLjY0NS00NC43OTcgICAgIGMzMy41NjYtMjAuOTc0LDU5LjQwNi0zNS43MTksNzYuMTMyLTQyLjMyM2MwLjkxNi0xLjM3NiwxLjU1My0yLjY0MSwxLjg5OC0zLjc5YzAuMjU0LTAuODQzLDAuMjcyLTEuNDY1LDAuMDQ4LTEuODU5ICAgICBjLTAuMzc2LTAuNjQtMS4xMDktMS41NDktMy4xNTktMi4wMUM0NDcuNTc5LDEwNC4zNDMsNDQ2LjQ3LDEwNC4yNCw0NDUuMjU3LDEwNC4yNDl6IE0yMDEuMzY2LDIwOC44MDEgICAgIGMtOC4zNzIsNS4zODItMTYuNDMxLDEwLjUxMy0yNC4xNTEsMTUuMzYxbDEyLjYyMy03LjI4N2M1LjM0Ni0zLjQyMywxMC43ODMtNi45MjIsMTYuMjc0LTEwLjQ3OSAgICAgQzIwNC41MzQsMjA3LjE5NCwyMDIuOTQ1LDIwOC4wMDEsMjAxLjM2NiwyMDguODAxeiBNMzE2LjkyMiwxOTkuMzI5Yy04LjIzNCw1LjM5Ny0xNi41NTUsMTAuODctMjQuODg4LDE2LjM3MSAgICAgYzEwLjE0LTUuNjE2LDIwLjE0LTExLjIyMiwyOS45MjItMTYuNzhsODMuMjU4LTUwLjU1OUwzMTYuOTIyLDE5OS4zMjl6IE0xMzcuMDA1LDE5NS43OTNjLTAuMjczLDAuMTgyLTAuNTQ5LDAuMzczLTAuODIyLDAuNTU4ICAgICBjMC41MDYtMC4zMDcsMS4wMjUtMC42MTYsMS41MzQtMC45MjJDMTM3LjQ4LDE5NS41NTEsMTM3LjIzOCwxOTUuNjcyLDEzNy4wMDUsMTk1Ljc5M3ogTTIyOS40MzgsMTY5LjkyMyAgICAgYy0xLjcyOCwwLjk3LTMuNDQ3LDEuOTQzLTUuMTUxLDIuOTA1YzEuMDQtMC41NjQsMi4wNzQtMS4xMjIsMy4xMi0xLjY4NkMyMjguMDg1LDE3MC43MzIsMjI4Ljc1MiwxNzAuMzMyLDIyOS40MzgsMTY5LjkyM3ogICAgICBNMjcyLjcwNywxNjIuMDEyYy01LjQwMywzLjU4NC0xMC43MjIsNy4xMTMtMTUuOTY0LDEwLjU4M2MxLjU0OS0wLjgwNywzLjEwMi0xLjYxLDQuNjQyLTIuNDIgICAgIGM1LjIyMi0zLjQ0NCwxMC40NDMtNi44OTIsMTUuNjQxLTEwLjMzMWMtMC40MTksMC4yMTUtMC44NSwwLjQzMS0xLjI3NCwwLjY0M0MyNzQuNzM4LDE2MC45OTMsMjczLjcyLDE2MS41LDI3Mi43MDcsMTYyLjAxMnogICAgICBNMjM1Ljk3NSwxMzEuODU2Yy01LjA5NywyLjcwOC0xMS42ODYsNi40ODktMjAuMTkxLDExLjc0MWMtMC4zNTgsMC4yMjUtMC43MTgsMC40NDYtMS4wNzksMC42NyAgICAgYzYuMDY3LTMuMTYzLDExLjc3NC02LjE4LDE2LjgyMi04LjkzNkMyMzMuMzA0LDEzNC4wMjEsMjM0Ljc2OSwxMzIuODczLDIzNS45NzUsMTMxLjg1NnogTTQxMy4wMTksNzIuODY5ICAgICBjLTAuNDg1LDAuNDg4LTAuOTk1LDEtMS41NDcsMS41MzFjMC43NzEtMC40MTMsMS41MTctMC44MTMsMi4yNDQtMS4xOThjMC4wMTktMC4wNjEsMC4wMzYtMC4xMTgsMC4wNTUtMC4xNzkgICAgIGMwLjA0OC0wLjE1OCwwLjA4NS0wLjMwNCwwLjExNS0wLjQ0M0M0MTMuNjE5LDcyLjY2Miw0MTMuMzIxLDcyLjc1Niw0MTMuMDE5LDcyLjg2OXoiIHN0eWxlPSJmaWxsOiNENzFBNjA7Ii8+PC9nPjwvZz48L2c+PGcgaWQ9IkxheWVyXzEiLz48L3N2Zz4='
        var convertData = function(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            return res;
        };

        var color = ['#a6c84c', '#ffa022', '#46bee9'];
        var series = [];
        [
            ['北京', BJData],
            ['上海', SHData],
            ['广州', GZData]
        ].forEach(function(item, i) {
            series.push({
                name: item[0] + ' Top10',
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            }, {
                name: item[0] + ' Top10',
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: planePath,
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            }, {
                name: item[0] + ' Top10',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: function(val) {
                    return val[2] / 8;
                },
                itemStyle: {
                    normal: {
                        color: color[i]
                    }
                },
                data: item[1].map(function(dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            });
        });

        var option = {
            backgroundColor: '#404a59',
            title: {
                text: '模拟迁徙',
                subtext: '数据纯属虚构',
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data: ['北京 Top10', '上海 Top10', '广州 Top10'],
                textStyle: {
                    color: '#fff'
                },
                selectedMode: 'single'
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: series
        };
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);
      },
      displayTime(timeStr){
          return moment(timeStr).format("YYYY-MM-DD HH:mm:ss");
      }
    }

};
</script>

<style scoped>
html {
    height: 100%;
}

body {
    display: flex;
    /*align-items: center;*/
    justify-content: center;
    /*height: 100%;*/
    background-color: #fafafa;
}

#app {
    color: #2c3e50;
    font-family: Source Sans Pro, Helvetica, sans-serif;
    text-align: center;
}

#main {
    width: 400px;
    height: 400px;
}

.layout {
    position: relative;
}

.layout-menu-left .row{
    margin-top:10px;
    margin-left: 1px;
    box-shadow:0 0 2px rgba(0,0,0,0.3);
}

.layout-menu-left .row .title{
    font-size: 22px;
    border-bottom: 1px solid #CFD8DC;
    padding:2px;
    color:#03a9f4;
}
.layout-menu-left .row .title .content{
    margin-left: 20px;
}
.layout-menu-left .row > .content{
    margin:16px;
    font-size: 14px;
}
.layout-menu-left .row > .content li{
    width: 50%;
    display: inline-block;
}
.layout-menu-left .row > .content li:hover{
    cursor: pointer;
}
.layout-menu-left .row > .content li:hover a{
    color:#01579b;
}
.links .content a{
   padding-right: 10px;
}
.main-content{
    position: relative;
    left: -1px;
    top: 10px;
}
.main-content .category-title{
    display: flex;
    padding: 20px 20px 20px 0;
    font-size: 20px;
    line-height: 20px;
    border-bottom: 1px solid #cacaca;
    margin-bottom: 10px;
}
.main-content .category-title .category{
   padding-left: 10px;
}
.main-content .post{
   box-shadow: 0 0 1px rgba(0,0,0,0.3);
}
.main-content .post .left{
   display: flex;
   margin-left: 16px;
   margin-right: 16px;
}
.main-content .post .title{
   padding-top:9px;
   font-weight: 700;
   transition: color .3s,background-color .3s;
}
.main-content .post .title a{
   color:rgba(0,0,0,0.7);
}
.main-content .post .meta{
   margin-top: 16px;
   padding-bottom: 10px;
   line-height: 18px;
   font-size: 12px;
   border-bottom: 1px solid rgba(0,0,0,0.3);
}
.main-content .post .meta a{
   padding-right: 10px;
}
.main-content .post .description{
   padding: 16px 0;
}
</style>
