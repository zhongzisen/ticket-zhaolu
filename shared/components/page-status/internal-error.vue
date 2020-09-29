<template>
  <div class="container">
    <img src="../../assets/images/500.png" class="img">
    <div class="promptContent">
      <div class="errorCode">
        500
      </div>
      <div class="promptInformation">
        抱歉，服务器出错了
      </div>
      <q-button type="primary" class="backHomepage" @click="handleClick">
        返回首页
      </q-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleClick() {
      this.$router.replace('/');
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  min-width: 1000px;
  display: flex;
  align-items: center;
}

.img {
  margin-left: $s-6;
  height: $s-37;
}

.errorCode {
  font-size: $s-5;
  line-height: $s-6;
  color: $color-text1-4;
  font-weight: $font-weight-3;
}

.promptContent {
  margin-left: $s-6;
}

.promptInformation {
  font-size: $s-2;
  color: $color-text1-3;
  margin-top: $s-1;
}

.backHomepage {
  margin-top: $s-5;
  font-size: $s-2;
  width: $s-15;
  height: $s-5;
}
</style>
