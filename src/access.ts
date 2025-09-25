import { useLoginUserStore } from "./stores/useLoginUserStore";
import router from "./router";
import { createDiscreteApi } from "naive-ui";

/**
 * 路由拦截
 * 权限验证
 */

// Create discrete API for message
const { message } = createDiscreteApi(["message"]);

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore();
  // 确保获取到最新的用户信息
  await loginUserStore.getLoginUser();
  const loginUser = loginUserStore.loginUser;
  const toURL = to.path;

  if (toURL.startsWith("/admin")) {
    if (!loginUser || !loginUser.isLogin || loginUser.userRole !== "1") {
      console.log("请先登录管理员账号！！", loginUser);
      message.error("请先登录管理员账号！！");
      return next("/user/login?redirect=" + to.fullPath);
    }
  }

  if (toURL.startsWith("/ai")) {
    if (!loginUser || !loginUser.isLogin) {
      message.error("请先登录！！");
      return next("/user/login?redirect=" + to.fullPath);
    }
  }

  next();
});