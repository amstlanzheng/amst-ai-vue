<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-gradient-text type="info"> 你好，尊敬的用户</n-gradient-text>
  </n-dropdown>
</template>

<script lang="ts">
import { useLoginUserStore } from "@/stores/useLoginUserStore";
import type { Component } from "vue";
import {
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
  SettingsOutline as ManageIcon,
  LogIn as LoginIcon,
} from "@vicons/ionicons5";
import { NAvatar, NText } from "naive-ui";

import { NIcon } from "naive-ui";
import { defineComponent, h, computed } from "vue";
import { useRouter } from "vue-router";
import { userCurrent, userLogout } from "@/services/user";

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
export default defineComponent({
  setup() {
    const loginUserStores = useLoginUserStore();

    const router = useRouter();
    const handleSelect = (key: string) => {
      console.log(key);
      if (key === "logout") {
        userLogout();
        useLoginUser.getLoginUser();
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
    const useLoginUser = useLoginUserStore();
    useLoginUser.getLoginUser();

    const options = computed(() => [
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
      },
      {
        label: "用户注册",
        key: "/user/register",
        icon: renderIcon(UserIcon),
        title: "用户注册",
      },
      {
        label: "用户管理",
        key: "/admin/manage",
        icon: renderIcon(ManageIcon),
        title: "用户管理",
      },
      {
        label: "退出登录",
        key: "logout",
        icon: renderIcon(LogoutIcon),
        title: "退出登录",
        disabled: !useLoginUser.loginUser.isLogin,
      },
    ]);

    return {
      loginUserStores,
      handleSelect,
      options,
    };
  },
});
</script>