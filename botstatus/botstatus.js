const storedBotIds = [];
const secretKey = "fpybhwvomsldxremcmeltmmzispakphlnapyiwtbmcbsgqreeqvohiziqtjpafppbscmsslyfthbwhziejfhqckdpk";
let clickCount = 0;

// 開発者ツール無効化（初期設定）
function disableDevTools(e) {
    if (e.key === "F12") {
        e.preventDefault();
        return false;
    }

    if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")) {
        e.preventDefault();
        return false;
    }

    if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        return false;
    }
}

// 右クリックの無効化
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

// 「O」キーをクリックするカウント
function handleKeyPress(e) {
    if (e.key.toLowerCase() === 'o') { // 「O」キーを押したときにカウント
        clickCount++;

        if (clickCount === 20) {
            // 10回クリックされたら管理者に認定
            document.getElementById('admin-message').style.display = 'block'; // 管理者メッセージ表示
            enableAdminControls();  // 管理者操作を有効にする
        }
    }
}

// 管理者操作を有効にする
function enableAdminControls() {
    // F12などの操作を解禁
    document.removeEventListener("keydown", disableDevTools); // 開発者ツール無効化を解除
    alert("管理者認証されました。F12などの開発者ツールが使えるようになりました！");
}

// ログイン処理
function login() {
    const userInput = document.getElementById('botid').value;
    const errorMessage = document.getElementById('error-message');
    const encryptedBotIds = JSON.parse(localStorage.getItem('encryptedBotIds')) || [];
    let isAuthenticated = false;
    const encryptedUserInput = CryptoJS.AES.encrypt(userInput, secretKey).toString();
    for (let encryptedBotId of encryptedBotIds) {
        const decryptedBotId = CryptoJS.AES.decrypt(encryptedBotId, secretKey).toString(CryptoJS.enc.Utf8);
        if (decryptedBotId === userInput) {
            isAuthenticated = true;
            break;
        }
    }
    if (isAuthenticated) {
        // ログイン成功
        localStorage.setItem('loggedIn', 'true');
        document.getElementById('notlogin').style.display = 'none';
        document.getElementById('login').style.display = 'block';
        document.getElementById('notice').style.display = 'none';
        errorMessage.textContent = '';
    } else {
        // ログイン失敗
        errorMessage.textContent = '管理番号が間違っています。';
    }
}

// ログアウト処理
function logout() {
    localStorage.removeItem('loggedIn');
    document.body.classList.remove('logged-in');
    document.body.classList.add('not-logged-in');
    document.getElementById('notlogin').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    document.getElementById('notice').style.display = 'block';
}

// ID管理のための関数群
function saveEncryptedBotIds() {
    const encryptedBotIds = storedBotIds.map(id => CryptoJS.AES.encrypt(id, secretKey).toString());
    localStorage.setItem('encryptedBotIds', JSON.stringify(encryptedBotIds));
}

function addNewID(newID) {
    let encryptedBotIds = JSON.parse(localStorage.getItem('encryptedBotIds')) || [];
    const encryptedNewID = CryptoJS.AES.encrypt(newID, secretKey).toString();

    if (encryptedBotIds.includes(encryptedNewID)) {
        console.log("このIDはすでに登録されています。");
        return;
    }

    encryptedBotIds.push(encryptedNewID);
    localStorage.setItem('encryptedBotIds', JSON.stringify(encryptedBotIds));
    console.log("新しいIDを追加しました。");
}

function deleteID(idToDelete) {
    let encryptedBotIds = JSON.parse(localStorage.getItem('encryptedBotIds')) || [];
    let updatedList = [];
    let found = false;

    for (let encrypted of encryptedBotIds) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
            if (decrypted === idToDelete) {
                found = true;
                continue;
            }
        } catch (e) {
        }
        updatedList.push(encrypted);
    }

    if (found) {
        localStorage.setItem('encryptedBotIds', JSON.stringify(updatedList));
        console.log("IDを削除しました。");
        return true;
    } else {
        console.log("指定されたIDは見つかりませんでした。");
        return false;
    }
}

// ページ読み込み時に設定するイベントリスナー
window.onload = function () {
    document.addEventListener("keydown", handleKeyPress);  // 「O」キーのカウント
    document.addEventListener("keydown", disableDevTools); // 開発者ツール無効化

    if (!localStorage.getItem('encryptedBotIds')) {
        saveEncryptedBotIds();
    }

    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('notlogin').style.display = 'none';
        document.getElementById('login').style.display = 'block';
        document.getElementById('notice').style.display = 'none';
    }
};

// ヘルプの表示を切り替える関数
function toggleHelp() {
    const helpText = document.getElementById('help-text');
    const helploginText = document.getElementById('help-login');
    if (helpText.style.display === "none" || helpText.style.display === "") {
        helploginText.style.display = "none";
        helpText.style.display = "block";
    } else {
        helpText.style.display = "none";
    }
}

function toghelplogin() {
    const helpText = document.getElementById('help-text');
    const helploginText = document.getElementById('help-login');
    if (helploginText.style.display === "none" || helploginText.style.display === "") {
        helpText.style.display = "none";
        helploginText.style.display = "block";
    } else {
        helploginText.style.display = "none";
    }
}
