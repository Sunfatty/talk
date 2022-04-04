// 创建一个基础路径
const UR = 'https://study.duyiedu.com';
// 创建函数并且形参放一个对象
// 第一个值是url路径
// 第二个值是请求方法,默认值是GET
// 第三个值是要传入的参数，默认值是一个空对象
const fethcFn = async({ url, method = 'GET', params = {} }) => {
    // 声明一个变量存放数据请求后存入的值
    let result = null;
    // 声明一个存放登陆或注册存放进本地的值token
    const extendsObj = {}
    sessionStorage.token && (extendsObj.Authorization = 'Bearer ' + sessionStorage.token);
    console.log(extendsObj);
    // 判断在请求方法为GET的情况下并且传入的参数有值的情况下进入判断
    // Object.keys方法遍历并且排序这个对象返回一个数组，数组的内容是这个对象的属性名
    // 这个判断里面的意思是吧上面传入的对象转为数组并且看看他的成都是不是大于0
    if (method === 'GET' && Object.keys(params).length) {
        // 下面要开始的是GET请求的参数拼接
        // url等于传入的接口路径
        // 参数要以问号开头所以要拼接一个问号
        // 拼接一个传入参数Object.keys(params)的意思是历并且排序这个对象返回一个数组
        // 这个数组在使用。map方法遍历出来这个数组每一位的值
        // .concat()连接数组的方法不会改变当前数组会返回一个新的数组
        // 使用join将前面用.concat()连接的数组通过&分割成为一个字符串
        url += "?" + Object.keys(params).map(key => "".concat(key, "=", params[key])).join("&");
        console.log(url);
    }
    // 方法如果try里面没有错误的话是不执行catch里面的代码
    // 如果try里面有错误的话就执行catch里面的代码
    // 使用try {}catch (err) {}
    // 声明一个变量调用fetch函数
    //      第一个参数传入基础路径加拼接路径
    //      第二个参数是一个函数
    //      这个函数的第一个参数是请求方法
    //      第二个参数是设置传入格式
    //      第三个参数是一个三元运算符判断请求方法是否是GET如果是GET的话没有body值如果不是的话就是post有body的值
    //      使用JSON.stringify方法把传进来的参数放进去转为JSON格式
    // 把请求的数据放入之前声明的变量中,先吧请求出来的数据使用json方法把JSON 字符串转换为 JavaScript 对象
    // 在try做一个判断判断如果不为错就返回result.data如果为错就弹出错误信息
    console.log(UR + url);
    try {
        const response = await fetch(UR + url, {
            method,
            // extendsObj写在这里如果有值就展开放入这个对象中如果没有就放入一个空对象等于没放
            headers: { "content-type": "application/json", ...extendsObj },
            body: method === "GET" ? null : JSON.stringify(params),
        });
        // 获取后台给我们的token值
        const token = response.headers.get('Authorization');
        console.log(token);
        // 存储token值
        token && (sessionStorage.token = token);
        result = await response.json();
        if (result.code === 0) {
            // 判断如果后台返回值里面有chatTotal的话一起返回
            if (result.hasOwnProperty('chatTotal')) { //判断当前对象是否有chatTotal这个属性
                result.data = {
                    chatTotal: result.chatTotal,
                    data: result.data
                }
            }
            return result.data
        } else {
            // 权限错误处理 当存储的token的值不正确的时候进判断
            if (result.status === 401) {
                window.alert('权限token不正确');
                // 删除存储的token
                sessionStorage.removeItem('token');
                // 跳转回登陆页面
                window.location.replace(baseURL + 'login.html');
                // 不想让他再次跳出错误信息所以直接跳出 
                return
            }
            window.alert(result.msg);
        }
    } catch (err) {
        // 弹出错误
        window.alert(err)
    }
};
// const loginId = "add";
// const loginI = "ad";

// const res = await fethcFn({
//     url: '/api/user/login',
//     method: 'GET',
//     params: { loginId, loginI }
// })
// console.log(res);