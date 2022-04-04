(() => {
    // 封装需要的DOM获取方法
    const $ = e => document.querySelector(e);
    const $$ = e => document.querySelectorAll(e);
    // 获取需要得到DOM元素
    const formContainer = $("#formContainer"); //form表单
    const userName = $("#userName"); //用户名
    const userNickname = $("#userNickname"); //用户昵称
    const userPassword = $("#userPassword"); //注册密码
    const userConfirmPassword = $("#userConfirmPassword"); //密码确认
    // 创建一个存放变量
    let isRepeat = false;
    // 创建入口函数
    const init = () => {
            initEvent();
        }
        // 定义事件入口函数
    const initEvent = () => {
            // 绑定失去焦点事件
            userName.addEventListener("blur", onUserNameBlur);
            // 绑定form表单提交事件
            formContainer.addEventListener("submit", onFormContainer);
        }
        // 注册事件
    const onFormContainer = (e) => {
        // 阻止默认事件
        e.preventDefault();
        // 收集信息
        const loginId = userName.value.trim();
        const nickname = userNickname.value.trim();
        const loginPwd = userPassword.value.trim();
        const confirmPwd = userConfirmPassword.value.trim();
        // 判断验证函数返回的是否全部通过
        if (!checkForm(loginId, nickname, loginPwd, confirmPwd)) return;
        // 如果通过就请求数据
        // 判断如果有重复的用户昵称
        // 请求数据函数
        sendData(loginId, nickname, loginPwd);
    }
    const sendData = async(loginId, nickname, loginPwd) => {
        // 调用fetch发送数据并且传入细致信息
        // const res = await fetch("https://study.duyiedu.com/api/user/reg", {
        //     // 传入方法是POST
        //     method: 'POST',
        //     // 传入的格式是json
        //     headers: {
        //         "content-type": "application/json",
        //     },
        //     // 把传入的值变成json格式并且传入值
        //     body: JSON.stringify({
        //         loginId,
        //         nickname,
        //         loginPwd
        //     })
        // });
        const res = await fethcFn({
            url: "/api/user/reg",
            method: 'POST',
            params: { loginId, nickname, loginPwd }
        });
        res && window.location.replace(baseURL + "index.html");
        // // 声明变量，并且存入上面获取的数据
        // const result = await res.json();
        // // 判断是否没有错误
        // if (result.code !== 0) {
        //     // 打印错误信息
        //     window.alert(result.msg)
        // }
        // 调整到登录页面
        // window.location.replace("/");

    };
    // 定义验证函数
    const checkForm = (loginId, nickname, loginPwd, confirmPwd) => {
            // 判断这些数据是否为空
            switch (true) {
                case !loginId:
                    window.alert("注册用户名不能为空");
                    return
                case !nickname:
                    window.alert("注册昵称不能为空");
                    return
                case !loginPwd:
                    window.alert("注册密码不能为空");
                    return
                case !confirmPwd:
                    window.alert("注册确认密码不能为空");
                    return
                case loginPwd !== confirmPwd:
                    window.alert("两次输入密码不一致");
                    return
                case isRepeat:
                    window.alert("用户昵称已经注册，请更换");
                    return
                default:
                    return true;
            }
        }
        // 用户名失去焦点事件
    const onUserNameBlur = async() => {
            // 获取输入从Value并且去除空格
            const loginId = userName.value.trim();
            // 判断这个值不为空
            if (!loginId) return;
            // 如果不为空就开始参数传输
            const response = await fetch(`https://study.duyiedu.com/api/user/exists?loginId=${loginId}`);
            const result = await response.json();
            // 存放状态
            isRepeat = result.data;
            // 判断是否用户名存在存在就打印错误
            if (result.code !== 0) {
                // 输出错误信息
                window.alert(result.msg);
            }
        }
        // 调用入口函数
    init();
})()