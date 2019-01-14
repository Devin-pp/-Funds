<template>
    <div class="fillcontain">
        <el-form :inline="true"
                 :model="search_data"
                 ref="search_data">
            <el-form-item label="投标时间筛选">
                <el-date-picker
                        v-model="search_data.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                </el-date-picker> --
                <el-date-picker
                        v-model="search_data.endTime"
                        type="datetime"
                        placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size ="small" icon="search" @click='onScreeoutMoney()'>筛选</el-button>
            </el-form-item>
            <el-form-item class="btnRight">
                <el-button type="primary"
                           size="small"
                           @click="handleAdd"
                           icon="view">
                    添加
                </el-button>
            </el-form-item>
        </el-form>

        <!--表格-->
        <div class="table_container">
            <el-table
                    v-if="tableData.length > 0"
                    :data='tableData'
                    max-height="450"
                    border
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="序号"
                        align='center'
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="date"
                        label="创建时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="收支类型"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="describe"
                        label="收支描述"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="income"
                        label="收入"
                        align='center'
                        width="170">
                    <template slot-scope="scope">
                        <span style="color:#00d053">+ {{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="expend"
                        label="支出"
                        align='center'
                        width="170">
                    <template slot-scope="scope">
                        <span style="color:#f56767">- {{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="cash"
                        label="账户现金"
                        align='center'
                        width="170">
                    <template slot-scope="scope">
                        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="320">
                    <template slot-scope='scope'>
                        <el-button
                                type="warning"
                                icon='edit'
                                size="small"
                                @click='onEditMoney(scope.row)'
                        >编辑</el-button>
                        <el-button
                                type="danger"
                                icon='delete'
                                size="small"
                                @click='onDeleteMoney(scope.row,scope.$index)'
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-row :span="24">
                <div class="pagination">
                  <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="paginations.currentPage"
                        :page-sizes="paginations.page_sizes"
                        :page-size="paginations.page_size"
                        :layout="paginations.layout"
                        :total="paginations.total">
                </el-pagination>
                </div>
            </el-row>

        </div>

        <!--弹窗-->
        <DialogFound :dialog="dialog" :form="form" @update="getProfile"></DialogFound>
    </div>
</template>

<script>
    import DialogFound from '../components/DialogFound'
    export default {
        name: "FundsList",
        components:{
          DialogFound,
        },
        data(){
            return{
                tableData: [],
                allTableData:[],
                filterTableData: [],
                search_data: {
                    startTime: "",
                    endTime: ""
                },
                dialog: {
                    show: false,
                    title: "",
                    option: "edit"
                },
                form: {
                    type: "",
                    describe: "",
                    income: "",
                    expend: "",
                    cash: "",
                    remark: "",
                    id: ""
                },
                paginations:{
                    currentPage: 1, // 当前页数，支持 .sync 修饰符
                    page_size:  5,  //每页显示条目个数，支持 .sync 修饰符
                    page_sizes: [5, 10, 15, 20], //每页显示个数选择器的选项设置
                    layout:"total, sizes, prev, pager, next, jumper",//组件布局，子组件名用逗号分隔
                    total:0, //	总条目数
                }
            }
        },
        created(){
            this.getProfile();
        },
        methods:{
            //获取表格数据
            getProfile(){
                this.$axios.get('/api/profiles').then(res =>{
                    //储存分页过滤的数据
                    this.allTableData = res.data;
                    //储存过滤用的数据
                    this.filterTableData = res.data;
                    // 调用分页数据
                    this.setpage();
                    this.setTime();
                })
            },
            //设置分页数据
            setpage(){
                //总数
                this.paginations.total = this.allTableData.length;
                this.paginations.currentPage = 1;
                this.paginations.page_size = 5;
                // 设置默认分页数据
                this.tableData = this.allTableData.filter((item,index) =>{
                    return index < this.paginations.page_size
                })
            },
            //新增数据
            handleAdd(){
                this.dialog = {
                    show: true,
                    title: "添加资金信息",
                    option:"add",
                };
                this.form = {
                    type: "",
                    describe: "",
                    income: "",
                    expend: "",
                    cash: "",
                    remark: "",
                    id: ""
                };
            },
            //编辑数据
            onEditMoney(row){
                this.dialog = {
                    show:true,
                    title:"修改资金信息",
                    option:"edit"
                };
                this.form = {
                    type:row.type,
                    describe:row.describe,
                    income:row.income,
                    expend:row.expend,
                    cash:row.cash,
                    remark:row.remark,
                    id:row._id,
                }
                console.log(this.form);
            },
            //删除数据
            onDeleteMoney(row,index){
                this.$axios.delete(`/api/profiles/delete/${row._id}`)
                    .then(res =>{
                        this.$message({
                            message:'删除成功！'
                        });
                        this.getProfile();
                    })

            },
            // 切换size
            handleSizeChange(page_size) {
                this.paginations.currentPage = 1;
                this.paginations.page_size = page_size;
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < page_size;
                });
            },
            // 切换当前页数
            handleCurrentChange(page) {
                // 当前页数的总数
                let sortnum = this.paginations.page_size * (page - 1);
                //截止当前的数据
                let table = this.allTableData.filter((item, index) => {
                    return index >= sortnum;
                });
                // 设置默认分页数据
                this.tableData = table.filter((item, index) => {
                    return index < this.paginations.page_size;
                });
            },
            //时间筛选功能
            onScreeoutMoney(){
                //判断是否选择时间
                if(!this.search_data.startTime || !this.search_data.endTime){
                    this.$message({
                        type: "warning",
                        message: "请选择时间区间"
                    });
                    this.getProfile();
                    return;
                }

                //获取选择的时间
                const stime = this.search_data.startTime.getTime();
                const etime = this.search_data.endTime.getTime();

                //过滤数据
                this.allTableData = this.filterTableData.filter(item =>{
                    //获取当前数据的时间
                    let date = new Date(item.date);
                    let time = date.getTime();
                    // 返回过滤成功的数据
                    return time >= stime && time <= etime;
                });
                // 再次调用分页系统
                this.setpage();
            },
            //设置时间
            setTime(){
               this.allTableData.filter(item =>{
                   let date = item.date;
                   let time = date.split('T')[1];
                   let year = date.split('T')[0];
                   let hour = time.split(':')[0];
                   let second = time.split(':')[1];
                   let nowDate = year + " " + hour + ":" + second;
                   item.date = nowDate
               })
            }
        }
    }
</script>

<style scoped>
    .fillcontain {
        width: 100%;
        height: 100%;
        padding: 16px;
        box-sizing: border-box;
    }
    .btnRight {
        float: right;
    }
    .pagination {
        text-align: right;
        margin-top: 10px;
    }
</style>