<template>
  <div id="app">
    <el-container>
        <el-header style="text-align: left; font-size: 22px">
            <span>
                <router-link tag="span" to="/dashboard" class="route">Dashboard</router-link>
            </span>
        </el-header>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>

  </div>
</template>

<script>

export default {
  name: 'app',

}
</script>

<style lang="scss">
    .route {
        cursor: pointer;
    }
    .el-header, .el-footer {
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        background-color: white;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-main {
        width: 100%;
        min-height: 550px;
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>
