<template>
  <div id="userManagePage">
    <n-space vertical>
      <n-input-group>
        <n-input
          style="width: 320px; margin-bottom: 20px"
          ref="inputInstRef"
          v-model:value="inputValue"
        />
        <n-button type="primary" ghost @click="handleSearchButtonClick">
          搜索
        </n-button>
      </n-input-group>
    </n-space>

    <n-data-table
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :bordered="false"
    />
  </div>
</template>

<script lang="ts">
import { searchUser } from "@/services/user";
import type { DataTableColumns } from "naive-ui";
import { NButton, useMessage, NImage, useDialog } from "naive-ui";
import { defineComponent, h, ref, onMounted } from "vue";
import { deleteUser } from "@/services/user";
import type { InputInst } from "naive-ui";
interface User {
  id: string;
  username: string;
  userAccount: string;
  avatarUrl: string;
  gender: string;
  phone: string;
  planetCode: string;
  createTime: string;
  userRole: string;
}

function createColumns({
  deleteUserById,
  updateUserById,
}: {
  deleteUserById: (row: User) => void;
  updateUserById: (row: User) => void;
}): DataTableColumns<User> {
  return [
    {
      title: "用户名",
      key: "username",
    },
    {
      title: "账号",
      key: "userAccount",
    },
    {
      title: "头像",
      key: "avatarUrl",
      render(row) {
        // Ensure we have a valid URL, use fallback if avatarUrl is empty or invalid
        const imageUrl =
          row.avatarUrl && row.avatarUrl.trim() !== ""
            ? row.avatarUrl
            : "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg";

        return h(NImage, {
          src: imageUrl,
          width: 50,
          height: 50,
          onError: (e: Event) => {
            // Handle error by setting fallback image
            const target = e.target as HTMLImageElement;
            target.src =
              "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg";
          },
        });
      },
    },
    {
      title: "性别",
      key: "gender",
      render(row) {
        // 根据字段值返回对应的文本
        return row.gender === "1" ? "男" : row.gender === "0" ? "女" : "未知";
      },
    },
    {
      title: "联系方式",
      key: "phone",
    },
    {
      title: "邀请码",
      key: "planetCode",
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: "创建时间",
      key: "createTime",
    },
    {
      title: "用户角色",
      key: "userRole",
      render(row) {
        // 根据字段值返回对应的文本
        if (row.userRole === "1") {
          return "管理员";
        } else {
          return "普通用户";
        }
      },
    },

    {
      title: "操作",
      key: "actions",
      render(row) {
        return [
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              secondary: true,
              type: "info",
              size: "small",
              style: {
                marginRight: "5px",
              },
              onClick: () => updateUserById(row),
            },
            { default: () => "修改" }
          ),
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              type: "error",
              size: "small",
              onClick: () => deleteUserById(row),
            },
            { default: () => "删除" }
          ),
        ];
      },
    },
  ];
}

export default defineComponent({
  setup() {
    const inputInstRef = ref<InputInst | null>(null);
    const inputValue = ref("");
    // 在组件挂载时执行获取用户列表
    onMounted(() => {
      getUserList();
    });
    const message = useMessage();
    const dialog = useDialog();
    const data = ref([]);
    const getUserList = async (username = "") => {
      console.log("getUserList----->");
      const res = await searchUser(username);
      if (res.data.code === 1) {
        data.value = res.data.data;
      } else {
        message.error("查询失败：" + res.data.description);
      }
    };

    return {
      inputInstRef,
      inputValue,
      data,
      columns: createColumns({
        deleteUserById(row: User) {
          deleteUser(row.id).then((res) => {
            dialog.warning({
              title: "确认删除",
              content: `您确定要删除用户 "${row.username}" 吗？此操作无法撤销。`,
              positiveText: "确定",
              negativeText: "取消",
              onPositiveClick: () => {
                deleteUser(row.id).then((res) => {
                  if (res.data.code === 1) {
                    message.success("删除成功");
                    getUserList();
                  } else {
                    message.error("删除失败：" + res.data.description);
                  }
                });
              },
              onNegativeClick: () => {
                message.info("已取消删除");
              },
            });
          });
        },

        updateUserById(row: any) {},
      }),

      handleSearchButtonClick() {
        getUserList(inputValue.value);
      },

      pagination: false as const,
    };
  },
});
</script>

<style scoped>
#userManagePage {
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 100%;
  padding: 20px;
  background-color: linear-gradient(to right, #fefefe, #fff);
}
</style>
