<template>
  <el-container v-loading="loading" element-loading-text="正在检索">
    <el-header>
      <!-- 导航栏 -->
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" style="font-size: larger" @click="show_1=true">检索论文</el-menu-item>
      </el-menu>
    </el-header>
    <!-- 检索论文 -->
    <el-container v-show="show_1">
      <!-- 参数输入 -->
      <el-aside style="height: 1200px; width: 550px">
        <!-- 搜索框 -->
        <el-card style="width: 500px;height: 1150px;margin: 20px 0 10px 30px;">
          <h3 class="demonstration" style="margin-left: 10px">1. 输入关键词，多个关键词请以空格区分</h3>
          <div style="">
            <el-input type="text" placeholder="请输入论文标题的关键词，以空格分隔" v-model="key_input"
                      style="width: 390px;height: 40px;" @keyup.enter="searchPaper"></el-input>
            <el-button @click="searchPaper" style="height: 40px">搜索</el-button>
          </div>
          <div>
            <h3 class="demonstration" style="margin-left: 10px">2. 选择开始年份、结束年份、最近X期</h3>
            <div style="margin-top: 20px; display: flex;">
              <div style="margin-left: 0">
                <el-select v-model="start_year" placeholder="开始年份" style="width: 120px" size="large"><el-option v-for="item in year_options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
                <span>&nbsp;</span>
                <el-select v-model="final_year" placeholder="结束年份" style="width: 120px" size="large"><el-option v-for="item in year_options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
                <span>&nbsp;</span>
                <el-select v-model="vols" placeholder="最近X期" style="width: 100px" size="large"><el-option v-for="item in volume_options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
              </div>
            </div>
            <h3 class="demonstration" style="margin-left: 10px">3. 选择会议/期刊<el-checkbox style="margin-left: 10px" size="large" v-model="selectAllChecked" @change="selectAllOptions">全选</el-checkbox></h3>
<!--            -->
            <el-cascader
                size="large"
                :filterable="true"
                :collapse-tags="true"
                :options="jc_options"
                :props="props"
                v-model="selectedTag"
                @change="handleCaChange"
                style="width: 450px;"
                placeholder="可输入字符进行搜索"
                clearable></el-cascader>
            <h3 class="demonstration" style="margin-left: 10px">4. 匹配模式</h3>
            <div style="margin-top: 10px;margin-left: 10px">
              <el-radio v-model="match_pattern" label="1">包含任一关键词、不限制独立单词</el-radio>
              <el-radio v-model="match_pattern" label="2">包含任一关键词、限制独立单词</el-radio>
              <el-radio v-model="match_pattern" label="3">包含所有关键词、不限制独立单词</el-radio>
              <el-radio v-model="match_pattern" label="4">包含所有关键词、限制独立单词</el-radio>
            </div>

          </div>
        </el-card>
      </el-aside>

      <!-- 论文展示表格 -->
      <el-card style="margin-top: 20px;width: 1950px;height: 1150px" v-show="table1empty">
        <el-empty style="margin-top: 20px;width: 1950px;height: 1150px" description="暂无数据"></el-empty>
      </el-card>

      <el-card style="margin-top: 20px;width: 1950px;height: 1150px" v-show="!table1empty">
        <div style="display: flex">
          <el-pagination
              style="margin: 5px 0 0 10px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-count="pageCount"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="table1Data.length">
          </el-pagination>
          <el-select style="margin: 5px 0 0 10px;width: 150px" v-model="selectedSort" @change="handleSortChange" placeholder="选择排序方式">
            <el-option
                v-for="option in sortOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            ></el-option>
          </el-select>
          <el-button  style="margin: 5px 0 0 25px" round type="success" plain @click="exportExcel(table1Data)">导出为 Excel</el-button>
        </div>

        <el-main style="height: 1050px;margin-top: 10px; padding: 0" v-show="show_paper_url">
          <el-card v-for="paper in displayedPapers" :key="paper.id" shadow="hover"
                   style="margin:10px 0 10px 0;border-radius: 10px;padding: 0">
            <div style="display: flex; overflow: auto; margin: 0;padding: 0">
              <h3 style="margin:0;padding: 0;" >{{ paper.title }}</h3>
              <a style="margin-left:5px;" :href="paper.doi" target="_blank"> DOI.</a>
            </div>
<!--            <p style="margin:10px 0 0 0;padding: 0" >{{ paper.authors_str }}</p>-->
            <p style="margin:10px 0 0 0;padding: 0">
              <a style="text-decoration: none;color: black;" v-for="(author, index) in paper.authors" :key="author.url" :href="author.url" target="_blank"><span>{{author.name}}</span><span v-if="index < paper.authors.length - 1">,&nbsp;</span></a>
            </p>
            <p style="margin:10px 0 0 0;padding: 0;" >
              <span style="font-style: italic;font-weight: bold">{{paper.conference_or_article}}&nbsp;</span>
              <span style="margin: 0 5px 0 5px">{{paper.year_or_volume}}</span>
              <span v-if="paper.publisher" style="font-style: italic;margin: 0 5px 0 5px">{{paper.publisher}}</span>
              <span v-if="paper.year" style="margin: 0 5px 0 5px">{{paper.year}}</span>
            </p>
          </el-card>
        </el-main>
      </el-card>


    </el-container>
  </el-container>
</template>

<script>
// import { el-cascader__search-input } from '@element-plus/icons-vue'
import * as XLSX from "xlsx";
import axios from "axios";

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}]

export default {
  name: "MyRetrieval",
  components:{
    // SearchICON,
  },
  data() {
    return {
      selectAllChecked:false,
      loading:false,
      selectedSort: "",
      sortOptions: [{label: "无", value: "none"},{ label: '按会议/期刊排序', value: 'jcname' }, { label: '按论文标题排序', value: 'title' }],
      table1empty: true,
      props: {multiple: true},
      selectedTag: [],
      jc_options: [],
      show_1: true,

      activeIndex: '1',

      year_options: [],
      start_year: '2015',
      final_year: '2023',

      volume_options: [],
      vols: '10',

      key_input: '',

      url_input: '',//'https://dblp.uni-trier.de/pid/332/3372.html',

      table1Data: [],
      table1DataBackup: [],
      currentPage: 1, // 当前页
      pageCount : 0,
      pageSize : 0,
      pageSizes: [10, 20, 50, 100, 500, 1000], // 每页显示的数据条数
      //[{'title': 'NobLSM: an LSM-tree with non-blocking writes for SSDs.', 'authors': 'Haoran Dang, Chongnan Ye, Yanpeng Hu, Chundong Wang', 'year': 2022, 'conference_or_article': 'DAC', 'paper_url': 'https://doi.org/10.1145/3489517.3530470', 'id': 0}, {'title': 'Integrating LSM Trees With Multichip Flash Translation Layer for Write-Efficient KVSSDs.', 'authors': 'Sung-Ming Wu, Kai-Hsiang Lin, Li-Pin Chang', 'year': 40, 'conference_or_article': 'TCAD', 'paper_url': 'https://doi.org/10.1109/TCAD.2020.2987781', 'id': 1}, {'title': 'LLSM: A Lifetime-Aware Wear-Leveling for LSM-Tree on NAND Flash Memory.', 'authors': 'Dharamjeet, Yi-Shen Chen, Tseng-Yi Chen, Yuan-Hung Kuan, Yuan-Hao Chang', 'year': 41, 'conference_or_article': 'TCAD', 'paper_url': 'https://doi.org/10.1109/TCAD.2022.3197542', 'id': 2}, {'title': 'Tidal-Tree-Mem: Toward Read-Intensive Key-Value Stores With Tidal Structure Based on LSM-Tree.', 'authors': 'Chenlin Ma, Hao Yang, Shangyu Wu, Yi Wang, Rui Mao', 'year': 42, 'conference_or_article': 'TCAD', 'paper_url': 'https://doi.org/10.1109/TCAD.2022.3177575', 'id': 3}, {'title': 'KVSTL: An Application Support to LSM-Tree Based Key-Value Store via Shingled Translation Layer Data Management.', 'authors': 'Shuo-Han Chen, Yuhong Liang, Ming-Chang Yang', 'year': 71, 'conference_or_article': 'TC', 'paper_url': 'https://doi.org/10.1109/TC.2021.3098961', 'id': 4}],

      table1_loading: false,

      root_name: 'Chenlin Ma',
      root_url: 'https://dblp.uni-trier.de/pid/148/8695.html',
      table2Data: []
      //[{'node_id': 0, 'url': 'https://dblp.org/pid/67/6649-3.html', 'name': 'Yi Wang', 'paper_count': 98, 'centrality': 93, 'identity': 'tutor', 'tutor_name': 'Zili Shao', 'tutor_url': 'https://dblp.org/pid/08/6845.html', 'group': -1, 'first_paper_year': '2009'}, {'node_id': 1, 'url': 'https://dblp.org/pid/148/8695.html', 'name': 'Chenlin Ma', 'paper_count': 22, 'centrality': 34, 'identity': 'tutor', 'tutor_name': 'Zili Shao', 'tutor_url': 'https://dblp.org/pid/08/6845.html', 'group': -1, 'first_paper_year': '2014'}, {'node_id': 2, 'url': 'https://dblp.org/pid/54/4089.html', 'name': 'Hao Yang', 'paper_count': 237, 'centrality': 799, 'identity': 'tutor', 'tutor_name': 'Wen F. Lu', 'tutor_url': 'https://dblp.org/pid/47/5981.html', 'group': -1, 'first_paper_year': '1994'}, {'node_id': 3, 'url': 'https://dblp.org/pid/241/1185.html', 'name': 'Shangyu Wu', 'paper_count': 6, 'centrality': 18, 'identity': 'student', 'tutor_name': 'Tao Li', 'tutor_url': 'https://dblp.org/pid/75/4601-6.html', 'group': -1, 'first_paper_year': '2019'}, {'node_id': 4, 'url': 'https://dblp.org/pid/51/5793.html', 'name': 'Rui Mao', 'paper_count': 107, 'centrality': 235, 'identity': 'tutor', 'tutor_name': 'Daniel P. Miranker', 'tutor_url': 'https://dblp.org/pid/m/DPMiranker.html', 'group': -1, 'first_paper_year': '2003'}, {'node_id': 5, 'url': 'https://dblp.org/pid/234/2374.html', 'name': 'Jiangfan Huang', 'paper_count': 2, 'centrality': 5, 'identity': 'student', 'tutor_name': 'Yi Wang', 'tutor_url': 'https://dblp.org/pid/67/6649-3.html', 'group': -1, 'first_paper_year': '2019'}, {'node_id': 6, 'url': 'https://dblp.org/pid/27/4364.html', 'name': 'Jing Chen', 'paper_count': 674, 'centrality': 1727, 'identity': 'tutor', 'tutor_name': 'Louxin Zhang', 'tutor_url': 'https://dblp.org/pid/68/5601.html', 'group': -1, 'first_paper_year': '1992'}, {'node_id': 7, 'url': 'https://dblp.org/pid/320/9863.html', 'name': 'Zhuokai Zhou', 'paper_count': 3, 'centrality': 8, 'identity': 'student', 'tutor_name': 'Chenlin Ma', 'tutor_url': 'https://dblp.org/pid/148/8695.html', 'group': -1, 'first_paper_year': '2022'}, {'node_id': 8, 'url': 'https://dblp.org/pid/75/2307.html', 'name': 'Lei Han', 'paper_count': 187, 'centrality': 479, 'identity': 'tutor', 'tutor_name': 'Grzegorz W. Wasilkowski', 'tutor_url': 'https://dblp.org/pid/39/1618.html', 'group': -1, 'first_paper_year': '2000'}, {'node_id': 9, 'url': 'https://dblp.org/pid/150/0554.html', 'name': 'Zhaoyan Shen', 'paper_count': 67, 'centrality': 92, 'identity': 'tutor', 'tutor_name': 'Zhiping Jia', 'tutor_url': 'https://dblp.org/pid/99/6654.html', 'group': -1, 'first_paper_year': '2014'}, {'node_id': 10, 'url': 'https://dblp.org/pid/119/3383.html', 'name': 'Renhai Chen', 'paper_count': 46, 'centrality': 61, 'identity': 'tutor', 'tutor_name': 'Zili Shao', 'tutor_url': 'https://dblp.org/pid/08/6845.html', 'group': -1, 'first_paper_year': '2012'}, {'node_id': 11, 'url': 'https://dblp.org/pid/08/6845.html', 'name': 'Zili Shao', 'paper_count': 262, 'centrality': 228, 'identity': 'tutor', 'tutor_name': 'Chantana Chantrapornchai', 'tutor_url': 'https://dblp.org/pid/c/CChantrapornchai.html', 'group': 1, 'first_paper_year': '2002'}, {'node_id': 12, 'url': 'https://dblp.org/pid/256/1838.html', 'name': 'Jiaxian Chen', 'paper_count': 9, 'centrality': 26, 'identity': 'student', 'tutor_name': 'Yi Wang', 'tutor_url': 'https://dblp.org/pid/67/6649-3.html', 'group': -1, 'first_paper_year': '2020'}, {'node_id': 13, 'url': 'https://dblp.org/pid/139/1255.html', 'name': 'Yiquan Lin', 'paper_count': 6, 'centrality': 24, 'identity': 'student', 'tutor_name': 'Hongtu Xie', 'tutor_url': 'https://dblp.org/pid/179/2809.html', 'group': -1, 'first_paper_year': '2013'}, {'node_id': 14, 'url': 'https://dblp.org/pid/332/3372.html', 'name': 'Kaoyi Sun', 'paper_count': 1, 'centrality': 6, 'identity': 'student', 'tutor_name': 'Yi Wang', 'tutor_url': 'https://dblp.org/pid/67/6649-3.html', 'group': -1, 'first_paper_year': '2022'}, {'node_id': 15, 'url': 'https://dblp.org/pid/271/6207.html', 'name': 'Jiexin Chen', 'paper_count': 3, 'centrality': 10, 'identity': 'student', 'tutor_name': 'John Doyle', 'tutor_url': 'https://dblp.org/pid/d/JohnDoyle.html', 'group': -1, 'first_paper_year': '2020'}, {'node_id': 16, 'url': 'https://dblp.org/pid/292/4973.html', 'name': 'Yingping Wang', 'paper_count': 5, 'centrality': 16, 'identity': 'student', 'tutor_name': 'Guang Zheng', 'tutor_url': 'https://dblp.org/pid/46/6441.html', 'group': -1, 'first_paper_year': '2020'}, {'node_id': 17, 'url': 'https://dblp.org/pid/131/6619.html', 'name': 'Amelie Chi Zhou', 'paper_count': 29, 'centrality': 42, 'identity': 'tutor', 'tutor_name': 'Bingsheng He', 'tutor_url': 'https://dblp.org/pid/h/BingshengHe.html', 'group': -1, 'first_paper_year': '2014'}, {'node_id': 18, 'url': 'https://dblp.org/pid/321/6160.html', 'name': 'Jianming Lao', 'paper_count': 1, 'centrality': 4, 'identity': 'student', 'tutor_name': 'Amelie Chi Zhou', 'tutor_url': 'https://dblp.org/pid/131/6619.html', 'group': -1, 'first_paper_year': '2022'}, {'node_id': 19, 'url': 'https://dblp.org/pid/321/6308.html', 'name': 'Zhoubin Ke', 'paper_count': 1, 'centrality': 4, 'identity': 'student', 'tutor_name': 'Amelie Chi Zhou', 'tutor_url': 'https://dblp.org/pid/131/6619.html', 'group': -1, 'first_paper_year': '2022'}, {'node_id': 20, 'url': 'https://dblp.org/pid/297/9504.html', 'name': 'Jianan Yuan', 'paper_count': 2, 'centrality': 10, 'identity': 'student', 'tutor_name': 'Yi Wang', 'tutor_url': 'https://dblp.org/pid/67/6649-3.html', 'group': -1, 'first_paper_year': '2021'}, {'node_id': 21, 'url': 'https://dblp.org/pid/92/309.html', 'name': 'Huan Liu', 'paper_count': 294, 'centrality': 845, 'identity': 'tutor', 'tutor_name': 'Wilson X. Wen', 'tutor_url': 'https://dblp.org/pid/83/6303.html', 'group': -1, 'first_paper_year': '1995'}, {'node_id': 22, 'url': 'https://dblp.org/pid/66/4971.html', 'name': 'Tiantian Wang', 'paper_count': 32, 'centrality': 119, 'identity': 'tutor', 'tutor_name': 'Chen Zheng', 'tutor_url': 'https://dblp.org/pid/04/3239.html', 'group': -1, 'first_paper_year': '2012'}, {'node_id': 23, 'url': 'https://dblp.org/pid/300/9746.html', 'name': 'Guanquan Lin', 'paper_count': 1, 'centrality': 3, 'identity': 'student', 'tutor_name': 'Yi Wang', 'tutor_url': 'https://dblp.org/pid/67/6649-3.html', 'group': -1, 'first_paper_year': '2021'}, {'node_id': 24, 'url': 'https://dblp.org/pid/38/9911.html', 'name': 'Jihe Wang', 'paper_count': 50, 'centrality': 88, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '2004'}, {'node_id': 25, 'url': 'https://dblp.org/pid/04/606.html', 'name': 'Yong Guan', 'paper_count': 264, 'centrality': 389, 'identity': 'tutor', 'tutor_name': 'Wei Zhao', 'tutor_url': 'https://dblp.org/pid/z/WeiZhao-1.html', 'group': -1, 'first_paper_year': '2001'}, {'node_id': 26, 'url': 'https://dblp.org/pid/161/3545.html', 'name': 'Weixuan Chen', 'paper_count': 23, 'centrality': 53, 'identity': 'tutor', 'tutor_name': 'Brian Litt', 'tutor_url': 'https://dblp.org/pid/79/4859.html', 'group': -1, 'first_paper_year': '2012'}, {'node_id': 27, 'url': 'https://dblp.org/pid/50/3253.html', 'name': 'Xianhua Wang', 'paper_count': 12, 'centrality': 48, 'identity': 'tutor', 'tutor_name': 'Xianhua Wang', 'tutor_url': 'https://dblp.org/pid/50/3253.html', 'group': -1, 'first_paper_year': '2007'}, {'node_id': 28, 'url': 'https://dblp.org/pid/166/7671.html', 'name': 'Zehao Chen', 'paper_count': 23, 'centrality': 33, 'identity': 'tutor', 'tutor_name': 'Zehao Chen', 'tutor_url': 'https://dblp.org/pid/166/7671.html', 'group': -1, 'first_paper_year': '2015'}, {'node_id': 29, 'url': 'https://dblp.org/pid/167/9945.html', 'name': 'Bingzhe Li', 'paper_count': 40, 'centrality': 61, 'identity': 'tutor', 'tutor_name': 'David J. Lilja', 'tutor_url': 'https://dblp.org/pid/38/5692.html', 'group': -1, 'first_paper_year': '2015'}, {'node_id': 30, 'url': 'https://dblp.org/pid/157/2980.html', 'name': 'Xiaojun Cai', 'paper_count': 28, 'centrality': 48, 'identity': 'tutor', 'tutor_name': 'Zhiping Jia', 'tutor_url': 'https://dblp.org/pid/99/6654.html', 'group': -1, 'first_paper_year': '2014'}, {'node_id': 31, 'url': 'https://dblp.org/pid/99/6654.html', 'name': 'Zhiping Jia', 'paper_count': 155, 'centrality': 173, 'identity': 'tutor', 'tutor_name': 'Xin Li', 'tutor_url': 'https://dblp.org/pid/09/1365-2.html', 'group': -1, 'first_paper_year': '2004'}, {'node_id': 32, 'url': 'https://dblp.org/pid/84/6889-74.html', 'name': 'Jie Zhang', 'paper_count': 23, 'centrality': 37, 'identity': 'tutor', 'tutor_name': 'Yong Guan', 'tutor_url': 'https://dblp.org/pid/04/606.html', 'group': -1, 'first_paper_year': '2008'}, {'node_id': 33, 'url': 'https://dblp.org/pid/143/4573-2.html', 'name': 'Zhiping Shi', 'paper_count': 98, 'centrality': 155, 'identity': 'tutor', 'tutor_name': 'Zhongzhi Shi', 'tutor_url': 'https://dblp.org/pid/52/1213.html', 'group': -1, 'first_paper_year': '2005'}, {'node_id': 34, 'url': 'https://dblp.org/pid/122/7499.html', 'name': 'Yongdong Li', 'paper_count': 34, 'centrality': 71, 'identity': 'tutor', 'tutor_name': 'Chenchen Wang', 'tutor_url': 'https://dblp.org/pid/25/7774.html', 'group': -1, 'first_paper_year': '2008'}, {'node_id': 35, 'url': 'https://dblp.org/pid/222/5972.html', 'name': 'Jiali Tan', 'paper_count': 3, 'centrality': 8, 'identity': 'student', 'tutor_name': 'Yi Wang', 'tutor_url': 'https://dblp.org/pid/67/6649-3.html', 'group': -1, 'first_paper_year': '2017'}, {'node_id': 36, 'url': 'https://dblp.org/pid/75/4601-6.html', 'name': 'Tao Li', 'paper_count': 163, 'centrality': 203, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '1999'}, {'node_id': 37, 'url': 'https://dblp.org/pid/03/6588.html', 'name': 'Zhu Wang', 'paper_count': 38, 'centrality': 82, 'identity': 'tutor', 'tutor_name': 'Huiyan Chen', 'tutor_url': 'https://dblp.org/pid/74/1967.html', 'group': -1, 'first_paper_year': '2007'}, {'node_id': 38, 'url': 'https://dblp.org/pid/279/6842.html', 'name': 'Jing Liao', 'paper_count': 1, 'centrality': 2, 'identity': 'student', 'tutor_name': 'Yi Wang', 'tutor_url': 'https://dblp.org/pid/67/6649-3.html', 'group': -1, 'first_paper_year': '2020'}, {'node_id': 39, 'url': 'https://dblp.org/pid/243/0068.html', 'name': 'Zhengda Li', 'paper_count': 5, 'centrality': 17, 'identity': 'student', 'tutor_name': 'Qiong Yang', 'tutor_url': 'https://dblp.org/pid/96/2408.html', 'group': -1, 'first_paper_year': '2018'}, {'node_id': 40, 'url': 'https://dblp.org/pid/62/5839-18.html', 'name': 'Jing Yang', 'paper_count': 7, 'centrality': 8, 'identity': 'student', 'tutor_name': 'Yi Wang', 'tutor_url': 'https://dblp.org/pid/67/6649-3.html', 'group': -1, 'first_paper_year': '2016'}, {'node_id': 41, 'url': 'https://dblp.org/pid/56/10207.html', 'name': 'Mingxu Zhang', 'paper_count': 15, 'centrality': 27, 'identity': 'tutor', 'tutor_name': 'Zulin Wang', 'tutor_url': 'https://dblp.org/pid/37/10829.html', 'group': -1, 'first_paper_year': '2011'}, {'node_id': 42, 'url': 'https://dblp.org/pid/95/3681.html', 'name': 'Xuan Yang', 'paper_count': 144, 'centrality': 291, 'identity': 'tutor', 'tutor_name': 'Din-Chang Tseng', 'tutor_url': 'https://dblp.org/pid/00/899.html', 'group': -1, 'first_paper_year': '2003'}, {'node_id': 43, 'url': 'https://dblp.org/pid/91/195.html', 'name': 'Chi Zhang', 'paper_count': 496, 'centrality': 1640, 'identity': 'tutor', 'tutor_name': 'Patrick S. P. Wang', 'tutor_url': 'https://dblp.org/pid/05/4537.html', 'group': -1, 'first_paper_year': '1996'}, {'node_id': 44, 'url': 'https://dblp.org/pid/91/620.html', 'name': 'Duo Liu', 'paper_count': 182, 'centrality': 235, 'identity': 'tutor', 'tutor_name': 'Xinan Tang', 'tutor_url': 'https://dblp.org/pid/46/2724.html', 'group': 1, 'first_paper_year': '2004'}, {'node_id': 45, 'url': 'https://dblp.org/pid/54/11351.html', 'name': 'Yimei Kang', 'paper_count': 12, 'centrality': 16, 'identity': 'tutor', 'tutor_name': 'Jiang Hu', 'tutor_url': 'https://dblp.org/pid/20/5455.html', 'group': -1, 'first_paper_year': '2011'}, {'node_id': 46, 'url': 'https://dblp.org/pid/35/8549.html', 'name': 'Xingyu Zhang', 'paper_count': 44, 'centrality': 145, 'identity': 'tutor', 'tutor_name': 'Jiali Li', 'tutor_url': 'https://dblp.org/pid/64/8538.html', 'group': -1, 'first_paper_year': '2003'}, {'node_id': 47, 'url': 'https://dblp.org/pid/222/3787.html', 'name': 'Ruibiao Chen', 'paper_count': 2, 'centrality': 9, 'identity': 'student', 'tutor_name': 'Kai Lei', 'tutor_url': 'https://dblp.org/pid/64/9060.html', 'group': -1, 'first_paper_year': '2018'}, {'node_id': 48, 'url': 'https://dblp.org/pid/57/10948-1.html', 'name': 'Tianzheng Wang', 'paper_count': 40, 'centrality': 75, 'identity': 'tutor', 'tutor_name': 'Chengmo Yang', 'tutor_url': 'https://dblp.org/pid/06/4401.html', 'group': -1, 'first_paper_year': '2011'}, {'node_id': 49, 'url': 'https://dblp.org/pid/x/JinglingXue.html', 'name': 'Jingling Xue', 'paper_count': 252, 'centrality': 254, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '1988'}, {'node_id': 50, 'url': 'https://dblp.org/pid/91/8818.html', 'name': 'Lisha Dong', 'paper_count': 8, 'centrality': 14, 'identity': 'student', 'tutor_name': 'Xingang You', 'tutor_url': 'https://dblp.org/pid/66/197.html', 'group': -1, 'first_paper_year': '2010'}, {'node_id': 51, 'url': 'https://dblp.org/pid/84/2082.html', 'name': 'Zhong Ming', 'paper_count': 292, 'centrality': 477, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '2002'}, {'node_id': 52, 'url': 'https://dblp.org/pid/08/237-1.html', 'name': 'Song Jiang', 'paper_count': 103, 'centrality': 142, 'identity': 'tutor', 'tutor_name': 'Xiaodong Zhang', 'tutor_url': 'https://dblp.org/pid/37/4356-1.html', 'group': -1, 'first_paper_year': '2001'}, {'node_id': 53, 'url': 'https://dblp.org/pid/48/2396.html', 'name': 'Guohui Wang', 'paper_count': 84, 'centrality': 179, 'identity': 'tutor', 'tutor_name': 'T. S. Eugene Ng', 'tutor_url': 'https://dblp.org/pid/35/2683.html', 'group': -1, 'first_paper_year': '2006'}, {'node_id': 54, 'url': 'https://dblp.org/pid/37/3401.html', 'name': 'Jingtong Hu', 'paper_count': 177, 'centrality': 197, 'identity': 'tutor', 'tutor_name': 'Edwin Hsing-Mean Sha', 'tutor_url': 'https://dblp.org/pid/27/2376.html', 'group': 1, 'first_paper_year': '2008'}, {'node_id': 55, 'url': 'https://dblp.org/pid/149/3972.html', 'name': 'Kan Zhong', 'paper_count': 26, 'centrality': 48, 'identity': 'tutor', 'tutor_name': 'Edwin Hsing-Mean Sha', 'tutor_url': 'https://dblp.org/pid/27/2376.html', 'group': -1, 'first_paper_year': '2014'}, {'node_id': 56, 'url': 'https://dblp.org/pid/27/2376.html', 'name': 'Edwin Hsing-Mean Sha', 'paper_count': 425, 'centrality': 287, 'identity': 'tutor', 'tutor_name': 'Kenneth Steiglitz', 'tutor_url': 'https://dblp.org/pid/s/KennethSteiglitz.html', 'group': 1, 'first_paper_year': '1991'}, {'node_id': 57, 'url': 'https://dblp.org/pid/17/8175.html', 'name': 'Qingqing Zheng', 'paper_count': 30, 'centrality': 46, 'identity': 'tutor', 'tutor_name': 'Le Zhang', 'tutor_url': 'https://dblp.org/pid/03/4043.html', 'group': -1, 'first_paper_year': '2010'}, {'node_id': 58, 'url': 'https://dblp.org/pid/52/2889.html', 'name': 'Pheng-Ann Heng', 'paper_count': 477, 'centrality': 874, 'identity': 'tutor', 'tutor_name': 'Tien-Tsin Wong', 'tutor_url': 'https://dblp.org/pid/69/220.html', 'group': -1, 'first_paper_year': '1990'}, {'node_id': 59, 'url': 'https://dblp.org/pid/44/1356-2.html', 'name': 'Min Huang', 'paper_count': 10, 'centrality': 15, 'identity': 'tutor', 'tutor_name': 'Liyan Qiao', 'tutor_url': 'https://dblp.org/pid/64/10696.html', 'group': -1, 'first_paper_year': '2014'}, {'node_id': 60, 'url': 'https://dblp.org/pid/28/2621.html', 'name': 'Zhaoqing Liu', 'paper_count': 11, 'centrality': 23, 'identity': 'tutor', 'tutor_name': 'Xiyuan Peng', 'tutor_url': 'https://dblp.org/pid/91/988.html', 'group': -1, 'first_paper_year': '2006'}, {'node_id': 61, 'url': 'https://dblp.org/pid/64/10696.html', 'name': 'Liyan Qiao', 'paper_count': 80, 'centrality': 79, 'identity': 'tutor', 'tutor_name': 'Tong Liu', 'tutor_url': 'https://dblp.org/pid/36/5558.html', 'group': -1, 'first_paper_year': '2011'}, {'node_id': 62, 'url': 'https://dblp.org/pid/62/1052-2.html', 'name': 'Liang Liang', 'paper_count': 76, 'centrality': 110, 'identity': 'tutor', 'tutor_name': 'Yide Zhang', 'tutor_url': 'https://dblp.org/pid/71/5334.html', 'group': -1, 'first_paper_year': '2011'}, {'node_id': 63, 'url': 'https://dblp.org/pid/19/8561.html', 'name': 'Xiao Zhu', 'paper_count': 44, 'centrality': 119, 'identity': 'tutor', 'tutor_name': 'Alexander D. MacKerell Jr.', 'tutor_url': 'https://dblp.org/pid/98/1653.html', 'group': -1, 'first_paper_year': '2010'}, {'node_id': 64, 'url': 'https://dblp.org/pid/141/0607.html', 'name': 'Linbo Long', 'paper_count': 23, 'centrality': 46, 'identity': 'tutor', 'tutor_name': 'Edwin Hsing-Mean Sha', 'tutor_url': 'https://dblp.org/pid/27/2376.html', 'group': -1, 'first_paper_year': '2013'}, {'node_id': 65, 'url': 'https://dblp.org/pid/49/7790.html', 'name': 'Zhiwei Qin', 'paper_count': 43, 'centrality': 72, 'identity': 'tutor', 'tutor_name': 'Zili Shao', 'tutor_url': 'https://dblp.org/pid/08/6845.html', 'group': -1, 'first_paper_year': '2008'}, {'node_id': 66, 'url': 'https://dblp.org/pid/17/6932.html', 'name': 'Qixin Wang', 'paper_count': 64, 'centrality': 110, 'identity': 'tutor', 'tutor_name': 'Lui Sha', 'tutor_url': 'https://dblp.org/pid/67/5282.html', 'group': -1, 'first_paper_year': '2003'}, {'node_id': 67, 'url': 'https://dblp.org/pid/57/2281-2.html', 'name': 'Shuai Li', 'paper_count': 251, 'centrality': 265, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '2007'}, {'node_id': 68, 'url': 'https://dblp.org/pid/y/LaurenceTianruoYang.html', 'name': 'Laurence T. Yang', 'paper_count': 897, 'centrality': 1163, 'identity': 'tutor', 'tutor_name': 'Laurence T. Yang', 'tutor_url': 'https://dblp.org/pid/y/LaurenceTianruoYang.html', 'group': -1, 'first_paper_year': '1996'}, {'node_id': 69, 'url': 'https://dblp.org/pid/30/2207.html', 'name': 'Hui Liao', 'paper_count': 15, 'centrality': 37, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '2001'}, {'node_id': 70, 'url': 'https://dblp.org/pid/46/2181.html', 'name': 'Yang Yu', 'paper_count': 522, 'centrality': 1394, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '2001'}, {'node_id': 71, 'url': 'https://dblp.org/pid/37/4190.html', 'name': 'Yang Li', 'paper_count': 958, 'centrality': 2929, 'identity': 'tutor', 'tutor_name': 'Walter Murray Wonham', 'tutor_url': 'https://dblp.org/pid/85/2667.html', 'group': -1, 'first_paper_year': '1988'}, {'node_id': 72, 'url': 'https://dblp.org/pid/93/6765-5.html', 'name': 'Meng Wang', 'paper_count': 38, 'centrality': 40, 'identity': 'tutor', 'tutor_name': 'James N. K. Liu', 'tutor_url': 'https://dblp.org/pid/l/JNKLiu.html', 'group': -1, 'first_paper_year': '2003'}, {'node_id': 73, 'url': 'https://dblp.org/pid/52/323.html', 'name': 'Qi Zhang', 'paper_count': 752, 'centrality': 2312, 'identity': 'tutor', 'tutor_name': 'Qi Zhang', 'tutor_url': 'https://dblp.org/pid/52/323.html', 'group': -1, 'first_paper_year': '1997'}, {'node_id': 74, 'url': 'https://dblp.org/pid/76/5446.html', 'name': 'Xuandong Li', 'paper_count': 183, 'centrality': 218, 'identity': 'tutor', 'tutor_name': 'Dang Van Hung', 'tutor_url': 'https://dblp.org/pid/h/DangVanHung.html', 'group': -1, 'first_paper_year': '1996'}, {'node_id': 75, 'url': 'https://dblp.org/pid/63/829.html', 'name': 'Linzhang Wang', 'paper_count': 90, 'centrality': 146, 'identity': 'tutor', 'tutor_name': 'Guoliang Zheng', 'tutor_url': 'https://dblp.org/pid/86/672.html', 'group': -1, 'first_paper_year': '2004'}, {'node_id': 76, 'url': 'https://dblp.org/pid/13/2913-1.html', 'name': 'Tian Zhang', 'paper_count': 67, 'centrality': 77, 'identity': 'tutor', 'tutor_name': 'Jianhua Zhao', 'tutor_url': 'https://dblp.org/pid/31/5664.html', 'group': -1, 'first_paper_year': '2005'}, {'node_id': 77, 'url': 'https://dblp.org/pid/00/6381.html', 'name': 'Bin Hu', 'paper_count': 268, 'centrality': 706, 'identity': 'tutor', 'tutor_name': 'Weng Cho Chew', 'tutor_url': 'https://dblp.org/pid/38/1184.html', 'group': -1, 'first_paper_year': '1994'}, {'node_id': 78, 'url': 'https://dblp.org/pid/27/3515.html', 'name': 'Junhui Wang', 'paper_count': 54, 'centrality': 137, 'identity': 'tutor', 'tutor_name': 'Junhui Wang', 'tutor_url': 'https://dblp.org/pid/27/3515.html', 'group': -1, 'first_paper_year': '2007'}, {'node_id': 79, 'url': 'https://dblp.org/pid/02/6629.html', 'name': 'Yue Qian', 'paper_count': 33, 'centrality': 56, 'identity': 'tutor', 'tutor_name': 'Wenhua Dou', 'tutor_url': 'https://dblp.org/pid/41/5655.html', 'group': -1, 'first_paper_year': '2006'}, {'node_id': 80, 'url': 'https://dblp.org/pid/41/5655.html', 'name': 'Wenhua Dou', 'paper_count': 74, 'centrality': 72, 'identity': 'tutor', 'tutor_name': 'Yanxing Zheng', 'tutor_url': 'https://dblp.org/pid/20/2945.html', 'group': -1, 'first_paper_year': '2003'}, {'node_id': 81, 'url': 'https://dblp.org/pid/26/1722.html', 'name': 'Qiang Dou', 'paper_count': 59, 'centrality': 120, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '2004'}, {'node_id': 82, 'url': 'https://dblp.org/pid/73/1987.html', 'name': 'Qingfeng Zhuge', 'paper_count': 195, 'centrality': 145, 'identity': 'tutor', 'tutor_name': 'Edwin Hsing-Mean Sha', 'tutor_url': 'https://dblp.org/pid/27/2376.html', 'group': 1, 'first_paper_year': '2001'}, {'node_id': 83, 'url': 'https://dblp.org/pid/96/5079.html', 'name': 'Henry C. B. Chan', 'paper_count': 111, 'centrality': 120, 'identity': 'tutor', 'tutor_name': 'Robert W. Donaldson', 'tutor_url': 'https://dblp.org/pid/04/5482.html', 'group': -1, 'first_paper_year': '1995'}, {'node_id': 84, 'url': 'https://dblp.org/pid/67/2324.html', 'name': 'Luis Angel D. Bathen', 'paper_count': 39, 'centrality': 37, 'identity': 'tutor', 'tutor_name': 'Sudeep Pasricha', 'tutor_url': 'https://dblp.org/pid/68/2349.html', 'group': -1, 'first_paper_year': '2006'}, {'node_id': 85, 'url': 'https://dblp.org/pid/d/NikilDDutt.html', 'name': 'Nikil D. Dutt', 'paper_count': 522, 'centrality': 417, 'identity': 'tutor', 'tutor_name': 'Daniel Gajski', 'tutor_url': 'https://dblp.org/pid/g/DanielDGajski.html', 'group': -1, 'first_paper_year': '1989'}, {'node_id': 86, 'url': 'https://dblp.org/pid/39/5564.html', 'name': 'Linfeng Pan', 'paper_count': 4, 'centrality': 6, 'identity': 'student', 'tutor_name': 'Zili Shao', 'tutor_url': 'https://dblp.org/pid/08/6845.html', 'group': -1, 'first_paper_year': '2008'}, {'node_id': 87, 'url': 'https://dblp.org/pid/99/6797.html', 'name': 'Minyi Guo', 'paper_count': 502, 'centrality': 678, 'identity': 'tutor', 'tutor_name': 'Minyi Guo', 'tutor_url': 'https://dblp.org/pid/99/6797.html', 'group': -1, 'first_paper_year': '1997'}, {'node_id': 88, 'url': 'https://dblp.org/pid/97/3791.html', 'name': 'Lei Ju', 'paper_count': 100, 'centrality': 141, 'identity': 'tutor', 'tutor_name': 'Abhik Roychoudhury', 'tutor_url': 'https://dblp.org/pid/04/5884.html', 'group': -1, 'first_paper_year': '2007'}, {'node_id': 89, 'url': 'https://dblp.org/pid/75/4595.html', 'name': 'Hongxing Wei', 'paper_count': 62, 'centrality': 82, 'identity': 'tutor', 'tutor_name': 'Tianmiao Wang', 'tutor_url': 'https://dblp.org/pid/27/2337.html', 'group': -1, 'first_paper_year': '2006'}, {'node_id': 90, 'url': 'https://dblp.org/pid/13/1898.html', 'name': 'Bin Wang', 'paper_count': 804, 'centrality': 2189, 'identity': 'tutor', 'tutor_name': '', 'tutor_url': '', 'group': -1, 'first_paper_year': '1987'}, {'node_id': 91, 'url': 'https://dblp.org/pid/71/6513.html', 'name': 'Keith C. C. Chan', 'paper_count': 197, 'centrality': 154, 'identity': 'tutor', 'tutor_name': 'David K. Y. Chiu', 'tutor_url': 'https://dblp.org/pid/33/5288.html', 'group': -1, 'first_paper_year': '1988'}, {'node_id': 92, 'url': 'https://dblp.org/pid/60/6348.html', 'name': 'Miao Liu', 'paper_count': 146, 'centrality': 479, 'identity': 'tutor', 'tutor_name': 'Zhengxin Chen', 'tutor_url': 'https://dblp.org/pid/35/4534.html', 'group': -1, 'first_paper_year': '1998'}, {'node_id': 93, 'url': 'https://dblp.org/pid/93/4010-6.html', 'name': 'Hui Liu', 'paper_count': 36, 'centrality': 70, 'identity': 'tutor', 'tutor_name': 'Ping Chen', 'tutor_url': 'https://dblp.org/pid/33/3675.html', 'group': -1, 'first_paper_year': '2007'}]
      ,
      table2_loading: false,
      show_paper_url: true,
      homepage: false,
      table3Data: [],
      homepage_url: '',
      match_pattern: '1',
      showExport1: false
    }
  },

  computed: {
    displayedPapers() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      if (this.table1Data.length>0){
        return this.table1Data.slice(start, end);
      }
      return []
    },
  },

  methods: {
    extractData(obj, path = [], result = []) {
      if (obj.children) {
        path.push(obj.value);
        for (const child of obj.children) {
          this.extractData(child, [...path], result);
        }
      } else {
        path.push(obj.value);
        result.push(path);
      }
      return result;
    },

    selectAllOptions(){
      console.log(this.selectAllChecked)
      if (this.selectAllChecked===false){
        this.selectedTag = []
        return
      }
      this.selectedTag = [['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'ASPLOS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'DAC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'EUROSYS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'FAST'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'HPCA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'ISCA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'MICRO'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'SC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'USENIX'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TACO'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TCAD'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TOCS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TOS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TPDS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'CGO'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'CLUSTER'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'DATE'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'FPGA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'ICCAD'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'ICCD'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'ICDCS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'PODC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'SPAA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'PPoPP'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'CODES+ISSS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'HiPEAC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'HOT CHIPS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'SoCC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'JPDC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'JSA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'PC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'PE'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TAAS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TECS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TODAES'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TRETS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TVLSI'], ['2.计算机网络', 'A会', 'INFOCOM'], ['2.计算机网络', 'A会', 'MobiCom'], ['2.计算机网络', 'A会', 'NSDI'], ['2.计算机网络', 'A会', 'SIGCOMM'], ['2.计算机网络', 'A刊', 'JSAC'], ['2.计算机网络', 'A刊', 'TMC'], ['2.计算机网络', 'A刊', 'TON'], ['2.计算机网络', 'B会', 'CoNEXT'], ['2.计算机网络', 'B会', 'ICNP'], ['2.计算机网络', 'B会', 'IMC'], ['2.计算机网络', 'B会', 'IPSN'], ['2.计算机网络', 'B会', 'IWQoS'], ['2.计算机网络', 'B会', 'MobiHoc'], ['2.计算机网络', 'B会', 'MobiSys'], ['2.计算机网络', 'B会', 'NOSSDAV'], ['2.计算机网络', 'B会', 'SECON'], ['2.计算机网络', 'B会', 'SenSys'], ['2.计算机网络', 'B刊', 'CN'], ['2.计算机网络', 'B刊', 'TCOM'], ['2.计算机网络', 'B刊', 'TOIT'], ['2.计算机网络', 'B刊', 'TOMM'], ['2.计算机网络', 'B刊', 'TOSN'], ['2.计算机网络', 'B刊', 'TWC'], ['3.网络与信息安全', 'A会', 'CCS'], ['3.网络与信息安全', 'A会', 'CRYPTO'], ['3.网络与信息安全', 'A会', 'EUROCRYPT'], ['3.网络与信息安全', 'A会', 'NDSS'], ['3.网络与信息安全', 'A会', 'S&P'], ['3.网络与信息安全', 'A会', 'USENIX Security'], ['3.网络与信息安全', 'A刊', 'JOC'], ['3.网络与信息安全', 'A刊', 'TDSC'], ['3.网络与信息安全', 'A刊', 'TIFS'], ['3.网络与信息安全', 'B会', 'ACSAC'], ['3.网络与信息安全', 'B会', 'ASIACRYPT'], ['3.网络与信息安全', 'B会', 'CHES'], ['3.网络与信息安全', 'B会', 'CSFW'], ['3.网络与信息安全', 'B会', 'DSN'], ['3.网络与信息安全', 'B会', 'ESORICS'], ['3.网络与信息安全', 'B会', 'FSE'], ['3.网络与信息安全', 'B会', 'PKC'], ['3.网络与信息安全', 'B会', 'RAID'], ['3.网络与信息安全', 'B会', 'SRDS'], ['3.网络与信息安全', 'B会', 'TCC'], ['3.网络与信息安全', 'B刊', 'COMPSEC'], ['3.网络与信息安全', 'B刊', 'DCC'], ['3.网络与信息安全', 'B刊', 'JCS'], ['3.网络与信息安全', 'B刊', 'TOPS'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'ASE'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'FM'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'FSE&ESEC'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'ICSE'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'ISSTA'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'OOPSLA'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'OSDI'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'PLDI'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'POPL'], ['4.软件工程、系统软件、程序设计语言', 'A会', 'SOSP'], ['4.软件工程、系统软件、程序设计语言', 'A刊', 'TOPLAS'], ['4.软件工程、系统软件、程序设计语言', 'A刊', 'TOSEM'], ['4.软件工程、系统软件、程序设计语言', 'A刊', 'TSC'], ['4.软件工程、系统软件、程序设计语言', 'A刊', 'TSE'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'CAiSE'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'CP'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ECOOP'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ESEM'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ETAPS'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'HotOS'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ICFP'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ICPC'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ICSME'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ICSOC'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ICWS'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'ISSRE'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'LCTES'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'Middleware'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'MoDELS'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'RE'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'SANER'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'SAS'], ['4.软件工程、系统软件、程序设计语言', 'B会', 'VMCAI'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'ASE'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'ESE'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'IETS'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'IST'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'JFP'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'JSS'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'RE'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'SCP'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'SMR'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'SoSyM'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'SPE'], ['4.软件工程、系统软件、程序设计语言', 'B刊', 'STVR'], ['5.数据库、数据挖掘、内容检索', 'A会', 'ICDE'], ['5.数据库、数据挖掘、内容检索', 'A会', 'SIGIR'], ['5.数据库、数据挖掘、内容检索', 'A会', 'SIGKDD'], ['5.数据库、数据挖掘、内容检索', 'A会', 'SIGMOD'], ['5.数据库、数据挖掘、内容检索', 'A会', 'VLDB'], ['5.数据库、数据挖掘、内容检索', 'A刊', 'TKDE'], ['5.数据库、数据挖掘、内容检索', 'A刊', 'TODS'], ['5.数据库、数据挖掘、内容检索', 'A刊', 'TOIS'], ['5.数据库、数据挖掘、内容检索', 'A刊', 'VLDBJ'], ['5.数据库、数据挖掘、内容检索', 'B会', 'CIDR'], ['5.数据库、数据挖掘、内容检索', 'B会', 'CIKM'], ['5.数据库、数据挖掘、内容检索', 'B会', 'DASFAA'], ['5.数据库、数据挖掘、内容检索', 'B会', 'ECML-PKDD'], ['5.数据库、数据挖掘、内容检索', 'B会', 'EDBT'], ['5.数据库、数据挖掘、内容检索', 'B会', 'ICDM'], ['5.数据库、数据挖掘、内容检索', 'B会', 'ICDT'], ['5.数据库、数据挖掘、内容检索', 'B会', 'ISWC'], ['5.数据库、数据挖掘、内容检索', 'B会', 'PODS'], ['5.数据库、数据挖掘、内容检索', 'B会', 'RecSys'], ['5.数据库、数据挖掘、内容检索', 'B会', 'SDM'], ['5.数据库、数据挖掘、内容检索', 'B会', 'WSDM'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'AEI'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'DKE'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'DMKD'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'EJIS'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'Geoinformatica'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'IPM'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'IS'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'ISCI'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'JASIST'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'JWS'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'KAIS'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'TKDD'], ['5.数据库、数据挖掘、内容检索', 'B刊', 'TWEB'], ['6.计算机科学理论', 'A会', 'CAV'], ['6.计算机科学理论', 'A会', 'FOCS'], ['6.计算机科学理论', 'A会', 'LICS'], ['6.计算机科学理论', 'A会', 'SODA'], ['6.计算机科学理论', 'A会', 'STOC'], ['6.计算机科学理论', 'A刊', 'IANDC'], ['6.计算机科学理论', 'A刊', 'SICOMP'], ['6.计算机科学理论', 'A刊', 'TIT'], ['6.计算机科学理论', 'B会', 'CADE'], ['6.计算机科学理论', 'B会', 'CCC'], ['6.计算机科学理论', 'B会', 'COCOON'], ['6.计算机科学理论', 'B会', 'CONCUR'], ['6.计算机科学理论', 'B会', 'ESA'], ['6.计算机科学理论', 'B会', 'HSCC'], ['6.计算机科学理论', 'B会', 'ICALP'], ['6.计算机科学理论', 'B会', 'SAT'], ['6.计算机科学理论', 'B会', 'SoCG'], ['6.计算机科学理论', 'B刊', 'Algorithmica'], ['6.计算机科学理论', 'B刊', 'CC'], ['6.计算机科学理论', 'B刊', 'FAC'], ['6.计算机科学理论', 'B刊', 'FMSD'], ['6.计算机科学理论', 'B刊', 'INFORMS'], ['6.计算机科学理论', 'B刊', 'JCSS'], ['6.计算机科学理论', 'B刊', 'JGO'], ['6.计算机科学理论', 'B刊', 'JSC'], ['6.计算机科学理论', 'B刊', 'MSCS'], ['6.计算机科学理论', 'B刊', 'TALG'], ['6.计算机科学理论', 'B刊', 'TCS'], ['6.计算机科学理论', 'B刊', 'TOCL'], ['6.计算机科学理论', 'B刊', 'TOMS'], ['7.计算机图形学与多媒体', 'A会', 'ACM MM'], ['7.计算机图形学与多媒体', 'A会', 'IEEE VIS'], ['7.计算机图形学与多媒体', 'A会', 'SIGGRAPH'], ['7.计算机图形学与多媒体', 'A会', 'VR'], ['7.计算机图形学与多媒体', 'A刊', 'TIP'], ['7.计算机图形学与多媒体', 'A刊', 'TOG'], ['7.计算机图形学与多媒体', 'A刊', 'TVCG'], ['7.计算机图形学与多媒体', 'B会', 'DCC'], ['7.计算机图形学与多媒体', 'B会', 'EGSR'], ['7.计算机图形学与多媒体', 'B会', 'Eurographics'], ['7.计算机图形学与多媒体', 'B会', 'EuroVis'], ['7.计算机图形学与多媒体', 'B会', 'I3D'], ['7.计算机图形学与多媒体', 'B会', 'ICASSP'], ['7.计算机图形学与多媒体', 'B会', 'ICME'], ['7.计算机图形学与多媒体', 'B会', 'ICMR'], ['7.计算机图形学与多媒体', 'B会', 'ISMAR'], ['7.计算机图形学与多媒体', 'B会', 'PG'], ['7.计算机图形学与多媒体', 'B会', 'SCA'], ['7.计算机图形学与多媒体', 'B会', 'SGP'], ['7.计算机图形学与多媒体', 'B会', 'SPM'], ['7.计算机图形学与多媒体', 'B刊', 'CAD'], ['7.计算机图形学与多媒体', 'B刊', 'CAGD'], ['7.计算机图形学与多媒体', 'B刊', 'CGF'], ['7.计算机图形学与多媒体', 'B刊', 'GM'], ['7.计算机图形学与多媒体', 'B刊', 'SIIMS'], ['7.计算机图形学与多媒体', 'B刊', 'SPECOM'], ['7.计算机图形学与多媒体', 'B刊', 'TCSVT'], ['7.计算机图形学与多媒体', 'B刊', 'TMM'], ['7.计算机图形学与多媒体', 'B刊', 'TOMM'], ['8.人工智能', 'A会', 'AAAI'], ['8.人工智能', 'A会', 'ACL'], ['8.人工智能', 'A会', 'CVPR'], ['8.人工智能', 'A会', 'ICCV'], ['8.人工智能', 'A会', 'ICML'], ['8.人工智能', 'A会', 'IJCAI'], ['8.人工智能', 'A会', 'NeurIPS'], ['8.人工智能', 'A刊', 'AI'], ['8.人工智能', 'A刊', 'IJCV'], ['8.人工智能', 'A刊', 'JMLR'], ['8.人工智能', 'A刊', 'TPAMI'], ['8.人工智能', 'B会', 'AAMAS'], ['8.人工智能', 'B会', 'COLT'], ['8.人工智能', 'B会', 'ECAI'], ['8.人工智能', 'B会', 'ECCV'], ['8.人工智能', 'B会', 'EMNLP'], ['8.人工智能', 'B会', 'ICAPS'], ['8.人工智能', 'B会', 'ICCBR'], ['8.人工智能', 'B会', 'ICRA'], ['8.人工智能', 'B会', 'KR'], ['8.人工智能', 'B会', 'NAACL'], ['8.人工智能', 'B会', 'PPSN'], ['8.人工智能', 'B会', 'UAI'], ['8.人工智能', 'B刊', 'AAMAS'], ['8.人工智能', 'B刊', 'Coling'], ['8.人工智能', 'B刊', 'CVIU'], ['8.人工智能', 'B刊', 'DKE'], ['8.人工智能', 'B刊', 'EC'], ['8.人工智能', 'B刊', 'IJAR'], ['8.人工智能', 'B刊', 'JAIR'], ['8.人工智能', 'B刊', 'ML'], ['8.人工智能', 'B刊', 'NECO'], ['8.人工智能', 'B刊', 'NN'], ['8.人工智能', 'B刊', 'TAC'], ['8.人工智能', 'B刊', 'TAP'], ['8.人工智能', 'B刊', 'TASLP'], ['8.人工智能', 'B刊', 'TCYB'], ['8.人工智能', 'B刊', 'TEC'], ['8.人工智能', 'B刊', 'TFS'], ['8.人工智能', 'B刊', 'TNNLS'], ['9.人机交互与普适计算', 'A会', 'CHI'], ['9.人机交互与普适计算', 'A会', 'CSCW'], ['9.人机交互与普适计算', 'A会', 'UbiComp'], ['9.人机交互与普适计算', 'A会', 'UIST'], ['9.人机交互与普适计算', 'A刊', 'IJHCS'], ['9.人机交互与普适计算', 'A刊', 'TOCHI'], ['9.人机交互与普适计算', 'B会', 'ECSCW'], ['9.人机交互与普适计算', 'B会', 'GROUP'], ['9.人机交互与普适计算', 'B会', 'ICWSM'], ['9.人机交互与普适计算', 'B会', 'ITS'], ['9.人机交互与普适计算', 'B会', 'IUI'], ['9.人机交互与普适计算', 'B会', 'MobileHCI'], ['9.人机交互与普适计算', 'B会', 'PERCOM'], ['9.人机交互与普适计算', 'B刊', 'CSCW'], ['9.人机交互与普适计算', 'B刊', 'HCI'], ['9.人机交互与普适计算', 'B刊', 'IJHCI'], ['9.人机交互与普适计算', 'B刊', 'IWC'], ['9.人机交互与普适计算', 'B刊', 'THMS'], ['9.人机交互与普适计算', 'B刊', 'UMUAI'], ['10.交叉、综合、新兴', 'A会', 'RTSS'], ['10.交叉、综合、新兴', 'A会', 'WINE'], ['10.交叉、综合、新兴', 'A会', 'WWW'], ['10.交叉、综合、新兴', 'A刊', 'JACM'], ['10.交叉、综合、新兴', 'A刊', 'Proc. IEEE'], ['10.交叉、综合、新兴', 'A刊', 'Proc. SCIS'], ['10.交叉、综合、新兴', 'B会', 'BIBM'], ['10.交叉、综合、新兴', 'B会', 'CogSci'], ['10.交叉、综合、新兴', 'B会', 'EMSOFT'], ['10.交叉、综合、新兴', 'B会', 'ISMB'], ['10.交叉、综合、新兴', 'B会', 'MICCAI'], ['10.交叉、综合、新兴', 'B会', 'RECOMB'], ['10.交叉、综合、新兴', 'B刊', 'Bib'], ['10.交叉、综合、新兴', 'B刊', 'Bioinformatics'], ['10.交叉、综合、新兴', 'B刊', 'CJ'], ['10.交叉、综合、新兴', 'B刊', 'FCS'], ['10.交叉、综合、新兴', 'B刊', 'JAMIA'], ['10.交叉、综合、新兴', 'B刊', 'JCST'], ['10.交叉、综合、新兴', 'B刊', 'Ploscb'], ['10.交叉、综合、新兴', 'B刊', 'TASAE'], ['10.交叉、综合、新兴', 'B刊', 'TCBB'], ['10.交叉、综合、新兴', 'B刊', 'TGARS'], ['10.交叉、综合、新兴', 'B刊', 'TITS'], ['10.交叉、综合、新兴', 'B刊', 'TMI'], ['10.交叉、综合、新兴', 'B刊', 'TR'], ['10.交叉、综合、新兴', 'B刊', 'WWW']]
    },


    handleSizeChange(val) {
      this.pageSize = val
      this.pageCount = Math.ceil(this.table1Data.length / this.pageSize)
    },

    // 控制论文结果翻页
    handleCurrentChange(page) {
      this.currentPage = page;
    },

    exportExcel(data) {
      const worksheet = XLSX.utils.json_to_sheet(data);  // 将数据转换为工作表对象
      const workbook = XLSX.utils.book_new();  // 创建一个工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');  // 向工作簿添加工作表
      const buffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'});  // 将工作簿转换为二进制字符串
      const blob = new Blob([buffer], {type: 'application/vnd.ms-excel'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    searchPaper() {
      this.loading = true
      this.show_paper_url = true
      // 数据合理性
      if (this.key_input === '') {
        this.$message({message: "关键词不能为空", type: "warning"})
        return
      }
      if (this.final_year === '' || this.start_year === '' || this.vols === '') {
        this.$message({message: "年份不能为空", type: "warning"})
        return
      }
      if (this.final_year < this.start_year) {
        this.$message({message: "结束年份小于开始年份，请重新输入", type: "warning"})
        return
      }
      if (this.selectedTag.length === 0) {
        this.$message({message: "检索会议或期刊不能为空", type: "warning"})
        return
      }
      this.table1_loading = true
      axios({
        method: 'post',
        url: 'http://172.31.225.109:5001/search',
        data: {
          key_words: this.key_input,
          start_year: this.start_year,
          final_year: this.final_year,
          vols: this.vols,
          cj_list: this.selectedTag,
          match_pattern: this.match_pattern
        }
      }).then((res) => {
        console.log(res.data)
        this.table1Data = res.data
        this.table1DataBackup = [...this.table1Data]
        this.pageCount = 1
        this.pageSize = this.table1Data.length
        this.pageSizes = [5, 10, 20, 50, 100, 500, 1000]
        this.pageSizes.unshift(this.table1Data.length)
        if (this.table1Data.length>0){
          this.table1empty = false
        }else {
          this.$message({message: "没有检索到相关数据", type: "info"})
          this.table1Data = true
        }
      }).catch(() => {
        this.$message("数据异常，请重试")
      }).finally(() => {
        this.loading = false
        this.table1_loading = false
      })
    },

    handleSortChange(newValue){
      console.log('选项变化了：', newValue);
      if (newValue==="title"){
        this.table1Data.sort((a, b) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          }
          if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
          }
          return 0;
        });
      }else if (newValue==="jcname"){
        this.table1Data.sort((a, b) => {
          if (a.conference_or_article.toLowerCase() < b.conference_or_article.toLowerCase()) {
            return -1;
          }
          if (a.conference_or_article.toLowerCase() > b.conference_or_article.toLowerCase()) {
            return 1;
          }
          return 0;
        });
      }else {
        this.table1Data = [...this.table1DataBackup]
      }

    },

    get() {
      this.homepage = false
      this.showExport1 = true
      console.log(this.root_name + " " + this.root_url)
      this.table2_loading = true
      axios({
        method: 'post',
        url: 'http://172.31.225.109:5000/find',
        data: {
          root_url_: this.root_url
        }
      }).then((res) => {
        console.log(res.data)
        this.table2Data = res.data
      }).catch(() => {
        this.$message("数据异常，请重试")
      }).finally(() => {
        this.table2_loading = false
      })
    },

    get_people() {
      this.show_paper_url = false
      console.log(this.root_name + " " + this.root_url)
      this.table2_loading = true
      axios({
        method: 'post',
        url: 'http://172.31.225.109:5000/get_people',
        data: {
          url_input: this.url_input
        }
      }).then((res) => {
        console.log(res.data)
        this.table1Data = res.data
      }).catch(() => {
        this.$message("数据异常，请重试")
      }).finally(() => {
        this.table2_loading = false
      })
    },

    handleCaChange() {
      console.log(this.selectedTag)
    },

    authorHome(item) {
      this.showExport1 = false
      this.homepage_url = item.url
      this.homepage = true
      axios({
        method: 'post',
        url: 'http://172.31.225.109:5000/get_people',
        data: {
          url_input: this.homepage_url
        }
      }).then((res) => {
        console.log(res.data)
        this.table3Data = res.data
      }).catch(() => {
        this.$message("数据异常，请重试")
      }).finally(() => {
        this.table3_loading = false
      })
      /*
      this.$http({
        method: 'post',
        url: 'http://172.31.225.109:5000/get_people',
        data: {
          url_input: this.homepage_url
        }
      }).then((res) => {
        console.log(res.data)
        this.table3Data = res.data
      }).catch(() => {
        this.$message("数据异常，请重试")
      }).finally(() => {
        this.table3_loading = false
      })*/
    },
  },

  mounted() {
    for (let i = 2023; i >= 1950; i--) {
      this.year_options.push({
        value: i.toString(),
        label: i.toString()
      });
    }

    for (let i = 1; i <= 100; i++) {
      this.volume_options.push({
        value: i.toString(),
        label: i.toString()
      });
    }

    // axios({
    //   method: 'get',
    //   url: 'http://172.31.225.109:5001/jcoptions',
    // }).then((res) => {
    //   console.log(res.data)
    //   this.jc_options = [...res.data]
    // }).catch(() => {
    //   this.$message("数据异常，请重试")
    // })
    this.jc_options = [{'value': '1.计算机体系结构、并行与分布计算、存储系统', 'label': '1.计算机体系结构、并行与分布计算、存储系统', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'ASPLOS', 'label': 'ASPLOS', 'children': []}, {'value': 'DAC', 'label': 'DAC', 'children': []}, {'value': 'EUROSYS', 'label': 'EUROSYS', 'children': []}, {'value': 'FAST', 'label': 'FAST', 'children': []}, {'value': 'HPCA', 'label': 'HPCA', 'children': []}, {'value': 'ISCA', 'label': 'ISCA', 'children': []}, {'value': 'MICRO', 'label': 'MICRO', 'children': []}, {'value': 'PPoPP', 'label': 'PPoPP', 'children': []}, {'value': 'SC', 'label': 'SC', 'children': []}, {'value': 'USENIX', 'label': 'USENIX', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'TACO', 'label': 'TACO', 'children': []}, {'value': 'TC', 'label': 'TC', 'children': []}, {'value': 'TCAD', 'label': 'TCAD', 'children': []}, {'value': 'TOCS', 'label': 'TOCS', 'children': []}, {'value': 'TOS', 'label': 'TOS', 'children': []}, {'value': 'TPDS', 'label': 'TPDS', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'CGO', 'label': 'CGO', 'children': []}, {'value': 'CLUSTER', 'label': 'CLUSTER', 'children': []}, {'value': 'CODES+ISSS', 'label': 'CODES+ISSS', 'children': []}, {'value': 'DATE', 'label': 'DATE', 'children': []}, {'value': 'FPGA', 'label': 'FPGA', 'children': []}, {'value': 'HiPEAC', 'label': 'HiPEAC', 'children': []}, {'value': 'HOT CHIPS', 'label': 'HOT CHIPS', 'children': []}, {'value': 'ICCAD', 'label': 'ICCAD', 'children': []}, {'value': 'ICCD', 'label': 'ICCD', 'children': []}, {'value': 'ICDCS', 'label': 'ICDCS', 'children': []}, {'value': 'PODC', 'label': 'PODC', 'children': []}, {'value': 'SoCC', 'label': 'SoCC', 'children': []}, {'value': 'SPAA', 'label': 'SPAA', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'JPDC', 'label': 'JPDC', 'children': []}, {'value': 'JSA', 'label': 'JSA', 'children': []}, {'value': 'PC', 'label': 'PC', 'children': []}, {'value': 'PE', 'label': 'PE', 'children': []}, {'value': 'TAAS', 'label': 'TAAS', 'children': []}, {'value': 'TECS', 'label': 'TECS', 'children': []}, {'value': 'TODAES', 'label': 'TODAES', 'children': []}, {'value': 'TRETS', 'label': 'TRETS', 'children': []}, {'value': 'TVLSI', 'label': 'TVLSI', 'children': []}]}]}, {'value': '2.计算机网络', 'label': '2.计算机网络', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'INFOCOM', 'label': 'INFOCOM', 'children': []}, {'value': 'MobiCom', 'label': 'MobiCom', 'children': []}, {'value': 'NSDI', 'label': 'NSDI', 'children': []}, {'value': 'SIGCOMM', 'label': 'SIGCOMM', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'JSAC', 'label': 'JSAC', 'children': []}, {'value': 'TMC', 'label': 'TMC', 'children': []}, {'value': 'TON', 'label': 'TON', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'CoNEXT', 'label': 'CoNEXT', 'children': []}, {'value': 'ICNP', 'label': 'ICNP', 'children': []}, {'value': 'IMC', 'label': 'IMC', 'children': []}, {'value': 'IPSN', 'label': 'IPSN', 'children': []}, {'value': 'IWQoS', 'label': 'IWQoS', 'children': []}, {'value': 'MobiHoc', 'label': 'MobiHoc', 'children': []}, {'value': 'MobiSys', 'label': 'MobiSys', 'children': []}, {'value': 'NOSSDAV', 'label': 'NOSSDAV', 'children': []}, {'value': 'SECON', 'label': 'SECON', 'children': []}, {'value': 'SenSys', 'label': 'SenSys', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'CN', 'label': 'CN', 'children': []}, {'value': 'TCOM', 'label': 'TCOM', 'children': []}, {'value': 'TOIT', 'label': 'TOIT', 'children': []}, {'value': 'TOMM', 'label': 'TOMM', 'children': []}, {'value': 'TOSN', 'label': 'TOSN', 'children': []}, {'value': 'TWC', 'label': 'TWC', 'children': []}]}]}, {'value': '3.网络与信息安全', 'label': '3.网络与信息安全', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'CCS', 'label': 'CCS', 'children': []}, {'value': 'CRYPTO', 'label': 'CRYPTO', 'children': []}, {'value': 'EUROCRYPT', 'label': 'EUROCRYPT', 'children': []}, {'value': 'NDSS', 'label': 'NDSS', 'children': []}, {'value': 'S&P', 'label': 'S&P', 'children': []}, {'value': 'USENIX Security', 'label': 'USENIX Security', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'JOC', 'label': 'JOC', 'children': []}, {'value': 'TDSC', 'label': 'TDSC', 'children': []}, {'value': 'TIFS', 'label': 'TIFS', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'ACSAC', 'label': 'ACSAC', 'children': []}, {'value': 'ASIACRYPT', 'label': 'ASIACRYPT', 'children': []}, {'value': 'CHES', 'label': 'CHES', 'children': []}, {'value': 'CSFW', 'label': 'CSFW', 'children': []}, {'value': 'DSN', 'label': 'DSN', 'children': []}, {'value': 'ESORICS', 'label': 'ESORICS', 'children': []}, {'value': 'FSE', 'label': 'FSE', 'children': []}, {'value': 'PKC', 'label': 'PKC', 'children': []}, {'value': 'RAID', 'label': 'RAID', 'children': []}, {'value': 'SRDS', 'label': 'SRDS', 'children': []}, {'value': 'TCC', 'label': 'TCC', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'COMPSEC', 'label': 'COMPSEC', 'children': []}, {'value': 'DCC', 'label': 'DCC', 'children': []}, {'value': 'JCS', 'label': 'JCS', 'children': []}, {'value': 'TOPS', 'label': 'TOPS', 'children': []}]}]}, {'value': '4.软件工程、系统软件、程序设计语言', 'label': '4.软件工程、系统软件、程序设计语言', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'ASE', 'label': 'ASE', 'children': []}, {'value': 'FM', 'label': 'FM', 'children': []}, {'value': 'FSE&ESEC', 'label': 'FSE&ESEC', 'children': []}, {'value': 'ICSE', 'label': 'ICSE', 'children': []}, {'value': 'ISSTA', 'label': 'ISSTA', 'children': []}, {'value': 'OOPSLA', 'label': 'OOPSLA', 'children': []}, {'value': 'OSDI', 'label': 'OSDI', 'children': []}, {'value': 'PLDI', 'label': 'PLDI', 'children': []}, {'value': 'POPL', 'label': 'POPL', 'children': []}, {'value': 'SOSP', 'label': 'SOSP', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'TOPLAS', 'label': 'TOPLAS', 'children': []}, {'value': 'TOSEM', 'label': 'TOSEM', 'children': []}, {'value': 'TSC', 'label': 'TSC', 'children': []}, {'value': 'TSE', 'label': 'TSE', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'CAiSE', 'label': 'CAiSE', 'children': []}, {'value': 'CP', 'label': 'CP', 'children': []}, {'value': 'ECOOP', 'label': 'ECOOP', 'children': []}, {'value': 'ESEM', 'label': 'ESEM', 'children': []}, {'value': 'ETAPS', 'label': 'ETAPS', 'children': []}, {'value': 'HotOS', 'label': 'HotOS', 'children': []}, {'value': 'ICFP', 'label': 'ICFP', 'children': []}, {'value': 'ICPC', 'label': 'ICPC', 'children': []}, {'value': 'ICSME', 'label': 'ICSME', 'children': []}, {'value': 'ICSOC', 'label': 'ICSOC', 'children': []}, {'value': 'ICWS', 'label': 'ICWS', 'children': []}, {'value': 'ISSRE', 'label': 'ISSRE', 'children': []}, {'value': 'LCTES', 'label': 'LCTES', 'children': []}, {'value': 'Middleware', 'label': 'Middleware', 'children': []}, {'value': 'MoDELS', 'label': 'MoDELS', 'children': []}, {'value': 'RE', 'label': 'RE', 'children': []}, {'value': 'SANER', 'label': 'SANER', 'children': []}, {'value': 'SAS', 'label': 'SAS', 'children': []}, {'value': 'VMCAI', 'label': 'VMCAI', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'ASE', 'label': 'ASE', 'children': []}, {'value': 'ESE', 'label': 'ESE', 'children': []}, {'value': 'IETS', 'label': 'IETS', 'children': []}, {'value': 'IST', 'label': 'IST', 'children': []}, {'value': 'JFP', 'label': 'JFP', 'children': []}, {'value': 'JSS', 'label': 'JSS', 'children': []}, {'value': 'RE', 'label': 'RE', 'children': []}, {'value': 'SCP', 'label': 'SCP', 'children': []}, {'value': 'SMR', 'label': 'SMR', 'children': []}, {'value': 'SoSyM', 'label': 'SoSyM', 'children': []}, {'value': 'SPE', 'label': 'SPE', 'children': []}, {'value': 'STVR', 'label': 'STVR', 'children': []}]}]}, {'value': '5.数据库、数据挖掘、内容检索', 'label': '5.数据库、数据挖掘、内容检索', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'ICDE', 'label': 'ICDE', 'children': []}, {'value': 'SIGIR', 'label': 'SIGIR', 'children': []}, {'value': 'SIGKDD', 'label': 'SIGKDD', 'children': []}, {'value': 'SIGMOD', 'label': 'SIGMOD', 'children': []}, {'value': 'VLDB', 'label': 'VLDB', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'TKDE', 'label': 'TKDE', 'children': []}, {'value': 'TODS', 'label': 'TODS', 'children': []}, {'value': 'TOIS', 'label': 'TOIS', 'children': []}, {'value': 'VLDBJ', 'label': 'VLDBJ', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'CIDR', 'label': 'CIDR', 'children': []}, {'value': 'CIKM', 'label': 'CIKM', 'children': []}, {'value': 'DASFAA', 'label': 'DASFAA', 'children': []}, {'value': 'ECML-PKDD', 'label': 'ECML-PKDD', 'children': []}, {'value': 'EDBT', 'label': 'EDBT', 'children': []}, {'value': 'ICDM', 'label': 'ICDM', 'children': []}, {'value': 'ICDT', 'label': 'ICDT', 'children': []}, {'value': 'ISWC', 'label': 'ISWC', 'children': []}, {'value': 'PODS', 'label': 'PODS', 'children': []}, {'value': 'RecSys', 'label': 'RecSys', 'children': []}, {'value': 'SDM', 'label': 'SDM', 'children': []}, {'value': 'WSDM', 'label': 'WSDM', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'AEI', 'label': 'AEI', 'children': []}, {'value': 'DKE', 'label': 'DKE', 'children': []}, {'value': 'DMKD', 'label': 'DMKD', 'children': []}, {'value': 'EJIS', 'label': 'EJIS', 'children': []}, {'value': 'Geoinformatica', 'label': 'Geoinformatica', 'children': []}, {'value': 'IPM', 'label': 'IPM', 'children': []}, {'value': 'IS', 'label': 'IS', 'children': []}, {'value': 'ISCI', 'label': 'ISCI', 'children': []}, {'value': 'JASIST', 'label': 'JASIST', 'children': []}, {'value': 'JWS', 'label': 'JWS', 'children': []}, {'value': 'KAIS', 'label': 'KAIS', 'children': []}, {'value': 'TKDD', 'label': 'TKDD', 'children': []}, {'value': 'TWEB', 'label': 'TWEB', 'children': []}]}]}, {'value': '6.计算机科学理论', 'label': '6.计算机科学理论', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'CAV', 'label': 'CAV', 'children': []}, {'value': 'FOCS', 'label': 'FOCS', 'children': []}, {'value': 'LICS', 'label': 'LICS', 'children': []}, {'value': 'SODA', 'label': 'SODA', 'children': []}, {'value': 'STOC', 'label': 'STOC', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'IANDC', 'label': 'IANDC', 'children': []}, {'value': 'SICOMP', 'label': 'SICOMP', 'children': []}, {'value': 'TIT', 'label': 'TIT', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'CADE', 'label': 'CADE', 'children': []}, {'value': 'CCC', 'label': 'CCC', 'children': []}, {'value': 'COCOON', 'label': 'COCOON', 'children': []}, {'value': 'CONCUR', 'label': 'CONCUR', 'children': []}, {'value': 'ESA', 'label': 'ESA', 'children': []}, {'value': 'HSCC', 'label': 'HSCC', 'children': []}, {'value': 'ICALP', 'label': 'ICALP', 'children': []}, {'value': 'SAT', 'label': 'SAT', 'children': []}, {'value': 'SoCG', 'label': 'SoCG', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'Algorithmica', 'label': 'Algorithmica', 'children': []}, {'value': 'CC', 'label': 'CC', 'children': []}, {'value': 'FAC', 'label': 'FAC', 'children': []}, {'value': 'FMSD', 'label': 'FMSD', 'children': []}, {'value': 'INFORMS', 'label': 'INFORMS', 'children': []}, {'value': 'JCSS', 'label': 'JCSS', 'children': []}, {'value': 'JGO', 'label': 'JGO', 'children': []}, {'value': 'JSC', 'label': 'JSC', 'children': []}, {'value': 'MSCS', 'label': 'MSCS', 'children': []}, {'value': 'TALG', 'label': 'TALG', 'children': []}, {'value': 'TCS', 'label': 'TCS', 'children': []}, {'value': 'TOCL', 'label': 'TOCL', 'children': []}, {'value': 'TOMS', 'label': 'TOMS', 'children': []}]}]}, {'value': '7.计算机图形学与多媒体', 'label': '7.计算机图形学与多媒体', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'ACM MM', 'label': 'ACM MM', 'children': []}, {'value': 'IEEE VIS', 'label': 'IEEE VIS', 'children': []}, {'value': 'SIGGRAPH', 'label': 'SIGGRAPH', 'children': []}, {'value': 'VR', 'label': 'VR', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'TIP', 'label': 'TIP', 'children': []}, {'value': 'TOG', 'label': 'TOG', 'children': []}, {'value': 'TVCG', 'label': 'TVCG', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'DCC', 'label': 'DCC', 'children': []}, {'value': 'EGSR', 'label': 'EGSR', 'children': []}, {'value': 'Eurographics', 'label': 'Eurographics', 'children': []}, {'value': 'EuroVis', 'label': 'EuroVis', 'children': []}, {'value': 'I3D', 'label': 'I3D', 'children': []}, {'value': 'ICASSP', 'label': 'ICASSP', 'children': []}, {'value': 'ICME', 'label': 'ICME', 'children': []}, {'value': 'ICMR', 'label': 'ICMR', 'children': []}, {'value': 'ISMAR', 'label': 'ISMAR', 'children': []}, {'value': 'PG', 'label': 'PG', 'children': []}, {'value': 'SCA', 'label': 'SCA', 'children': []}, {'value': 'SGP', 'label': 'SGP', 'children': []}, {'value': 'SPM', 'label': 'SPM', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'CAD', 'label': 'CAD', 'children': []}, {'value': 'CAGD', 'label': 'CAGD', 'children': []}, {'value': 'CGF', 'label': 'CGF', 'children': []}, {'value': 'GM', 'label': 'GM', 'children': []}, {'value': 'SIIMS', 'label': 'SIIMS', 'children': []}, {'value': 'SPECOM', 'label': 'SPECOM', 'children': []}, {'value': 'TCSVT', 'label': 'TCSVT', 'children': []}, {'value': 'TMM', 'label': 'TMM', 'children': []}, {'value': 'TOMM', 'label': 'TOMM', 'children': []}]}]}, {'value': '8.人工智能', 'label': '8.人工智能', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'AAAI', 'label': 'AAAI', 'children': []}, {'value': 'ACL', 'label': 'ACL', 'children': []}, {'value': 'CVPR', 'label': 'CVPR', 'children': []}, {'value': 'ICCV', 'label': 'ICCV', 'children': []}, {'value': 'ICML', 'label': 'ICML', 'children': []}, {'value': 'IJCAI', 'label': 'IJCAI', 'children': []}, {'value': 'NeurIPS', 'label': 'NeurIPS', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'AI', 'label': 'AI', 'children': []}, {'value': 'IJCV', 'label': 'IJCV', 'children': []}, {'value': 'JMLR', 'label': 'JMLR', 'children': []}, {'value': 'TPAMI', 'label': 'TPAMI', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'AAMAS', 'label': 'AAMAS', 'children': []}, {'value': 'COLT', 'label': 'COLT', 'children': []}, {'value': 'ECAI', 'label': 'ECAI', 'children': []}, {'value': 'ECCV', 'label': 'ECCV', 'children': []}, {'value': 'EMNLP', 'label': 'EMNLP', 'children': []}, {'value': 'ICAPS', 'label': 'ICAPS', 'children': []}, {'value': 'ICCBR', 'label': 'ICCBR', 'children': []}, {'value': 'ICRA', 'label': 'ICRA', 'children': []}, {'value': 'KR', 'label': 'KR', 'children': []}, {'value': 'NAACL', 'label': 'NAACL', 'children': []}, {'value': 'PPSN', 'label': 'PPSN', 'children': []}, {'value': 'UAI', 'label': 'UAI', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'AAMAS', 'label': 'AAMAS', 'children': []}, {'value': 'Coling', 'label': 'Coling', 'children': []}, {'value': 'CVIU', 'label': 'CVIU', 'children': []}, {'value': 'DKE', 'label': 'DKE', 'children': []}, {'value': 'EC', 'label': 'EC', 'children': []}, {'value': 'IJAR', 'label': 'IJAR', 'children': []}, {'value': 'JAIR', 'label': 'JAIR', 'children': []}, {'value': 'ML', 'label': 'ML', 'children': []}, {'value': 'NECO', 'label': 'NECO', 'children': []}, {'value': 'NN', 'label': 'NN', 'children': []}, {'value': 'TAC', 'label': 'TAC', 'children': []}, {'value': 'TAP', 'label': 'TAP', 'children': []}, {'value': 'TASLP', 'label': 'TASLP', 'children': []}, {'value': 'TCYB', 'label': 'TCYB', 'children': []}, {'value': 'TEC', 'label': 'TEC', 'children': []}, {'value': 'TFS', 'label': 'TFS', 'children': []}, {'value': 'TNNLS', 'label': 'TNNLS', 'children': []}]}]}, {'value': '9.人机交互与普适计算', 'label': '9.人机交互与普适计算', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'CHI', 'label': 'CHI', 'children': []}, {'value': 'CSCW', 'label': 'CSCW', 'children': []}, {'value': 'UbiComp', 'label': 'UbiComp', 'children': []}, {'value': 'UIST', 'label': 'UIST', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'IJHCS', 'label': 'IJHCS', 'children': []}, {'value': 'TOCHI', 'label': 'TOCHI', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'ECSCW', 'label': 'ECSCW', 'children': []}, {'value': 'GROUP', 'label': 'GROUP', 'children': []}, {'value': 'ICWSM', 'label': 'ICWSM', 'children': []}, {'value': 'ITS', 'label': 'ITS', 'children': []}, {'value': 'IUI', 'label': 'IUI', 'children': []}, {'value': 'MobileHCI', 'label': 'MobileHCI', 'children': []}, {'value': 'PERCOM', 'label': 'PERCOM', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'CSCW', 'label': 'CSCW', 'children': []}, {'value': 'HCI', 'label': 'HCI', 'children': []}, {'value': 'IJHCI', 'label': 'IJHCI', 'children': []}, {'value': 'IWC', 'label': 'IWC', 'children': []}, {'value': 'THMS', 'label': 'THMS', 'children': []}, {'value': 'UMUAI', 'label': 'UMUAI', 'children': []}]}]}, {'value': '10.交叉、综合、新兴', 'label': '10.交叉、综合、新兴', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'RTSS', 'label': 'RTSS', 'children': []}, {'value': 'WINE', 'label': 'WINE', 'children': []}, {'value': 'WWW', 'label': 'WWW', 'children': []}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'JACM', 'label': 'JACM', 'children': []}, {'value': 'Proc. IEEE', 'label': 'Proc. IEEE', 'children': []}, {'value': 'Proc. SCIS', 'label': 'Proc. SCIS', 'children': []}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'BIBM', 'label': 'BIBM', 'children': []}, {'value': 'CogSci', 'label': 'CogSci', 'children': []}, {'value': 'EMSOFT', 'label': 'EMSOFT', 'children': []}, {'value': 'ISMB', 'label': 'ISMB', 'children': []}, {'value': 'MICCAI', 'label': 'MICCAI', 'children': []}, {'value': 'RECOMB', 'label': 'RECOMB', 'children': []}]}, {'value': 'B刊', 'label': 'B刊', 'children': [{'value': 'Bib', 'label': 'Bib', 'children': []}, {'value': 'Bioinformatics', 'label': 'Bioinformatics', 'children': []}, {'value': 'CJ', 'label': 'CJ', 'children': []}, {'value': 'FCS', 'label': 'FCS', 'children': []}, {'value': 'JAMIA', 'label': 'JAMIA', 'children': []}, {'value': 'JCST', 'label': 'JCST', 'children': []}, {'value': 'Ploscb', 'label': 'Ploscb', 'children': []}, {'value': 'TASAE', 'label': 'TASAE', 'children': []}, {'value': 'TCBB', 'label': 'TCBB', 'children': []}, {'value': 'TGARS', 'label': 'TGARS', 'children': []}, {'value': 'TITS', 'label': 'TITS', 'children': []}, {'value': 'TMI', 'label': 'TMI', 'children': []}, {'value': 'TR', 'label': 'TR', 'children': []}, {'value': 'WWW', 'label': 'WWW', 'children': []}]}]}]
    this.selectedTag = [['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'ASPLOS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'DAC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'EUROSYS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'FAST'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'HPCA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'ISCA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'MICRO'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'SC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'USENIX'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TACO'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TCAD'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TOCS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TOS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A刊', 'TPDS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'CGO'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'CLUSTER'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'DATE'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'FPGA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'ICCAD'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'ICCD'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'ICDCS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'PODC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'SPAA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'A会', 'PPoPP'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'CODES+ISSS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'HiPEAC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'HOT CHIPS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B会', 'SoCC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'JPDC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'JSA'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'PC'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'PE'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TAAS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TECS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TODAES'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TRETS'], ['1.计算机体系结构、并行与分布计算、存储系统', 'B刊', 'TVLSI']],
    this.homepage = false
    if (this.show_1 === true) {
      this.activeIndex = '1'
    } else {
      this.activeIndex = '2'
    }
  }
}
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
}

.card-item {
  width: 15%;
  margin-bottom: 25px;
  margin-right: 20px;
}

.card-info {
  margin-bottom: 5px;
}

/*.card-item:hover {*/
/*  box-shadow: 0 0 10px rgba(0,0,0,0.4);*/
/*}*/
</style>