document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase 雲端即時同步設定 ---
    const firebaseConfig = {
        apiKey: "AIzaSyAnSci3QtfRwtjWDPYp4NcG3k2vmQzOmBE",
        authDomain: "magic-coloring-a8c59.firebaseapp.com",
        databaseURL: "https://magic-coloring-a8c59-default-rtdb.firebaseio.com",
        projectId: "magic-coloring-a8c59",
        storageBucket: "magic-coloring-a8c59.firebasestorage.app",
        messagingSenderId: "66585416550",
        appId: "1:66585416550:web:3af46ad2e7ee62de4d2ea7",
        measurementId: "G-MBCL3XTWBT"
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
        
        // 渲染選色清單 (隱密模式)
        zoneList.innerHTML = '';
        data.zones.forEach(zone => {
            const li = document.createElement('li');
            li.className = 'zone-item';
            
            // 如果是預設的白色 (#FFFFFF)，代表還沒塗色，燈泡關閉
            const isUncolored = (zone.colorHex === "#FFFFFF");
            const lightColor = isUncolored ? "#000" : zone.colorHex;
            const isOnClass = isUncolored ? "" : "on";
            
            li.innerHTML = `
                <div class="zone-info">
                    <span>${zone.name}</span>
                </div>
                <div class="color-preview ${isOnClass}" style="background-color: ${lightColor}; --light-color: ${lightColor};"></div>
            `;
            zoneList.appendChild(li);
        });
    });
});
