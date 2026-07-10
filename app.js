function setupReceivedData(conn, p2pbox) {

    const processData = (incomingBox) => {
        if (!Array.isArray(incomingBox)) return;

        const albumGrid = document.getElementById('album-grid');
        if (!albumGrid) return;
        albumGrid.innerHTML = ''; 

        for (const item of incomingBox) {
            const fileName = item.path.toLowerCase();
            const isImage = (fileName.endsWith('.jpeg') || fileName.endsWith('.jpg') || fileName.endsWith('.png')) 
                            && item.binary.type.startsWith('image/');

            if (isImage) {
                const imageUrl = URL.createObjectURL(item.binary);
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.className = 'album-art';
                imgElement.style.cursor = 'pointer';

                imgElement.addEventListener('click', () => {
                    const currentFolder = item.path.substring(0, item.path.lastIndexOf('/') + 1);

                    const matchingAudio = incomingBox.find((audioItem) => {
                        const audioName = audioItem.path.toLowerCase();
                        return audioItem.path.startsWith(currentFolder) && audioName.endsWith('.mp3');
                    });

                    if (matchingAudio) {
                        if (!matchingAudio.binary.type.startsWith('audio/')) {
                            alert("不正な音声ファイルが検出されました");
                            return; 
                        }

                        const audioUrl = URL.createObjectURL(matchingAudio.binary);
                        const audioPlayer = document.getElementById('main-player');
                        
                        if (audioPlayer) {
                            audioPlayer.src = audioUrl;
                            audioPlayer.play();
                            alert(`${currentFolder} を再生します`);
                        }
                    } else {
                        alert("mp3ファイルが見つかりませんでした");
                    }
                });

                albumGrid.appendChild(imgElement);
            }
        } 
    };

    // connが本物のP2P接続オブジェクトの場合
    if (conn && typeof conn.on === 'function') {
        conn.on('data', (incomingBox) => {
            processData(incomingBox);
        });
    } else {
        // connがダミー（自分自身）の場合は、引数として届いたp2pboxをそのまま直接処理する
        processData(p2pbox);
    }
}
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

        const albumGrid = document.getElementById('album-grid');
    if (albumGrid) {
        albumGrid.innerHTML = '';
        for (const item of p2pbox) {
            const fileName = item.path.toLowerCase();
            const isImage = (fileName.endsWith('.jpeg') || fileName.endsWith('.jpg') || fileName.endsWith('.png'));
            if (isImage) {
                const imageUrl = URL.createObjectURL(item.binary);
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.className = 'album-art';
                imgElement.style.cursor = 'pointer';
                imgElement.addEventListener('click', () => {
                    const currentFolder = item.path.substring(0, item.path.lastIndexOf('/') + 1);
                    const matchingAudio = p2pbox.find(a => a.path.startsWith(currentFolder) && a.path.toLowerCase().endsWith('.mp3'));
                    if (matchingAudio) {
                        const audioPlayer = document.getElementById('main-player');
                        if (audioPlayer) {
                            audioPlayer.src = URL.createObjectURL(matchingAudio.binary);
                            audioPlayer.play();
                            alert(`${currentFolder} の曲を再生します`);
                        }
                    }
                });
                albumGrid.appendChild(imgElement);
            }
        }
    }
    
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
            const HOST_ID = "p2p-music-library-main-host-room";
            
            if (myId !== HOST_ID && !connectedPeers.has(HOST_ID)) {
                console.log("メインへ接続を試みます");
                const conn = peer.connect(HOST_ID);
                
                conn.on('open', () => {
                    console.log("マッチング成功、データを送信します");
                    connectedPeers.add(HOST_ID); 
                    conn.send(p2pbox); 
                });

                conn.on('close', () => {
                    connectedPeers.delete(HOST_ID); 
                });

                setupReceivedData(conn, p2pbox);
            }
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