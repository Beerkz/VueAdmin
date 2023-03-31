<template>
  <div class="dashboard-container" style="margin-top: -30px;  background-image: url('img.png') ">
<!--    <div style="height: 200px">-->
<!--      <img :src="require('./img_1.png')" />-->
<!--    </div>-->
    <div style="margin-top: -30px;  background-image: url('img.png') ">
      <el-carousel :interval="4000" arrow="always" height="250px">
        <el-carousel-item v-for="item in data.items" :key="item.url">
          <img :src="item.url" class="bannerimg">
          <!--        <h3 class="medium">{{ item }}</h3>-->
        </el-carousel-item>
      </el-carousel>
    </div>
    <div style="margin-top: 20px;background-image: url('./img.png');">
      <Message></Message>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Message from './gg'
export default {
  name: 'Dashboard',
  components:{
    Message
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    data() {
      return {

        items: [
          { url: require('./static/1.jpg') },
          { url: require('./static/2.jpg') },
          { url: require('./static/3.jpg') },
          { url: require('./static/4.jpg') },
          { url: require('./static/1.jpg') }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.el-carousel-item img{
  width: 100%;
  height: 100%;
}
.bannerimg{
  width: 100%;
  height: inherit;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
<style lang="scss" scoped>
body{
  background-image: url("img.png");
}
</style>
