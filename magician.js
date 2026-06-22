document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase 雲端即時同步設定 ---
    const firebaseConfig = {
        // 請在此處貼上 Firebase 專案的金鑰設定 (必須與 app.js 的金鑰一模一樣)
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    
    const connStatus = document.getElementById('conn-status');
    const zoneList = document.getElementById('zone-list');
    const currentImageLabel = document.getElementById('current-image');
    
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        connStatus.textContent = "🔴 錯誤：尚未設定 Firebase 金鑰，請先在原始碼中填寫！";
        connStatus.style.color = "#FF5E62";
        return;
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();
    
    connStatus.textContent = "🟢 Firebase 連線成功，正在監聽觀眾動作...";
    
    // 監聽 Firebase 節點變更
    db.ref('magic_state').on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        
        // 更新畫作名稱
        if (data.currentImage === "著色版_boy_0.png") {
            currentImageLabel.textContent = "小男孩";
        } else if (data.currentImage === "著色版_gril_0.png") {
            currentImageLabel.textContent = "小女孩";
        } else {
            currentImageLabel.textContent = data.currentImage;
        }
        
        // 渲染選色清單
        zoneList.innerHTML = '';
        data.zones.forEach(zone => {
            const li = document.createElement('li');
            li.className = 'zone-item';
            
            li.innerHTML = `
                <div class="zone-info">
                    <span>${zone.name}</span>
                </div>
                <div class="color-preview" style="background-color: ${zone.colorHex}" title="${zone.colorHex}"></div>
            `;
            zoneList.appendChild(li);
        });
    });
});
