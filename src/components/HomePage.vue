<template>
  <el-container id="main-container">

    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal" default-active="retrieval">
        <el-menu-item id="menu-item" index="retrieval">Retrieval</el-menu-item>
      </el-menu>
    </el-header>

    <el-container>
      <UserInput></UserInput>
      <ResultOutput/>
    </el-container>

  </el-container>
</template>


<script>
import "@/css/homepage.css"
import UserInput from "@/components/UserInput";
import ResultOutput from "@/components/ResultOutput";

export default {
  name: "HomePage",
  components: {ResultOutput, UserInput}
}
</script>



<style scoped>

</style>