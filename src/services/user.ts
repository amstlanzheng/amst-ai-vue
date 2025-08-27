import myAxios from "@/request";


export const userRegister = async (param : any) => {

    return await myAxios.request({
            url: '/api/user/register',
            method: 'post',
            data: param
        }
    )

}


export const userLogin = async (param : any) => {

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


export const searchUser = async (username: any) => {

    return await myAxios.request({
            url: '/api/user/search',
            method: 'get',
            params: {username}
        }
    )

}

export const deleteUser = async (id: any) => {

    return await myAxios.request({
            url: '/api/user/deleteUser',
            method: 'POST',
            data: id,
            headers: { 'Content-Type': 'application/json' }
        }
    )

}


