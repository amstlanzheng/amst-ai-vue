<template>
  <n-radio-group
    v-model:value="size"
    name="top-size"
    style="margin-bottom: 12px"
  >
  </n-radio-group>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    :size="size"
    label-placement="top"
  >
    <n-grid :cols="24" :x-gap="24">
      <n-form-item-gi :span="12" label="用户名" path="inputValue">
        <n-input v-model:value="model.username" placeholder="Input" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="账号" path="inputValue">
        <n-input v-model:value="model.userAccount" placeholder="Input" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="密码" path="inputValue">
        <n-input
          v-model:value="model.userPassword"
          placeholder="Input"
          type="password"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="电话" path="inputValue">
        <n-input v-model:value="model.phone" placeholder="Input" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="邮箱" path="inputValue">
        <n-input v-model:value="model.email" placeholder="Input" />
      </n-form-item-gi>

      <n-form-item-gi :span="12" label="性别" path="radioGroupValue">
        <n-radio-group v-model:value="model.gender" name="radiogroup1">
          <n-space>
            <n-radio value="1"> 男 </n-radio>
            <n-radio value="0"> 女 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>

      <n-form-item-gi :span="12" label="角色" path="radioGroupValue">
        <n-radio-group v-model:value="model.userRole" name="radiogroup1">
          <n-space>
            <n-radio value="1"> 管理员 </n-radio>
            <n-radio value="0"> 普通用户 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>

      <n-gi :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            round
            type="primary"
            @click="handleValidateButtonClick"
            style="margin-right: 10px"
          >
            更新
          </n-button>
          <n-button round @click="handleCancel"> 取消 </n-button>
        </div>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { userUpdate } from "@/services/user";
import type { FormInst, FormRules } from "naive-ui";
import { useMessage } from "naive-ui";
import { ref, watch } from "vue";

interface Props {
  userData: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  updateSuccess: [];
  cancel: [];
}>();
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const model = ref({
  id: "",
  username: "",
  userAccount: "",
  userPassword: "",
  checkPassword: "",
  phone: "",
  email: "",
  planetCode: "",
  gender: "",
  userRole: "",
});

// 监听userData的变化，当有数据传入时更新表单
watch(
  () => props.userData,
  (newUserData) => {
    console.log("newUserData:", newUserData);
    if (newUserData) {
      model.value = {
        id: newUserData.id || "",
        username: newUserData.username || "",
        userAccount: newUserData.userAccount || "",
        userPassword: "", // 密码通常不从现有数据中获取
        checkPassword: "",
        phone: newUserData.phone || "",
        email: newUserData.email || "",
        planetCode: newUserData.planetCode || "",
        gender: newUserData.gender || "",
        userRole: newUserData.userRole || "",
      };
    }
  },
  { immediate: true }
);

    const rules: FormRules = {
      username: [
        {
          required: false,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      userAccount: [
        {
          required: true,
          message: "请输入账号",
          trigger: "blur",
        },
      ],
      userPassword: [
        {
          required: false,
          message: "请输入密码",
          trigger: "blur",
        },
      ],
    };

    const handleCancel = () => {
      // 发送事件通知父组件关闭模态框
      emit("cancel");
    };
const size = ref("medium");

const handleValidateButtonClick = () => {
  userUpdate(model.value).then((res) => {
    if (res.data.code === 1) {
      message.success("更新成功");
      emit("updateSuccess");
    } else {
      message.error(res.data.description);
    }
  });
};
</script>
