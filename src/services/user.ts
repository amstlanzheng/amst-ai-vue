import myAxios from "@/request";

interface UserRegisterParams {
  userAccount: string;
  userPassword: string;
  checkPassword: string;
  planetCode: string;
}

interface UserLoginParams {
  userAccount: string;
  userPassword: string;
}

interface UserUpdateParams {
  id: string;
  username?: string;
  userAccount?: string;
  userPassword?: string;
  checkPassword?: string;
  phone?: string;
  email?: string;
  planetCode?: string;
  gender?: string;
  userRole?: string;
}

export const userRegister = async (param: UserRegisterParams) => {

    return await myAxios.request({
            url: '/api/user/register',
            method: 'post',
            data: param
        }
    )

}


export const userLogin = async (param: UserLoginParams) => {

    return await myAxios.request({
            url: '/api/user/login',
            method: 'post',
            data: param
        }
    )

}

export const userCurrent = async () => {

    return await myAxios.request({
            url: '/api/user/current',
            method: 'get'
        }
    )

}
export const currentUser = async () => {

    return await myAxios.request({
            url: '/api/user/currentUser',
            method: 'get'
        }
    )

}
export const userLogout = async () => {

    return await myAxios.request({
            url: '/api/user/logout',
            method: 'post'
        }
    )

}


export const searchUser = async (username: string) => {

    return await myAxios.request({
            url: '/api/user/search',
            method: 'get',
            params: {username}
        }
    )

}

export const deleteUser = async (id: string) => {

    return await myAxios.request({
            url: '/api/user/deleteUser',
            method: 'POST',
            data: id,
            headers: { 'Content-Type': 'application/json' }
        }
    )

}


export const userUpdate = async (param: UserUpdateParams) => {

    return await myAxios.request({
            url: '/api/user/update',
            method: 'post',
            data: param
        }
    )

}