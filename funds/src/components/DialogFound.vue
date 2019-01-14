<template>
    <div class="logFund">
        <el-dialog :title="dialog.title"
                   :visible.sync="dialog.show"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
                   :modal-append-to-body="false">
            <div class="form">
                <el-form :model="form"
                         ref="form"
                         :rules="form_rules"
                         label-width="120px"
                         style="margin:10px;width:auto;">
                    <el-form-item label="收支类型:" >
                        <el-select v-model="form.type" placeholder="收支类型">
                            <el-option
                                    v-for="(formtype, index) in format_type_list"
                                    :key="index"
                                    :label="formtype" :value="formtype"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop='describe' label="收支描述:">
                        <el-input type="describe" v-model="form.describe"></el-input>
                    </el-form-item>

                    <el-form-item prop='income'  label="收入:">
                        <el-input type="income" v-model="form.income"></el-input>
                    </el-form-item>

                    <el-form-item prop='expend' label="支出:">
                        <el-input type="expend" v-model="form.expend"></el-input>
                    </el-form-item>

                    <el-form-item prop='cash' label="账户现金:">
                        <el-input type="cash" v-model="form.cash"></el-input>
                    </el-form-item>

                    <el-form-item label="备注:">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="dialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DialogFound",
        props:{
            dialog:Object,
            form:Object
        },
        data(){
            return{
                format_type_list:[
                    "提现",
                    "提现手续费",
                    "充值",
                    "优惠券",
                    "充值礼券",
                    "转账"
                ],
                form_rules: {
                    describe: [
                        { required: true, message: "收支描述不能为空！", trigger: "blur" }
                    ],
                    income: [
                        { required: true, message: "收入不能为空！", trigger: "blur" }
                    ],
                    expend: [
                        { required: true, message: "支出不能为空！", trigger: "blur" }
                    ],
                    cash: [{ required: true, message: "账户不能为空！", trigger: "blur" }]
                }
            }
        },
        methods:{
            onSubmit(form){
                //遍历表格数据
              this.$refs[form].validate(valid =>{
                  if(valid){
                      //添加数据接口
                      //判断编辑和添加类型
                      const url =
                          this.dialog.option == "add" ? "add" : `edit/${this.form.id}`;
                      this.$axios.post(`/api/profiles/${url}`, this.form)
                          .then(res =>{
                              //添加成功窗口调用
                              this.$message({
                                  message:"数据添加成功",
                                  type:"success"
                              });
                              //隐藏dialog窗口
                              this.dialog.show = false
                              this.$emit('update')
                          })
                  }
              })
            },
        }
    }
</script>

<style scoped>

</style>