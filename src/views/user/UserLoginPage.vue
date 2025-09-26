<template>
  <div id="userLoginPage">
    <div class="login-container">
      <div class="login-form">
        <div class="login-header">
          <n-h1>用户登录</n-h1>
        </div>
        
        <n-card>
          <n-form ref="formRef" :model="modelRef" :rules="rules">
            <n-form-item path="account" label="账号">
              <n-input 
                v-model:value="modelRef.userAccount" 
                placeholder="请输入账号"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item path="password" label="密码">
              <n-input
                v-model:value="modelRef.userPassword"
                type="password"
                placeholder="请输入密码"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-row :gutter="[0, 16]">
              <n-col :span="24">
                <n-button
                  block
                  type="primary"
                  @click="handleValidateButtonClick"
                >
                  登录
                </n-button>
              </n-col>
              <n-col :span="24">
                <div class="form-footer">
                  <a href="#" class="footer-link">忘记密码?</a>
                  <a href="#" class="footer-link" @click="handleRegisterButtonClick">注册账号</a>
                </div>
              </n-col>
            </n-row>
          </n-form>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userLogin } from "@/services/user";
import { useLoginUserStore } from "@/stores/useLoginUserStore";
import type { FormInst, FormRules } from "naive-ui";
import { useMessage } from "naive-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface ModelType {
  userAccount: string;
  userPassword: string;
}

const formRef = ref<FormInst | null>(null);
const message = useMessage();
const modelRef = ref<ModelType>({
  userAccount: "",
  userPassword: "",
});

const router = useRouter();

const handleRegisterButtonClick = () => {
  router.push({ 
    path: "/user/register" ,
    replace: true
  });
}

const rules: FormRules = {
  userAccount: [
    {
      required: true,
      message: "请输入账号",
      trigger: ["input"],
    },
    {
      min: 4,
      max: 20,
      message: "请输入4-20位账号",
      trigger: ["input"],
    },
  ],
  userPassword: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["input"],
    },
    {
      min: 6,
      max: 20,
      message: "请输入6-20位密码",
      trigger: ["input"],
    },
  ],
};

const useLoginUser = useLoginUserStore();

const handleValidateButtonClick = async() => {
  const res = await userLogin(modelRef.value);
  console.log(res);
  if (res.data.code === 1) {
    await useLoginUser.getLoginUser();
    message.success("登录成功");
    router.push({ 
      path: "/home" ,
      replace: true
    });
  } else {
    message.error("登录失败：" + res.data.description);
  }
}


</script>

<style scoped>
#userLoginPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  width: 1200px;
  padding: 20px;
  background-color: linear-gradient(to right, #fefefe, #fff) 
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 0.95rem;
}

:deep(.n-card) {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

:deep(.n-form-item) {
  margin-bottom: 20px;
}

:deep(.n-form-item-label) {
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
}

:deep(.n-button) {
  height: 38px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  #userLoginPage {
    padding: 15px;
  }
  
  .login-container {
    max-width: 100%;
  }
}
</style>