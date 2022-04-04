(() => {
    // 封装获取DOM节点方法
    const $ = e => document.querySelector(e);
    const $$ = e => document.querySelectorAll(e);
    // 获取需要的DOM 如果使用id的情况获取DOM的时候，其实不用获取节点也可以当
    // 当给元素绑定id的时候直接默认成为全局的属性了，所以可以不用获取直接使用
    const userName = $("#userName");
    const userPassword = $("#userPassword");
    const formContainer = $("#formContainer");
    // 定义入口
    const init = () => {
        initEvent();
    };
    const initEvent = () => {
        // 所以的事件都在这里面进行绑定
        formContainer.addEventListener("submit", onFormSubmitClick);
    };
    // 创建form表单的事件函数
    const onFormSubmitClick = (e) => {
            // 阻止表单默认行为
            e.preventDefault();
            // 获取表单数据为了防止用户输入空格提交使用trim删除空白字符
            const loginId = userName.value.trim();
            const loginPwd = userPassword.value.trim();
            // 调用数据发送函数
            if (!loginId || !loginPwd) {
                window.alert("用户名和密码不能为空");
                return
            }
            // 调用数据发送函数,并且传入上面获取到的值
            sendData(loginId, loginPwd);
        }
        // 创建数据发送函数
    const sendData = async(loginId, loginPwd) => {
            const res = await fethcFn({
                url: "/api/user/login",
                method: 'POST',
                params: { loginId, loginPwd }
            });
            res && window.location.replace("./index.html");
            // // 调用fetch发送数据并且传入细致信息
            // const res = await fetch("https://study.duyiedu.com/api/user/login", {
            //     // 传入方法是POST
            //     method: 'POST',
            //     // 传入的格式是json
            //     headers: {
            //         "content-type": "application/json",
            //     },
            //     // 把传入的值变成json格式并且传入值
            //     body: JSON.stringify({
            //         loginId,
            //         loginPwd
            //     })
            // });
            // // 声明变量，并且存入上面获取的数据
            // //json()方法是把JSON 字符串转换为 JavaScript 对象
            // const result = await res.json();
            // // 判断登陆是否错误，如果错误就进入判断跳出并且输出错误信息
            // console.log(result);
            // if (result.code !== 0) {
            //     window.alert(result.msg);
            //     return
            // }
            // result && window.location.replace('./index.html');
        }
        // 调用入口函数
    init();
})()