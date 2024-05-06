<script setup lang="ts">
import {reactive,ref} from "vue";
import type { FormInstance,FormRules } from "element-plus";
import serverRequest from "../utils/request";
import userInfoStore from "@/stores/userInfo";

const registerForm = ref<FormInstance>();

const validatePasswordR = (rule: any, value: string, callback: Function) => {
    if (value === registerInfo.password) {
        callback();
    } else {
        callback(new Error("两次输入的密码不一致"));
    }
}

const registerFormRules = reactive<FormRules>({
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 20, message: "用户名长度在3-20个字符之间", trigger: "blur" },
    ],
    email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
    ],
    passwordR: [
        { required: true, message: "请重复密码", trigger: "blur" },
        { validator: validatePasswordR, trigger: "blur"}
    ],
    Tos: [
        { required: true, trigger: "change" },
    ],
    Notice: [
        { required: true, trigger: "change" },
    ],
})

interface RegisterInfo {
    username: string;
    email: string;
    password: string;
    passwordR: string;
    Tos: boolean;
    Notice: boolean;
}

const registerInfo = reactive<RegisterInfo>({
    username: '',
    email: '',
    password: '',
    passwordR: '',
    Tos: false,
    Notice: false,
})
const registerButton = reactive({
    status: true,
    text: '注册'
});

const allowRegister = () => registerButton.status = !(registerInfo.Tos && registerInfo.Notice)

function register(){
    
    if(!registerForm.value){
        return
    }

    if(!registerForm.value.validate()){
        return
    }

    const registerRequest = new serverRequest('POST', '/register', {
        username: registerInfo.username,
        email: registerInfo.email,
        password: registerInfo.password
    })
    
    registerRequest.success = () =>{
        const user = userInfoStore();
        const id = registerRequest.getData('id') as number;
        const username = registerRequest.getData('username') as string;
        const token = registerRequest.getData('token') as string;
        const expireTime = registerRequest.getData('expireTime') as number;
        const permission = registerRequest.getData('permission') as string;
        user.setUserInfo(id, username,token,expireTime,permission);
    }

    registerRequest.start()

}
</script>

<template>
    <div id="register-page">
        <div class="intro-box">
            <h4>TOGAPhotos</h4>
            <p>TOGAPhotos是一个由航空爱好者发起和维护的图库项目，我们诚挚的欢迎每一位新用户的到来，你们的支持是图库继续发展的最大动力。</p>
            <h4>有限的授权使用</h4>
            <p>TOGAPhotos <strong>可能在未事先通知您的情况下</strong>，将您上传的图片发布在TOGAPhotos的社交媒体账号上（遵循<a
                    href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-Hans">CC BY-NC-ND
                    4.0协议</a>）。其余情况下TOGAPhotos将在事前与您取得联系。</p>
            <h4>我们不接受"云图"</h4>
            <p>TOGAPhotos只接受用户自己拍摄的图片，<strong>不接受任何形式的"云图"</strong>。</p>
        </div>
        <div id="reg-form">
            <el-form ref="registerForm" label-position="top" :rules="registerFormRules" :model="registerInfo">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerInfo.username" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerInfo.email" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerInfo.password" show-password/>
                </el-form-item>
                <el-form-item label="重复密码" prop="passwordR">
                    <el-input v-model="registerInfo.passwordR" show-password/>
                </el-form-item>
                <el-form-item label="我已知悉：" prop="Tos">
                    <el-checkbox v-model="registerInfo.Tos" @change="allowRegister()">
                        TOGAPhotos用户协议
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="我确认：" prop="Notice">
                    <el-checkbox v-model="registerInfo.Notice" @change="allowRegister()">
                        TOGAPhotos只接受由本人拍摄的图片
                    </el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 80%;margin: 0 auto;" type="primary" :disabled="registerButton.status">
                        {{ registerButton.text }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
.intro-box h4 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
}

.intro-box p {
    font-size: 15px;
    text-indent: 2em;
    margin-bottom: 1em;
}

#register-page {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
#reg-form{
    background-color: rgba(0,0,0,0.1);
    padding: 25px 25px;
}
@media only screen and (min-width: 701px) {
    .intro-box{
        width: 40%;
        max-width: 35rem;
    }
    #reg-form{
        max-width: 500px;
        width: 55%;
        min-width: 300px;
    }
}

@media only screen and (max-width: 701px) {
    #reg-form{
       width: 100%;
    }
}

</style>
