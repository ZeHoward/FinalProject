// 菜單展開、關閉功能
  window.openSidenav = function () {
    document.getElementById("sidenav").style.width = "100%";
    document.body.style.overflow = "hidden";
  };

  window.closeSidenav = function () {
    document.getElementById("sidenav").style.width = "0%";
    document.body.style.overflow = "";
  };

  //展開菜單選項
  // menu toggle up/down 圖案
  // window.togglePic1 = function () {
  //   var margin1 = document.getElementById("add");
  //   var img1 = document.getElementById("updown1");
  //   var childContent1 = document.getElementById("tem-dropdown-content1");
  //
  //   if (img1.src.includes("down.png")) {
  //     img1.src = "./material/icon/up.png";
  //     margin1.style.margin = "40px 0";
  //     childContent1.style.display = "block";
  //   } else if (img1.src.includes("up.png")) {
  //     img1.src = "./material/icon/down.png";
  //     margin1.style.margin = "";
  //     childContent1.style.display = "none";
  //   }
  // };
  //
  // window.togglePic2 = function () {
  //   var margin2 = document.getElementById("add");
  //   var img2 = document.getElementById("updown2");
  //   var childContent2 = document.getElementById("tem-dropdown-content2");
  //
  //   if (img2.src.includes("down.png")) {
  //     img2.src = "./material/icon/up.png";
  //     margin2.style.margin = "40px 0";
  //     childContent2.style.display = "block";
  //   } else if (img2.src.includes("up.png")) {
  //     img2.src = "./material/icon/down.png";
  //     margin2.style.margin = "";
  //     childContent2.style.display = "none";
  //   }
  // };

  // 會員功能菜單顯示/隱藏
  let memberInfoDiv = document.getElementById("memberInfoDiv");
  let slideshowContainer = document.getElementById("slideshow-container");
  let isMemberDivVisible = false; // 初始為隱藏

  document.getElementById("memberIcon").addEventListener("click", (e) => {
    e.stopPropagation(); // 防止點擊會員圖標時觸發頁面其他地方的點擊事件
    if (isMemberDivVisible) {
      memberInfoDiv.style.display = "none";
      // slideshowContainer.style.zIndex = 5;
      isMemberDivVisible = false;
    } else {
      memberInfoDiv.style.display = "block";
      isMemberDivVisible = true;
      // slideshowContainer.style.zIndex = -1;
    }
  });

  // 點擊頁面其他地方時隱藏會員功能菜單
  document.addEventListener("click", function (e) {
    e.stopPropagation();
    if (isMemberDivVisible && !memberInfoDiv.contains(e.target)) {
      memberInfoDiv.style.display = "none";
      // slideshowContainer.style.zIndex = 5;
      isMemberDivVisible = false;
    }
  });

  // 搜索框顯示/隱藏
  // let isOpen = false;
  // let searchDiv = document.getElementById("searchDiv");
  // let searchIcon = document.getElementById("searchIcon");
  //
  // searchIcon.addEventListener("click", () => {
  //   if (!isOpen) {
  //     searchDiv.style.width = "200px";
  //     searchDiv.style.border = "1px solid #a1c14b";
  //     isOpen = true;
  //   } else {
  //     searchDiv.style.width = "0";
  //     searchDiv.style.border = "0";
  //     isOpen = false;
  //   }
  // });

  // 點擊頁面其他地方時隱藏搜索框和會員功能菜單
  document.getElementById("myContainer").addEventListener("click", () => {
    if (isMemberDivVisible) {
      memberInfoDiv.style.display = "none";
      // slideshowContainer.style.zIndex = 5;
      isMemberDivVisible = false;
    }
  });

  //header的logo點了會跳到首頁
  document.getElementById("logoDiv").addEventListener("click", () => {
    window.location.href = "/enjoyum";
  });

  //判斷使用者是否為登入狀態
  let loginDiv = document.getElementById("loginDiv");
  let logoutDiv = document.getElementById("logoutDiv");

  loginDiv.style.display = "none";
  logoutDiv.style.display = "none";

  fetch("/users/checkSession", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error : ");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        loginDiv.style.display = "none";
        logoutDiv.style.display = "block";
      } else {
        loginDiv.style.display = "block";
        logoutDiv.style.display = "none";
      }
    })
    .catch((error) => {
      console.log("Error :" + error);
    });

  //登出
  document.getElementById("logout").addEventListener("click", () => {
    fetch("/users/logout", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error : ");
        }
        return response.json();
      })
      .then((data) => {
        if (typeof data === "boolean") {
          if (data) {
            window.location.href = "/enjoyum";
          }
        } else {
          console.log("Unexpected response data:", data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  
  //聯絡我們
  let contactDiv = document.getElementById("contactDiv");
  
  document.getElementById("contactIcon").addEventListener("click", () => {
	contactDiv.style.display = 'block';
  })

  document.getElementById("close").addEventListener("click", () => {
      contactDiv.style.display = 'none';
  })
  
  document.getElementById("contactBtn").addEventListener("click", () => {
      let name = document.getElementById("name").value;
      let contactInfo = document.getElementById("contactInfo").value;
	  let questionType = document.getElementById("questionType").value;
      let message = document.getElementById("message").value;

      if(name === '' || name == null){
		  Swal.fire({
			title:"請輸入姓名",
			text:"",
			icon:"warning",
			timer:"1000"
		})
      }else if(contactInfo === '' || contactInfo == null){
		  Swal.fire({
  			title:"請輸入聯絡方式",
  			text:"",
  			icon:"warning",
  			timer:"1000"
  		})
      }else if(message === '' || message == null){
		  Swal.fire({
  			title:"請輸入諮詢內容",
  			text:"",
  			icon:"warning",
  			timer:"1000"
  		})
      }else{

		Swal.fire({
		  title: '正在發送中...',
		  text: '請稍後',
		  allowOutsideClick: false,
		  width: 600,
		   padding: '3em',
		   color: '#716add',
		   background: '#fff', 
		   
		   backdrop: `
		     rgba(0,0,123,0.4)
		     url("https://sweetalert2.github.io/images/nyan-cat.gif")
		     left top
		     no-repeat
		   `,
		  didOpen: () => {
		    Swal.showLoading();
		  },

		});

          fetch('/users/consult', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  name: name,
                  contactInfo: contactInfo,
				  questionType : questionType,
                  message : message
              })
          }).then(response => {
			Swal.close();
              if(!response.ok){
                  throw new Error ('Error :');

              }else{
				contactDiv.style.display = 'none';
                Swal.fire({
					title:"已收到您的諮詢",
					text:"感謝您的諮詢，我們我盡快回復您的問題！！",
					icon:"success",
					timer:"2000"
				})
			  }
          }).catch(error => {
			Swal.close();
		    Swal.fire({
		        title: "發送失敗",
		        text: "伺服器忙碌中,請稍後再試!!",
		        icon: "error"
		    });
              console.log('Error:', error);
          })
      }
  })

// ChatGPT小幫手聊天室
function initChatApp() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('webSocketIcon');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('sendButton');
    const closeButton = document.getElementById('closeButton');
    const maximizeButton = document.getElementById('maximizeButton');  // 新增放大按鈕

    let isMaximized = false; // 狀態標誌，用來判斷是否放大視窗

    // 綁定點擊圖片事件，顯示對話框
    chatIcon.addEventListener('click', function () {
        toggleChatWindow('show');
    });

    // 綁定發送按鈕事件，發送訊息
    sendButton.addEventListener('click', function () {
        const userMessage = chatInput.value.trim();
        if (userMessage !== '') {
            appendMessage('user', userMessage);
            sendMessageToGPT(userMessage);
            chatInput.value = ''; // 清空輸入框
        }
    });

    // 綁定關閉按鈕事件，隱藏對話框並恢復原狀
    closeButton.addEventListener('click', function () {
        toggleChatWindow('hide');
    });

    // 綁定放大按鈕事件
    maximizeButton.addEventListener('click', function () {
        if (!isMaximized) {
            chatWindow.style.width = '1000px';
            chatWindow.style.height = '800px';
            isMaximized = true;
        } else {
            chatWindow.style.width = '600px';
            chatWindow.style.height = '400px';
            isMaximized = false;
        }
    });

    // 顯示或隱藏對話框
    function toggleChatWindow(action) {
        const chatWindow = document.getElementById('chatWindow');

        if (action === 'show') {
            chatWindow.style.display = 'flex';  // 彈出對話框，使用 flexbox 布局
            chatIcon.style.display = 'none';    // 隱藏聊天圖標
        } else if (action === 'hide') {
            chatWindow.style.display = 'none';  // 隱藏對話框
            chatIcon.style.display = 'block';   // 顯示聊天圖標
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        chatWindow.style.display = 'none'; // 確保初始隱藏對話框
    });

    // 格式化訊息：處理換行和段落
    function formatMessage(message) {
        const paragraphs = message.split('\n\n');  // 將雙換行符視為段落
        return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');  // 單換行符轉換為 <br>
    }

    // 顯示訊息在對話框，帶有逐字打字機效果並處理格式化
    function appendMessage(role, message) {
        const newMessage = document.createElement('div');
        chatMessages.appendChild(newMessage);

        // 如果是用戶訊息，直接顯示
        if (role === 'user') {
            newMessage.textContent = '你: ' + message;
            chatMessages.scrollTop = chatMessages.scrollHeight; // 自動滾動到底部
            return;
        }

        // 將 GPT 回覆進行格式化並解析為純文本
        const formattedMessage = formatMessage(message);
        const tempElement = document.createElement('div');
        tempElement.innerHTML = formattedMessage;

        const fullText = tempElement.textContent;  // 獲取純文本內容
        let charIndex = 0;  // 字符索引
        const speed = 50;  // 調整打字速度，單位為毫秒

        function typeWriter() {
            if (charIndex < fullText.length) {
                newMessage.textContent += fullText.charAt(charIndex);  // 逐字添加
                charIndex++;
                chatMessages.scrollTop = chatMessages.scrollHeight;  // 自動滾動到底部
                setTimeout(typeWriter, speed);
            } else {
                // 當打字機效果結束後，將完整的 HTML 格式化應用
                newMessage.innerHTML = formattedMessage;
                chatMessages.scrollTop = chatMessages.scrollHeight;  // 自動滾動到底部
            }
        }

        typeWriter();  // 開始打字效果
    }

    // 送出訊息給後端處理 GPT 回應
    function sendMessageToGPT(userMessage) {
        fetch(`/chat?prompt=${encodeURIComponent(userMessage)}`, {  // 修正字符串模板語法錯誤
            method: 'GET',
            headers: {
                'accept': '*/*'
            }
        })
            .then(response => response.json())
            .then(data => {
                // 根據 API 回應結構解析數據
                const assistantMessage = data.choices[0].message.content;
                appendMessage('AI', assistantMessage);  // 顯示 AI 回應，帶打字機效果和格式化支援
            })
            .catch(error => {
                appendMessage('AI', '發生錯誤，請聯繫開發商');
                console.error('Error:', error);
            });
    }
}

// 初始化聊天應用
document.addEventListener("DOMContentLoaded", initChatApp);


// 廣告視窗
document.addEventListener('DOMContentLoaded', function() {
  const closeAdBtn = document.getElementById('closeAdBtn');
  const adContainer = document.getElementById('adContainer');
  const adImage = document.getElementById('adImage');
  const adLink = document.getElementById('adLink');

  // 廣告數據
  const ads = [
      { image: '/material/icon/DTlogo.png', link: 'https://www.youtube.com/@DietTomorrowFood/shorts' },
      { image: '/material/icon/youtube.png', link: 'https://youtube.com' }
      // { image: '/path/to/ad3.jpg', link: 'https://example3.com' },
  ];

  // 隨機選擇廣告
  function chooseRandomAd() {
      const randomIndex = Math.floor(Math.random() * ads.length);
      return ads[randomIndex];
  }

  // 設置廣告
  function setAd() {
      const ad = chooseRandomAd();
      adImage.src = ad.image;
      adLink.href = ad.link;
  }

    // 在什麼頁面不顯示廣告
    function shouldShowAd() {
        const currentPath = window.location.pathname;
        const excludedPaths = ['/enjoyum', '/loginPage', '/updatePasswordPage', '/about', '/registPage'];
        return !excludedPaths.includes(currentPath);
    }

    // 顯示廣告
    function showAd() {
        if (shouldShowAd()) {
            adSlideContainer.style.left = '20px';
        }
    }

    // 隱藏廣告
    function hideAd() {
        adSlideContainer.style.left = '-320px';
    }

    // 初始化廣告
    setAd();
    showAd();

  // 關閉廣告
    closeAdBtn.addEventListener('click', function() {
        hideAd();
        setTimeout(function() {
            setAd();
            showAd();
        }, 30000);
    });
});
