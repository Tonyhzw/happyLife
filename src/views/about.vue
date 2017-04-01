<template>
<div id="app">
  <div class="layout">
    <h2 class="title">博客更新日志：</h2>
    <h3>V1.0 正式版 <small>（2017年04月01日)</small></h3>
    <ul>
        <li>基本博客功能：游客浏览、管理员发布博客、支持markdown语法.</li>
    </ul>
  </div>
</div>
</template>
<script>
export default {
    data(){
      return {
      }
    }
}
</script>

<style scoped>
.title{
  margin: 15px 0;
  font-size: 16px;
  color: #666;
}
h3{
  position: relative;
  margin: 25px 0 10px;
  padding: 10px 50px 10px 0;
  font-size: 14px;
  border-top: 2px solid #e5e5e5;
  background: #f1f1f1;
}
h3 small{
  font-size: x-small;
  font-weight: normal;
}
ul{
  margin: 25px;
}
li{
  margin-left: 15px;
  list-style: square;
  line-height: 180%;
}
.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}
</style>
