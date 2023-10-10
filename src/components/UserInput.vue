<template>
  <el-aside id="aside">
    <el-card id="aside-card">
        <h3 style="margin-left: 10px">Input the words included in the title.</h3>
        <div>
          <el-input style="width: 390px" type="text" placeholder="Input words separated by spaces" v-model="key_input"/>
          <el-button @click="retrieve">
            Go
<!--            <el-icon class="el-icon-search"></el-icon>-->
          </el-button>
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
  </el-aside>
</template>

<script>
import "@/css/userinput.css"

export default {
  name: "UserInput",
  data(){
    return{
      key_input: '',
      start_year: '2018',
      final_year: '2023',
      year_options: [],
      volume_options: [],
      vols: '5',
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
        },],
      props: {multiple: true},
      selectedTag: [],
      match_pattern: '1',
    }
  },
  methods:{
    retrieve() {
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
      this.$http({
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
  },

}
</script>

<style scoped>

</style>