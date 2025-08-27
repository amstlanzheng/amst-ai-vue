<template>
  <div id="userRegisterPage">
    <div class="login-container">
      <div class="login-form">
        <div class="login-header">
          <n-h1>用户注册</n-h1>
        </div>

        <n-card>
          <n-form ref="formRef" :model="model" :rules="rules">
            <n-form-item path="account" label="账号">
              <n-input
                v-model:value="model.userAccount"
                placeholder="请输入账号"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item path="password" label="密码">
              <n-input
                v-model:value="model.userPassword"
                type="password"
                placeholder="请输入密码"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item path="checkPassword" label="确认密码">
              <n-input
                v-model:value="model.checkPassword"
                type="password"
                placeholder="请输入密码"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item path="planetCode" label="邀请码">
              <n-input
                v-model:value="model.planetCode"

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
                  注册
                </n-button>
              </n-col>
              <n-col :span="24">
                <div class="form-footer">

                  <a href="#" class="footer-link" @click="handleLoginButtonClick">登录账号</a>
                </div>
              </n-col>
            </n-row>
          </n-form>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { userRegister } from "@/services/user";
import { useLoginUserStore } from "@/stores/useLoginUserStore";
import type { FormInst, FormItemInst, FormItemRule, FormRules } from "naive-ui";
import { useMessage } from "naive-ui";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

interface ModelType {
  userAccount: string | null;
  userPassword: string | null;
  checkPassword: string | null;
  planetCode: string | null;
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const modelRef = ref<ModelType>({
      userAccount: null,
      userPassword: null,
      checkPassword: null,
      planetCode: null,
    });

    function validatePasswordStartWith(
      rule: FormItemRule,
      value: string
    ): boolean {
      return (
        !!modelRef.value.userPassword &&
        modelRef.value.userPassword.startsWith(value) &&
        modelRef.value.userPassword.length >= value.length
      );
    }

    function validatePasswordSame(rule: FormItemRule, value: string): boolean {
      return value === modelRef.value.userPassword;
    }
    const router = useRouter();

    function handleLoginButtonClick() {
      router.push({
        path: "/user/login",
        replace: true,
      });
    }




    const rules: FormRules = {
      userAccount: [
        {
          required: true,
          message: "请输入账号",
          trigger: ["input"],
        },
      ],
      userPassword: [
        {
          required: true,
          message: "请输入密码",
          trigger: ["input"],
        },
      ],
      checkPassword: [
        {
          required: true,
          message: "请再次输入密码",
          trigger: ["input", "blur"],
        },
        {
          validator: validatePasswordStartWith,
          message: "两次密码输入不一致",
          trigger: "input",
        },
        {
          validator: validatePasswordSame,
          message: "两次密码输入不一致",
          trigger: ["blur", "password-input"],
        },
      ],
      planetCode: [
        {
          required: true,
          message: "请输入邀请码",
          trigger: ["input"],
        },
      ],
    };
    const useLoginUser = useLoginUserStore();

    const handleValidateButtonClick = async () => {
      const res = await userRegister(modelRef.value);
      console.log(res);
      if (res.data.code === 1) {
        await useLoginUser.getLoginUser();
        message.success("注册成功");
        router.push({
          path: "/user/login",
          replace: true,
        });
      } else {
        message.error("注册失败：" + res.data.description);
      }
    };

    return {
      formRef,
      model: modelRef,
      rules,
      handleValidateButtonClick,
      handleLoginButtonClick
    };
  },
});
</script>

<style scoped>
#userRegisterPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  width: 1200px;
  padding: 20px;
  background-color: linear-gradient(to right, #fefefe, #fff);
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
