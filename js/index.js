(() => {
    // 封装需要的方法
    const $ = e => document.querySelector(e);
    const $$ = e => document.querySelectorAll(e);
    // 需要的DOM元素
    const nickName = $('.nick-name');
    const accountName = $('.account-name');
    const loginTime = $('.login-time');
    const contentBody = $('.content-body');
    const sendBtn = $(".send-btn");
    const inputContainer = $(".input-container");
    const arrowContainer = $('.arrow-container');
    const selectContainer = $('.select-container');
    const selectItemOn = $$(".select-item")[0];
    const selectItem = $$(".select-item")[1];
    const close = $(".close");
    let page = 0;
    let size = 10;
    let chatTotal;
    let sendType = "enter";
    // 创建入口函数
    const init = () => {
        // 调用获取用户信息的函数
        getUserInfo();
        // 调用历史记录函数
        intiChatList("bottom");
        // 调用事件入口函数
        initEvent();
    };
    // 创建事件入口函数
    const initEvent = () => {
        sendBtn.addEventListener('click', onSendBthClick);
        // 监听滚动条事件
        contentBody.addEventListener('scroll', onContentBodyScroll);
        // 给小箭头绑定鼠标点击事件
        arrowContainer.addEventListener('click', onArrowBtnClick);
        // 给以什么发送设置点击事件(遍历绑定事件)
        $$(".select-item").forEach(node => node.addEventListener('click', onSelectItemClick));
        // 监听内容区域的键盘按下事件
        inputContainer.addEventListener("keyup", onInputContainerKeyUp);
        //给X绑定点击事件
        close.addEventListener("click", oncloseClick);
    };
    // 退出按钮事件绑定函数
    const oncloseClick = () => {
            // 清空sessionStorage
            sessionStorage.removeItem('token');
            // 页面跳转
            window.location.replace("./login.html");
        }
        // 定义键盘按下事件 
    const onInputContainerKeyUp = (e) => {
            // e.ctrlKey按下ctrl
            // e.keyCode按下的键盘码
            // sendType当前选择的是那种提交方式
            if (e.keyCode === 13 && sendType === "enter" && !e.ctrlKey || e.keyCode === 13 && sendType === "ctrlEnter" && e.ctrlKey) {
                // 调用
                sendBtn.click();
                // onSendBthClick();
            }
        }
        // 设置以什么发送点击事件
    const onSelectItemClick = function() {
            // 处理高亮状态
            const on = $(".select-item.on");
            on && on.classList.remove("on");
            this.classList.add("on");
            sendType = this.getAttribute('type');
            selectContainer.style.display = 'none';

        }
        // 定义箭头点击事件
    const onArrowBtnClick = () => {
            selectContainer.style.display = 'block';
        }
        // 定义监听滚动条函数
    const onContentBodyScroll = function() {
            // 设置滚动到顶部加载第二页数据
            // console.log(this.scrollTop);
            contentBody.addEventListener('scroll', onContentBodyScroll);
            // 判断当前滚动条是否到达顶部
            if (this.scrollTop === 0) {
                // 判断后台是否还有数据
                if (chatTotal <= (page + 1) * size) return
                page++;
                console.log(chatTotal, (page + 1) * size);
                intiChatList('top');
            }
        }
        // 定义事件函数
    const onSendBthClick = async() => {
        const content = inputContainer.value.trim(); //trim方法把空格取消 
        if (!content) {
            window.alert("发送文件不能为空 ");
            return
        }
        // 调用渲染函数
        renderChatForm([{
            from: "user",
            content,
        }], "bottom")
        inputContainer.value = "";
        // 发送数据到后台
        const res = await fethcFn({
            url: '/api/chat',
            method: "POST",
            // 传入参数
            params: { content }
        })

        renderChatForm([{
            from: "robot",
            content: res.content,
        }], "bottom")
    };
    // 获取用户信息并且改变用户信息的函数
    const getUserInfo = async() => {
        const res = await fethcFn({
            url: '/api/user/profile',
        })
        console.log(res);
        nickName.innerHTML = res.nickname;
        loginTime.innerHTML = formaDate(res.lastLoginTime);
        accountName.innerHTML = res.loginId;

    };
    // 历史记录函数
    const intiChatList = async(direction) => {
            const res = await fethcFn({
                url: '/api/chat/history',
                // 传入参数
                params: {
                    page, //当前查询聊天记录起始页
                    size //当前查询聊天记录每次返回值长度
                }
            })
            chatTotal = res.chatTotal;
            // 渲染聊天页面函数
            console.log(res);
            renderChatForm(res.data, direction)
        }
        // 定义渲染聊天页面函数
    const renderChatForm = (res, direction) => {
        res.reverse();
        // 判断如果页面为空的情况下没有历史记录的操作
        if (!res.length) {
            contentBody.innerHTML = `
            <div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                </div>
            </div>`
            return
        }
        // 把每一位都拿出来做个设置
        console.log(res);
        const chatData = res.map(re => {
            // 判断每一位的from属性值是不是user
            return re.from === "user" ? `
         <div class="chat-container avatar-container">
            <img src="./img/avtar.png" alt="">
            <div class="chat-txt">${re.content}</div>
        </div>` : `
        <div class="chat-container robot-container">
                    <img src="./img/robot.jpg" alt="">
                    <div class="chat-txt">${re.content}</div>
                </div>`
        });
        // 把设置好的聊天记录通过innerHTML的方式放到页面上面
        if (direction === 'bottom') {
            contentBody.innerHTML += chatData.join(' ');
            const bottomDistance = document.querySelectorAll('.chat-container')[document.querySelectorAll('.chat-container').length - 1].offsetTop;
            contentBody.scrollTo(0, bottomDistance);
        } else {
            contentBody.innerHTML = contentBody.innerHTML + chatData.join(' ');
        }

    }

    // 调用入口函数
    init();
})()