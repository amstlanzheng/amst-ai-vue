import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { currentUser } from "@/services/user";

interface LoginUser {
  username: string;
  isLogin: boolean;
  userRole?: string;
  id?: string;
  userAccount?: string;
  avatarUrl?: string;
  gender?: string;
  phone?: string;
  email?: string;
  planetCode?: string;
  createTime?: string;
}

export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<LoginUser>({
    username: "无名",
    isLogin: false,
  });

  async function getLoginUser() {

    
    const res = await currentUser();
    if (res.data.code === 1 && res.data.data) {
     
      loginUser.value = res.data.data;
      loginUser.value.isLogin = true;
    }else{
      loginUser.value = {
        username: "无名",
        isLogin: false
      }
 
    }
  }

  async function setLoginUser(new_param: LoginUser) {
    loginUser.value = new_param;
  }

  return { loginUser, getLoginUser, setLoginUser };
});
