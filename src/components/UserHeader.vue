<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-gradient-text type="info" class="user-header-text"> 你好，尊敬的用户</n-gradient-text>
  </n-dropdown>
</template>

<script setup lang="ts">
import { useLoginUserStore } from "@/stores/useLoginUserStore";
import type { Component } from "vue";
import {
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
  SettingsOutline as ManageIcon,
  LogIn as LoginIcon,
} from "@vicons/ionicons5";
import { NAvatar, NText, NIcon } from "naive-ui";
import { h, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { userLogout } from "@/services/user";

function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
}

function renderCustomHeader(useLoginUser: any) {
  return h(
    "div",
    {
      style: "display: flex; align-items: center; padding: 8px 12px;",
    },
    [
      h(NAvatar, {
        round: true,
        style: "margin-right: 12px;",
        src: "https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG",
      }),
      h("div", null, [
        h("div", null, [
          h(
            NText,
            { depth: 2 },
            {
              default: () =>
                useLoginUser.loginUser.username
                  ? useLoginUser.loginUser.username
                  : "无名的打工仔",
            }
          ),
        ]),
        h("div", { style: "font-size: 12px;" }, [
          h(
            NText,
            { depth: 3 },
            { default: () => "毫无疑问，你是办公室里最亮的星" }
          ),
        ]),
      ]),
    ]
  );
}

const loginUserStores = useLoginUserStore();
const router = useRouter();
const useLoginUser = useLoginUserStore();
useLoginUser.getLoginUser();

const options = ref([
  {
    key: "header",
    type: "render",
    render: () => renderCustomHeader(useLoginUser),
  },
  {
    label: "主页",
    key: "/",
    icon: renderIcon(EditIcon),
    title: "主页",
  },
  {
    label: "用户登录",
    key: "/user/login",
    icon: renderIcon(LoginIcon),
    title: "用户登录",
    show: !useLoginUser.loginUser.isLogin
  },
  {
    label: "用户注册",
    key: "/user/register",
    icon: renderIcon(UserIcon),
    title: "用户注册",
    show: !useLoginUser.loginUser.isLogin
  },
  {
    label: "用户管理",
    key: "/admin/manage",
    icon: renderIcon(ManageIcon),
    title: "用户管理",
    show: useLoginUser.loginUser.isLogin && useLoginUser.loginUser.userRole === "1"
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogoutIcon),
    title: "退出登录",
    disabled: !useLoginUser.loginUser.isLogin,
  },
]);

// 监听用户状态变化
watch(() => useLoginUser.loginUser, (newUser) => {
  // 强制更新选项
  options.value = [
    {
      key: "header",
      type: "render",
      render: () => renderCustomHeader(useLoginUser),
    },
    {
      label: "主页",
      key: "/",
      icon: renderIcon(EditIcon),
      title: "主页",
    },
    {
      label: "用户登录",
      key: "/user/login",
      icon: renderIcon(LoginIcon),
      title: "用户登录",
      show: !newUser.isLogin
    },
    {
      label: "用户注册",
      key: "/user/register",
      icon: renderIcon(UserIcon),
      title: "用户注册",
      show: !newUser.isLogin
    },
    {
      label: "用户管理",
      key: "/admin/manage",
      icon: renderIcon(ManageIcon),
      title: "用户管理",
      show: newUser.isLogin && newUser.userRole === "1"
    },
    {
      label: "退出登录",
      key: "logout",
      icon: renderIcon(LogoutIcon),
      title: "退出登录",
      disabled: !newUser.isLogin,
    },
  ];
}, { deep: true });

const handleSelect = async (key: string) => {
  console.log(key);
  if (key === "logout") {
    await userLogout();
    await useLoginUser.getLoginUser();
    console.log(loginUserStores.loginUser);
    router.push({
      path: "/",
    });
    return;
  }
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.user-header-text {
  white-space: nowrap;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}
</style>