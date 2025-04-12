<template>
  <el-result
    style="padding-top: 20vh"
    icon="warning"
    title="您访问的页面不存在"
  >
    <template #extra>
      <router-link to="/">
        <el-button type="primary">返回主页</el-button>
      </router-link>
    </template>
  </el-result>
</template>
