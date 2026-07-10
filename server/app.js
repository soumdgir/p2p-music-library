const userLanguage = navigator.language || navigator.userLanguage;
// userLanguage（ブラウザの言語設定）を覗き見るIF文の中
if (userLanguage.startsWith('ja')) {
    document.getElementById('siteName').innerText = 'P2P MUSIC LIBRARY';
    document.getElementById('Search').innerText = '検索';
    document.getElementById('media-file-label').innerText = 'ファイルを選択してください';
    document.getElementById('plomise').innerText = '誓約事項';
    document.getElementById('Covenant').innerText = 'アップロードするファイルは自身のオリジナルの著作物であることを誓約します';
    document.getElementById('right').innerText = 'アップロードする自身の作品を CC0 1.0 全世界 パブリック・ドメイン提供宣言 のもとで公開することに同意します';
    document.getElementById('up').innerText = 'アップロード';
} else {
    document.getElementById('siteName').innerText = 'P2P MUSIC LIBRARY';
    document.getElementById('Search').innerText = 'Search';
    document.getElementById('media-file').innerText = 'select your file';
    document.getElementById('plomise').innerText = 'Pledge Agreement';
    document.getElementById('Covenant').innerText = 'I pledge that the file to be uploaded is my own original work.';
    document.getElementById('right').innerText = 'I agree to release my uploaded work under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.';
    document.getElementById('up').innerText = 'upload';
}

const scalesCheck = document.getElementById('scales');
const hornsCheck = document.getElementById('horns');
const upButton = document.getElementById('up');

    function toggleButtonState() {
    if (scalesCheck.checked && hornsCheck.checked) {
        upButton.disabled = false;
    } else {
        upButton.disabled = true;
     } 
    }

    scalesCheck.addEventListener('change', toggleButtonState);
    hornsCheck.addEventListener('change', toggleButtonState);

    toggleButtonState();

const mediabox = document.getElementById('media-file');
const uploads = document.getElementById('up');

    uploads.addEventListener('click', () => {
        const files = mediabox.files;

        if (files.length > 100) {
        alert("一度にアップロードできるファイルは100個までです");
        return;
    }

    let mp3count = 0;
    let imagecount = 0;

        for (const file of files) {

            if (file.webkitRelativePath.includes("../")){
            alert("無効な名前のファイルが含まれています")
            return;
        }

        const fileName = file.name.toLowerCase();

            if (!file.name.endsWith(".jpeg") && !fileName.endsWith(".jpg") && !fileName.endsWith(".png") && !fileName.endsWith(".mp3")){
            alert("無効なファイルが含まれています")
            return;
        }

            if (file.name.startsWith(".")) {
            continue; 
        }

            if (!file.type.startsWith("image/") && !file.type.startsWith("audio/")){
            alert("無効なファイルが含まれています")
            return;
            }

            if (file.name.endsWith(".jpeg") || fileName.endsWith(".jpg")){
                imagecount ++;     
        }
            if (file.name.endsWith(".png")){
                imagecount ++;     
        }
            if (file.name.endsWith(".mp3")){
                mp3count ++;     
        }}

            if (imagecount !== 1){
            alert("画像のファイルが0個もしくは2個以上含まれています")  
            return;       
        }

            if (mp3count === 0){
            alert("mp3が確認できません")  
            return;       
        }
            alert("ファイルの紐付けを開始します");

    const p2pbox = [];

    for (const file of files) {
        if (file.name.startsWith(".")) {
            continue; 
        }

        p2pbox.push({
            path: file.webkitRelativePath,
            binary: file
        });
    }

    console.log("P2P紐付け完了:", p2pbox);

const peer = new Peer({
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
        debug: 1
    }); 

    const connectedPeers = new Set();

    peer.on('open', (myId) => {
        console.log("ID:", myId);
        alert("P2Pネットワーク自動巡回を開始します");

        setInterval(() => {
            peer.listAllPeers((peers) => {
                const otherPeers = peers.filter(id => id !== myId);

                for (const targetId of otherPeers) {
            
                    if (connectedPeers.has(targetId)) continue;

                    console.log("新しいオンラインのユーザーと自動接続します:", targetId);
                    const conn = peer.connect(targetId);
                    
                    conn.on('open', () => {
                        console.log(`${targetId} データを送信します`);
                        connectedPeers.add(targetId); 
               
                        conn.send(p2pbox.data); 
                    });

                    conn.on('close', () => {
                        connectedPeers.delete(targetId); 
                    });

                    setupReceivedData(conn, p2pbox);
                }
            });
        }, 5000); 
    });

    peer.on('connection', (conn) => {
        console.log("別のユーザーが接続しました");
        connectedPeers.add(conn.peer);

        conn.on('open', () => {
    
            conn.send(p2pbox.data); 
        });

        conn.on('close', () => {
            connectedPeers.delete(conn.peer);
        });

        setupReceivedData(conn, p2pbox);
    });

});