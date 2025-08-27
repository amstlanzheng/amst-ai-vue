import { useLoginUserStore } from "./stores/useLoginUserStore";
import router from "./router";
import { createDiscreteApi } from "naive-ui";
/**
 * 路由拦截
 * 权限验证

 */
// Create discrete API for message
const { message } = createDiscreteApi(["message"]);

router.beforeEach((to, from, next) => {
  const loginUserStore = useLoginUserStore();
  const loginUser = loginUserStore.loginUser;
  const toURL = to.path;

  if (toURL.startsWith("/admin")) {
    if (!loginUser || loginUser.userRole !== "1") {
      message.error("请先登录管理员账号！！");
      next("/user/login?redirect=" + to.fullPath);
    }
  }


  if (toURL.startsWith("/ai")) {
    if (!loginUser.isLogin) {
      message.error("请先登录！！");
      next("/user/login?redirect=" + to.fullPath);
    }
  }




  next();
});
