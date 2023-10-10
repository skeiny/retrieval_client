<template>
  <el-container>
    <el-header>
      <!-- 导航栏 -->
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" style="font-size: large" @click="show_1=true">检索论文</el-menu-item>
<!--                <el-menu-item index="2" style="font-size: large" @click="show_1=false">分析关系</el-menu-item>-->
      </el-menu>
    </el-header>
    <!-- 检索论文 -->
    <el-container v-show="show_1">
      <!-- 参数输入 -->
      <el-aside style="height: 1200px; width: 550px">
        <!-- 搜索框 -->
        <el-card style="width: 500px;height: 500px;margin-top: 20px;margin-left: 25px">
          <p class="demonstration" style="margin-left: 10px">1. 输入关键词，多个关键词请以空格区分</p>
          <div style="">
            <el-input type="text" placeholder="请输入论文标题的关键词，以空格分隔" v-model="key_input"
                      style="width: 390px"></el-input>
            <el-button icon="el-icon-search" @click="searchPaper"></el-button>
          </div>
          <div>
            <p class="demonstration" style="margin-left: 10px">2. 选择开始年份、结束年份、近X期期刊</p>
            <div style="margin-top: 20px; display: flex;">
              <div style="margin-left: 0px">
                <el-select v-model="start_year" placeholder="开始年份" style="width: 120px">
                  <el-option
                      v-for="item in year_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <span>&nbsp;</span>
                <el-select v-model="final_year" placeholder="结束年份" style="width: 120px">
                  <el-option
                      v-for="item in year_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <span>&nbsp;</span>
                <el-select v-model="vols" placeholder="近X期" style="width: 100px">
                  <el-option
                      v-for="item in volume_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <p class="demonstration" style="margin-left: 10px">3. 选择会议/期刊</p>
            <el-cascader
                :collapse-tags="true"
                :options="options"
                :props="props"
                v-model="selectedTag"
                @change="handleCaChange"
                style="width: 450px;"
                clearable></el-cascader>
            <p class="demonstration" style="margin-left: 10px">4. 匹配模式</p>
            <div style="margin-top: 10px;margin-left: 10px">
              <el-radio v-model="match_pattern" label="1">包含任一关键词、不限制独立单词</el-radio>
              <el-radio v-model="match_pattern" label="2">包含任一关键词、限制独立单词</el-radio>
              <el-radio v-model="match_pattern" label="3">包含所有关键词、不限制独立单词</el-radio>
              <el-radio v-model="match_pattern" label="4">包含所有关键词、限制独立单词</el-radio>
            </div>

          </div>
        </el-card>
        <el-card style="width: 500px;height: 200px;margin-top: 10px;margin-left: 25px">
          <div>
            <p class="demonstration" style="margin-left: 10px">根据作者dblp_url查询</p>
            <div style="">
              <el-input type="text" placeholder="请输入作者主页的url" v-model="url_input"
                        style="width: 390px"></el-input>
              <el-button icon="el-icon-search" @click="get_people"></el-button>
            </div>
          </div>
        </el-card>

      </el-aside>
      <!-- 论文展示表格 -->
      <el-card style="margin-top: 20px;width: 1900px;height: 1150px">
        <el-button type="success" @click="exportExcel(table1Data)">导出为 Excel</el-button>
        <el-main style="height: 1050px;margin-top: 25px" v-show="show_paper_url">
          <el-table
              v-loading="table1_loading"
              element-loading-text="拼命检索中"
              :data="table1Data"
              style="width: 100%;margin-top: 10px;font-size: medium">
            <el-table-column :sortable=true
                             prop="id"
                             label="编号"
                             width="100">
            </el-table-column>
            <el-table-column :sortable=true
                             prop="authors"
                             label="作者"
                             width="650">
            </el-table-column>
            <el-table-column
                :sortable=true
                prop="conference_or_article"
                label="会议/期刊"
                width="150">
            </el-table-column>
            <el-table-column
                :sortable=true
                prop="year_or_volume"
                label="年份/卷号"
                width="150">
            </el-table-column>
            <el-table-column
                v-show="show_paper_url"
                :sortable=true
                prop="title"
                label="标题">
              <template v-slot="scope">
                <a :href="scope.row.paper_url" target="_blank">{{ scope.row.title }}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-main style="height: 1150px;margin-top: 25px" v-show="!show_paper_url">
          <el-table
              v-loading="table1_loading"
              element-loading-text="拼命检索中"
              :data="table1Data"
              style="width: 100%;margin-top: 10px;font-size: medium">
            <el-table-column :sortable=true
                             prop="id"
                             label="编号"
                             width="100">
            </el-table-column>
            <el-table-column :sortable=true
                             prop="authors"
                             label="作者"
                             width="650">
            </el-table-column>
            <el-table-column
                :sortable=true
                prop="year"
                label="年份/卷号"
                width="150">
            </el-table-column>
            <el-table-column
                :sortable=true
                prop="title"
                label="标题">
              <template v-slot="scope">
                <a :href="scope.row.doi" target="_blank">{{ scope.row.title }}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-card>


    </el-container>
    <!-- 分析关系 -->
    <el-container v-show="!show_1">
      <el-aside style="height: 1200px; width: 550px;margin-top: 10px">
        <el-card style="width: 500px;height: 200px;margin-top: 10px;margin-left: 25px">
          <p class="demonstration" style="margin-left: 10px">查询与作者相关的人物</p>
          <div>
            <el-input type="text" placeholder="请输入作者主页的url" v-model="root_url"
                      style="width: 400px"></el-input>
            <el-button icon="el-icon-search" @click="get"></el-button>
            <el-button type="success" @click="exportExcel(table2Data)" style="margin-top: 20px" v-show="showExport1">导出为
              Excel
            </el-button>
          </div>
        </el-card>
      </el-aside>
      <el-card style="margin-top: 20px;width: 1900px;height: 1150px">
        <el-main>
          <div class="card-container" style="height: 1100px" v-show="!homepage">
            <el-card v-for="item in table2Data" :key="item.name" class="card-item" shadow="hover">
              <div class="clearfix">
                <span>{{ item.name }}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="authorHome(item)">主页
                </el-button>
              </div>
              <div class="card-info">论文数量： {{ item.paper_count }}</div>
              <div class="card-info">合作者数量： {{ item.coauthor_count }}</div>
              <div class="card-info">导师： {{ item.tutor_name }}</div>
              <div class="card-info">首篇论文年份： {{ item.first_paper_year }}</div>
              <div class="card-info">是被查询人的： {{ item.relationship }}</div>
              <!--            <div class="card-info">分组： {{ item.group }}</div>-->
            </el-card>
          </div>
          <el-main style="height: 1150px;margin-top: 25px" v-show="homepage">
            <el-button icon="el-icon-back" @click="fff"></el-button>
            <el-button type="success" @click="exportExcel(table3Data)">导出为 Excel</el-button>
            <el-table
                v-loading="table1_loading"
                element-loading-text="拼命检索中"
                :data="table3Data"
                style="width: 100%;margin-top: 10px;font-size: medium">
              <el-table-column :sortable=true
                               prop="id"
                               label="编号"
                               width="100">
              </el-table-column>
              <el-table-column :sortable=true
                               prop="authors"
                               label="作者"
                               width="650">
              </el-table-column>
              <el-table-column
                  :sortable=true
                  prop="year"
                  label="年份/卷号"
                  width="150">
              </el-table-column>
              <el-table-column
                  :sortable=true
                  prop="title"
                  label="标题">
                <template v-slot="scope">
                  <a :href="scope.row.doi" target="_blank">{{ scope.row.title }}</a>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-main>
      </el-card>

    </el-container>


  </el-container>
</template>

<script>
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
  data() {
    return {
      props: {multiple: true},
      selectedTag: [],
      options: [
              {
        'value': '1.计算机体系结构、并行与分布计算、存储系统',
        'label': '1.计算机体系结构、并行与分布计算、存储系统',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'ASPLOS', 'label': 'ASPLOS'}, {'value': 'DAC', 'label': 'DAC'}, {
            'value': 'EUROSYS',
            'label': 'EUROSYS'
          }, {'value': 'FAST', 'label': 'FAST'}, {'value': 'HPCA', 'label': 'HPCA'}, {
            'value': 'ISCA',
            'label': 'ISCA'
          }, {'value': 'MICRO', 'label': 'MICRO'}, {'value': 'PPOPP', 'label': 'PPOPP'}, {
            'value': 'SC',
            'label': 'SC'
          }, {'value': 'USENIX', 'label': 'USENIX'}]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'TACO', 'label': 'TACO'}, {'value': 'TC', 'label': 'TC'}, {
            'value': 'TCAD',
            'label': 'TCAD'
          }, {'value': 'TOCS', 'label': 'TOCS'}, {'value': 'TOS', 'label': 'TOS'}, {'value': 'TPDS', 'label': 'TPDS'}]
        }, {
          'value': 'B会',
          'label': 'B会',
          'children': [{'value': 'CGO', 'label': 'CGO'}, {'value': 'CLOUD', 'label': 'CLOUD'}, {
            'value': 'CLUSTER',
            'label': 'CLUSTER'
          }, {'value': 'CODESISSS', 'label': 'CODESISSS'}, {'value': 'DATE', 'label': 'DATE'}, {
            'value': 'FPGA',
            'label': 'FPGA'
          }, {'value': 'HIPEAC', 'label': 'HIPEAC'}, {'value': 'HOTCHIPS', 'label': 'HOTCHIPS'}, {
            'value': 'ICCAD',
            'label': 'ICCAD'
          }, {'value': 'ICCD', 'label': 'ICCD'}, {'value': 'ICDCS', 'label': 'ICDCS'}, {
            'value': 'PODC',
            'label': 'PODC'
          }, {'value': 'SPAA', 'label': 'SPAA'}]
        }]
      },  {
        'value': '2.计算机网络',
        'label': '2.计算机网络',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'INFOCOM', 'label': 'INFOCOM'}, {
            'value': 'MOBICOM',
            'label': 'MOBICOM'
          }, {'value': 'NSDI', 'label': 'NSDI'}, {'value': 'SIGCOMM', 'label': 'SIGCOMM'}]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'JSAC', 'label': 'JSAC'}, {'value': 'TMC', 'label': 'TMC'}, {
            'value': 'TON',
            'label': 'TON'
          }]
        }]
      }, {
        'value': '3.网络与信息安全',
        'label': '3.网络与信息安全',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'CCS', 'label': 'CCS'}, {'value': 'CRYPTO', 'label': 'CRYPTO'}, {
            'value': 'EUROCRYPT',
            'label': 'EUROCRYPT'
          }, {'value': 'NDSS', 'label': 'NDSS'}, {'value': 'SP', 'label': 'SP'}, {'value': 'USS', 'label': 'USS'}]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'JOC', 'label': 'JOC'}, {'value': 'TDSC', 'label': 'TDSC'}, {
            'value': 'TIFS',
            'label': 'TIFS'
          }]
        }]
      }, {
        'value': '4.软件工程、系统软件、程序设计语言',
        'label': '4.软件工程、系统软件、程序设计语言',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'ICSE', 'label': 'ICSE'}, {'value': 'ISSTA', 'label': 'ISSTA'}, {
            'value': 'KBSE',
            'label': 'KBSE'
          }, {'value': 'OOPSLA', 'label': 'OOPSLA'}, {'value': 'OSDI', 'label': 'OSDI'}, {
            'value': 'PLDI',
            'label': 'PLDI'
          }, {'value': 'POPL', 'label': 'POPL'}, {'value': 'SIGSOFT', 'label': 'SIGSOFT'}, {
            'value': 'SOSP',
            'label': 'SOSP'
          }]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'TOPLAS', 'label': 'TOPLAS'}, {'value': 'TOSEM', 'label': 'TOSEM'}, {
            'value': 'TSC',
            'label': 'TSC'
          }, {'value': 'TSE', 'label': 'TSE'}]
        }]
      }, {
        'value': '5.数据库、数据挖掘、内容检索',
        'label': '5.数据库、数据挖掘、内容检索',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'ICDE', 'label': 'ICDE'}, {'value': 'KDD', 'label': 'KDD'}, {
            'value': 'SIGIR',
            'label': 'SIGIR'
          }, {'value': 'SIGMOD', 'label': 'SIGMOD'}, {'value': 'VLDB', 'label': 'VLDB'}]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'TKDE', 'label': 'TKDE'}, {'value': 'TODS', 'label': 'TODS'}, {
            'value': 'TOIS',
            'label': 'TOIS'
          }, {'value': 'VLDB', 'label': 'VLDB'}]
        }]
      }, {
        'value': '6.计算机科学理论',
        'label': '6.计算机科学理论',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'CAV', 'label': 'CAV'}, {'value': 'FOCS', 'label': 'FOCS'}, {
            'value': 'LICS',
            'label': 'LICS'
          }, {'value': 'SODA', 'label': 'SODA'}, {'value': 'STOC', 'label': 'STOC'}]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'IANDC', 'label': 'IANDC'}, {
            'value': 'SIAMCOMP',
            'label': 'SIAMCOMP'
          }, {'value': 'TIT', 'label': 'TIT'}]
        }]
      }, {
        'value': '7.计算机图形学与多媒体',
        'label': '7.计算机图形学与多媒体',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'MM', 'label': 'MM'}, {
            'value': 'SIGGRAPH',
            'label': 'SIGGRAPH'
          }, {'value': 'VISUALIZATION', 'label': 'VISUALIZATION'}, {'value': 'VR', 'label': 'VR'}]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'TIP', 'label': 'TIP'}, {'value': 'TOG', 'label': 'TOG'}, {
            'value': 'TVCG',
            'label': 'TVCG'
          }]
        }]
      }, {
        'value': '8.人工智能',
        'label': '8.人工智能',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'AAAI', 'label': 'AAAI'}, {'value': 'ACL', 'label': 'ACL'}, {
            'value': 'CVPR',
            'label': 'CVPR'
          }, {'value': 'ICCV', 'label': 'ICCV'}, {'value': 'ICML', 'label': 'ICML'}, {
            'value': 'IJCAI',
            'label': 'IJCAI'
          }, {'value': 'NIPS', 'label': 'NIPS'}]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'AI', 'label': 'AI'}, {'value': 'IJCV', 'label': 'IJCV'}, {
            'value': 'JMLR',
            'label': 'JMLR'
          }, {'value': 'PAMI', 'label': 'PAMI'}]
        }]
      }, {
        'value': '9.人机交互与普适计算',
        'label': '9.人机交互与普适计算',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'CHI', 'label': 'CHI'}, {'value': 'CSCW', 'label': 'CSCW'}, {
            'value': 'HUC',
            'label': 'HUC'
          }, {'value': 'UIST', 'label': 'UIST'}]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'IJMMS', 'label': 'IJMMS'}, {'value': 'TOCHI', 'label': 'TOCHI'}]
        },]
      },{
        'value': '10.交叉、综合、新兴',
        'label': '10.交叉、综合、新兴',
        'children': [{
          'value': 'A会',
          'label': 'A会',
          'children': [{'value': 'RTSS', 'label': 'RTSS'}, {'value': 'WINE', 'label': 'WINE'}, {
            'value': 'WWW',
            'label': 'WWW'
          }]
        }, {
          'value': 'A刊',
          'label': 'A刊',
          'children': [{'value': 'CHINAF', 'label': 'CHINAF'}, {'value': 'JACM', 'label': 'JACM'}, {
            'value': 'PIEEE',
            'label': 'PIEEE'
          }]
        }]
      },]

      //         [{'value': '人工智能论文库', 'label': '人工智能论文库', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'AAAI', 'label': 'AAAI'}, {'value': 'ACL', 'label': 'ACL'}, {'value': 'CVPR', 'label': 'CVPR'}, {'value': 'ICCV', 'label': 'ICCV'}, {'value': 'ICML', 'label': 'ICML'}, {'value': 'IJCAI', 'label': 'IJCAI'}, {'value': 'NIPS', 'label': 'NIPS'}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'AI', 'label': 'AI'}, {'value': 'IJCV', 'label': 'IJCV'}, {'value': 'JMLR', 'label': 'JMLR'}, {'value': 'PAMI', 'label': 'PAMI'}]}]}, {'value': '体系结构论文库', 'label': '体系结构论文库', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'ASPLOS', 'label': 'ASPLOS'}, {'value': 'DAC', 'label': 'DAC'}, {'value': 'EUROSYS', 'label': 'EUROSYS'}, {'value': 'FAST', 'label': 'FAST'}, {'value': 'HPCA', 'label': 'HPCA'}, {'value': 'ISCA', 'label': 'ISCA'}, {'value': 'MICRO', 'label': 'MICRO'}, {'value': 'PPOPP', 'label': 'PPOPP'}, {'value': 'SC', 'label': 'SC'}, {'value': 'USENIX', 'label': 'USENIX'}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'TACO', 'label': 'TACO'}, {'value': 'TC', 'label': 'TC'}, {'value': 'TCAD', 'label': 'TCAD'}, {'value': 'TOCS', 'label': 'TOCS'}, {'value': 'TOS', 'label': 'TOS'}, {'value': 'TPDS', 'label': 'TPDS'}]}, {'value': 'B会', 'label': 'B会', 'children': [{'value': 'CGO', 'label': 'CGO'}, {'value': 'CLOUD', 'label': 'CLOUD'}, {'value': 'CLUSTER', 'label': 'CLUSTER'}, {'value': 'CODESISSS', 'label': 'CODESISSS'}, {'value': 'DATE', 'label': 'DATE'}, {'value': 'EUROPAR', 'label': 'EUROPAR'}, {'value': 'FPGA', 'label': 'FPGA'}, {'value': 'HIPEAC', 'label': 'HIPEAC'}, {'value': 'HOTCHIPS', 'label': 'HOTCHIPS'}, {'value': 'HPDC', 'label': 'HPDC'}, {'value': 'ICCAD', 'label': 'ICCAD'}, {'value': 'ICCD', 'label': 'ICCD'}, {'value': 'ICDCS', 'label': 'ICDCS'}, {'value': 'ICPP', 'label': 'ICPP'}, {'value': 'ICS', 'label': 'ICS'}, {'value': 'IEEEPACT', 'label': 'IEEEPACT'}, {'value': 'IPPS', 'label': 'IPPS'}, {'value': 'ITC', 'label': 'ITC'}, {'value': 'LISA', 'label': 'LISA'}, {'value': 'MSS', 'label': 'MSS'}, {'value': 'PERFORMANCE', 'label': 'PERFORMANCE'}, {'value': 'PODC', 'label': 'PODC'}, {'value': 'RTAS', 'label': 'RTAS'}, {'value': 'SIGMETRICS', 'label': 'SIGMETRICS'}, {'value': 'SPAA', 'label': 'SPAA'}, {'value': 'VEE', 'label': 'VEE'}]}]}, {'value': '数据库、数据挖掘、内容检索论文库', 'label': '数据库、数据挖掘、内容检索论文库', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'ICDE', 'label': 'ICDE'}, {'value': 'KDD', 'label': 'KDD'}, {'value': 'SIGIR', 'label': 'SIGIR'}, {'value': 'SIGMOD', 'label': 'SIGMOD'}, {'value': 'VLDB', 'label': 'VLDB'}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'TKDE', 'label': 'TKDE'}, {'value': 'TODS', 'label': 'TODS'}, {'value': 'TOIS', 'label': 'TOIS'}, {'value': 'VLDB', 'label': 'VLDB'}]}]}, {'value': '网络与信息安全论文库', 'label': '网络与信息安全论文库', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'CCS', 'label': 'CCS'}, {'value': 'CRYPTO', 'label': 'CRYPTO'}, {'value': 'EUROCRYPT', 'label': 'EUROCRYPT'}, {'value': 'NDSS', 'label': 'NDSS'}, {'value': 'SP', 'label': 'SP'}, {'value': 'USS', 'label': 'USS'}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'JOC', 'label': 'JOC'}, {'value': 'TDSC', 'label': 'TDSC'}, {'value': 'TIFS', 'label': 'TIFS'}]}]}, {'value': '计算机图形学与多媒体论文库', 'label': '计算机图形学与多媒体论文库', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'MM', 'label': 'MM'}, {'value': 'VISUALIZATION', 'label': 'VISUALIZATION'}, {'value': 'VR', 'label': 'VR'}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'TIP', 'label': 'TIP'}, {'value': 'TOG', 'label': 'TOG'}, {'value': 'TVCG', 'label': 'TVCG'}]}]}, {'value': '计算机网络论文库', 'label': '计算机网络论文库', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'INFOCOM', 'label': 'INFOCOM'}, {'value': 'MOBICOM', 'label': 'MOBICOM'}, {'value': 'NSDI', 'label': 'NSDI'}, {'value': 'SIGCOMM', 'label': 'SIGCOMM'}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'JSAC', 'label': 'JSAC'}, {'value': 'TMC', 'label': 'TMC'}, {'value': 'TON', 'label': 'TON'}]}]}, {'value': '软件工程、系统软件、程序设计语言论文库', 'label': '软件工程、系统软件、程序设计语言论文库', 'children': [{'value': 'A会', 'label': 'A会', 'children': [{'value': 'ICSE', 'label': 'ICSE'}, {'value': 'ISSTA', 'label': 'ISSTA'}, {'value': 'KBSE', 'label': 'KBSE'}, {'value': 'OOPSLA', 'label': 'OOPSLA'}, {'value': 'OSDI', 'label': 'OSDI'}, {'value': 'PLDI', 'label': 'PLDI'}, {'value': 'POPL', 'label': 'POPL'}, {'value': 'SIGSOFT', 'label': 'SIGSOFT'}, {'value': 'SOSP', 'label': 'SOSP'}]}, {'value': 'A刊', 'label': 'A刊', 'children': [{'value': 'TOPLAS', 'label': 'TOPLAS'}, {'value': 'TOSEM', 'label': 'TOSEM'}, {'value': 'TSC', 'label': 'TSC'}, {'value': 'TSE', 'label': 'TSE'}]}]}]
      ,

      show_1: true,

      activeIndex: '1',

      year_options: [],
      start_year: '2018',
      final_year: '2023',

      volume_options: [],
      vols: '5',

      key_input: '',

      url_input: '',//'https://dblp.uni-trier.de/pid/332/3372.html',

      table1Data: [],
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

  methods: {
    fff(){
      this.homepage=false;
      this.showExport1=true
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
      console.log(this.conference_option)
      this.table1_loading = true
      axios({
        method: 'post',
        url: 'http://172.31.225.109:5000/search',
        data: {
          key_words: this.key_input,
          conference_list: this.conference_option,
          journal_list: this.journal_option,
          start_year: this.start_year,
          final_year: this.final_year,
          vols: this.vols,
          cj_list: this.selectedTag,
          match_pattern: this.match_pattern
        }
      }).then((res) => {
        console.log(res.data)
        this.table1Data = res.data
      }).catch(() => {
        this.$message("数据异常，请重试")
      }).finally(() => {
        this.table1_loading = false
      })
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
    for (let i = 2023; i >= 2000; i--) {
      this.year_options.push({
        value: i.toString(),
        label: i.toString()
      });
    }

    for (let i = 10; i >= 0; i--) {
      this.volume_options.push({
        value: i.toString(),
        label: i.toString()
      });
    }

    this.homepage = false
    if (this.show_1 === true) {
      this.activeIndex = '1'
    } else {
      this.activeIndex = '2'
    }
  },

  created() {

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