<template>
    <div class="head-nav">
        <el-row>
            <!--左侧图标-->
            <el-col :span="6" class='logo-container'>
                <img src="../assets/logo.png" class='logo' alt="">
                <span class='title'>后台管理系统</span>
            </el-col>
            <!--右侧登录-->
            <el-col :span="6" class="user">
                <div class="userinfo">
                    <img :src="user.avatar" alt="" class="avatar">
                    <div class="welcome">
                        <p class="name comename">欢迎</p>
                        <p class="name avatarname">{{user.name}}</p>
                    </div>
                    <span class="username">
                        <!--下拉菜单-->
                        <el-dropdown trigger="click" @command = 'setDialogInfo'>
                            <!--下拉菜单图标-->
                            <span class="el-dropdown-link">
                                 <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="info">个人信息</el-dropdown-item>
                                <el-dropdown-item command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "HeadNav",
        computed:{
            user(){
                return this.$store.getters.user
            }
        },
        methods:{
            setDialogInfo(cmditem){
                if(!cmditem){
                    console.log(test);
                    this.$message('菜单选项缺少command属性');
                    return;
                }
                switch (cmditem) {
                    case 'info':
                        this.showInfoList();
                        break;
                    case 'logout':
                        this.logout();
                        break;
                }
            },
            //个人信息
            showInfoList(){
                //跳转到个人信息页面
               this.$router.push('/InfoShow')
            },
            //退出
            logout(){
                //清除token
                localStorage.removeItem("fundsToken");
                this.$store.dispatch("clearCurrentState");

                //跳转到登录页面
                this.$router.push('/login')
            },
        }

    }
</script>

<style scoped>
    .head-nav {
        width: 100%;
        height: 60px;
        min-width: 600px;
        padding: 5px;
        background: #324057;
        color: #fff;
        border-bottom: 1px solid #1f2d3d;
    }
    .logo-container {
        line-height: 60px;
        min-width: 400px;
    }
    .logo {
        height: 50px;
        width: 50px;
        margin-right: 5px;
        vertical-align: middle;
        display: inline-block;
    }
    .title {
        vertical-align: middle;
        font-size: 22px;
        font-family: "Microsoft YaHei";
        letter-spacing: 3px;
    }
    .user {
        line-height: 60px;
        text-align: right;
        float: right;
        padding-right: 10px;
    }
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        vertical-align: middle;
        display: inline-block;
    }
    .welcome {
        display: inline-block;
        width: auto;
        vertical-align: middle;
        padding: 0 5px;
    }
    .name {
        line-height: 20px;
        text-align: center;
        font-size: 14px;
    }
    .comename {
        font-size: 12px;
    }
    .avatarname {
        color: #409eff;
        font-weight: bolder;
    }
    .username {
        cursor: pointer;
        margin-right: 5px;
    }
    .el-dropdown {
        color: #fff;
    }
</style>