import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'
const app = createApp(App)
for (let iconName in ElIconModules){
    app.component(iconName, ElIconModules[iconName])
}

app.use(ElementPlus)
app.mount('#app')

