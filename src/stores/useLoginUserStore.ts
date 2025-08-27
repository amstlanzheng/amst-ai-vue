import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { currentUser } from "@/services/user";

export const useLoginUserStore = defineStore("loginUser", () => {
  const loginUser = ref<any>(
    {
      username: "无名",
      isLogin: false,
    }
);

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

  async function setLoginUser(new_param: any) {
    loginUser.value = new_param;
  }

  return { loginUser, getLoginUser, setLoginUser };
});
