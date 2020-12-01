import Vue from 'vue'
import { Button,Form,FormItem,Input,Message, Container,Header,Aside,Main,Menu,Submenu,MenuItem,
    MenuItemGroup, Breadcrumb, BreadcrumbItem, Card, Row, Col,Table,TableColumn,Switch,
    Tooltip,Pagination, Dialog, MessageBox,Tag,Tree} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
// 进行全局挂载：
// 把弹框组件挂着到了 vue 的原型对象上，这样每一个组件都可以直接通过 this 访问
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm