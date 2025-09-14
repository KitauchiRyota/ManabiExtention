(function(){
    // UI作成
    const controls = document.createElement('div');
    controls.id = 'table-display-controls';
    controls.style.margin = '0 auto';
    // UIをページ先頭に挿入
    controls.innerHTML = `<button id="table-display-btn" style="margin:10px auto; display:block;">振替受講生一覧を表示</button>`;
    document.body.insertBefore(controls, document.body.firstChild);

    const anketoControls = document.createElement('div');
    anketoControls.id =  'anketo-result-table-controls';
    anketoControls.style.margin = '0 auto';
    anketoControls.innerHTML = `<button id="anketo-result-table-display-btn" style="margin:10px auto; display:block;">アンケート結果を表示</button>`;
    document.body.insertBefore(anketoControls, document.body.firstChild);

    const btn = document.getElementById('table-display-btn');
    btn.addEventListener('click', async () => {
        btn.disabled = true;
        const rtable = await displayTable();
        btn.after(rtable);
    })

    const anketo_btn = document.getElementById('anketo-result-table-display-btn');
    anketo_btn.addEventListener('click' , () => {
        anketo_one();
        anketo_btn.disabled = true;
    })
})();

const getDocumentFromUrl = async (url) => {
    try{
        const response = await fetch(url);
        const htmlText = await response.text();
        const parser = new DOMParser();
        return parser.parseFromString(htmlText, 'text/html');
    }catch(error){
        console.error(`document取得に失敗しました。`, error);
        return null;
    }
};

async function displayTable() {

    // 1. ページ内にある全ての対象 <a> タグをリストとして取得します
    const linkElements = document.querySelectorAll('a.list-group-item');

    const numGroups = linkElements.length;

    // 最終的な出力結果をすべて保存するための、空のリストを用意します
    const finalOutputList = [];

    if (numGroups === 0) {
    console.error('処理を中断しました: 対象のリンクが見つかりません。');
    return;
    }

    // 2. 取得した全てのリンクに対して、ループ処理を実行します
    for (const [index, linkElement] of linkElements.entries()) {

        // a. 親ページの所属名を取得
        let groupName = '';
        const h4Element = linkElement.querySelector('h4');
        if (h4Element) {
        const fullText = h4Element.textContent.trim();
        const parts = fullText.split(/\s+/);
        //   「O班」を取得
        groupName = parts.length > 1 ? parts[1] : fullText;
        } else {
        continue; 
        }
        
        // b. 子ページの受講者名を取得
        const url = linkElement.href;

        try {
        const response = await fetch(url);
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const table = doc.querySelector('table.list');

        if (table) {
            const allRows = table.querySelectorAll('tbody tr');
            allRows.forEach(row => {
            const nameCell = row.cells[0];
            const classFrom = row.cells[3].textContent.trim();
            if (classFrom) {
                const name = nameCell.textContent.trim();
                // c. 「所属名\t名前」の形式で、最終結果リストに直接追加します
                finalOutputList.push({groupId:index,studentName:name,originClass:classFrom});
            }
            //   if (nameCell) {
            //     const name = nameCell.textContent.trim();
            //     // c. 「所属名\t名前」の形式で、最終結果リストに直接追加します
            //     finalOutputList.push(`${groupName}\t${name}`);
            //   }
            });
        } else {
            console.log(`データなし: ${groupName} (${url}) のページにテーブルが見つかりませんでした。`);
        }

        } catch (error) {
        console.error(`データ取得に失敗しました (${url}):`, error);
    }
    }   

    // 3. 全てのループが完了した後、溜めた結果を改行でつないで一度だけ出力します
    const rtable = document.createElement('table');
    rtable.border = '1';
    // rtable.style.borderCollapse = 'collapse';
    rtable.style.margin = '0 auto';
    rtable.style.color = '#000000';
    rtable.style.marginBottom = '20px';
    rtable.style.fontSize = '13px';
    rtable.style.fontFamily = 'Arial, sans-serif';
    rtable.style.border = '1px solid #B7B7B7';

    const headerRow = document.createElement('tr');
    const headers = ['班', '受講生名', '振替状況'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    rtable.appendChild(headerRow);

    for(let i=0;i<numGroups;i++){
        if(finalOutputList.filter(item => item.groupId === i).length === 0){
            const groupRow = document.createElement('tr');
            const groupId = document.createElement('td');
            groupId.textContent = `${i+1}班`;
            groupRow.appendChild(groupId);
            const tmpCell = document.createElement('td');
            tmpCell.colSpan = 2;
            tmpCell.textContent = `${i+1}班振替受講生無し`;
            groupRow.appendChild(tmpCell);
            rtable.appendChild(groupRow);
        }else{
            for(const [index,item] of finalOutputList.filter(item => item.groupId === i).entries()){
                const groupRow = document.createElement('tr');
                const groupId = document.createElement('td');
                groupId.textContent = `${i+1}班`;
                groupRow.appendChild(groupId);
                const nameCell = document.createElement('td');
                nameCell.textContent = item.studentName;
                const classCell = document.createElement('td');
                classCell.textContent = item.originClass;
                groupRow.appendChild(nameCell);
                groupRow.appendChild(classCell);
                rtable.appendChild(groupRow);
            }
        }
    }

    if (finalOutputList.length > 0) {
        console.log(finalOutputList.join('\n'));
        console.log(`--- 全ての処理が完了しました ---`);
    } else {
        console.log("有効なデータが1件も見つかりませんでした。");
    }
    //   const wrapper = document.createElement('div');
    //   wrapper.innerHTML = finalOutputList.join('<br>');
    return rtable;
    // document.body.after(rtable, document.body.firstChild);
}

const getAnketoResultFromDoc = (doc) => {
    
    // アンケート結果の表を取得
    const table = doc.querySelector('table');
    
    // ヘッダ行から，集計対象のインデックス（列）と個数を取得する
    const headers = table.rows[0].cells;

    let n_topics = 0; // 集計対象のトピック数

    // インデックスとトピック名を格納する辞書型配列を宣言
    let topics_dict = [];

    for (let i = 0; i < headers.length; i++) {
        let headerText = headers[i].textContent;
        
        if(headerText.includes('で扱った内容について') && headerText.includes('あてはまるものを答えてください')) {
        // 「，」と「、」を考慮．半角全角のパターンも考慮するとパターン数が多くなるので置換はしない．
            // 「」の中身を取得
            topics_dict.push( { name : headerText.match(/「(.*?)」/)[1] , index : i } );
            n_topics++;
        }
    }

    // 結果を格納する空の配列を宣言．
    let diffs = []; // 難易度
    let satis = []; // 満足度

    const n_rows = table.rows.length; // 表の行数

    for (let i = 0; i < topics_dict.length; i++) {  // トピック数分ループ
        let diffs_tmp = [0, 0, 0];
        let satis_tmp = [0, 0, 0, 0];
        
        for (let j = 1; j < n_rows; j++) { // 1行目はヘッダ行なので2行目から
            let diff = table.rows[j].cells[topics_dict[i].index].textContent;
            let sat = table.rows[j].cells[topics_dict[i].index + 1].textContent;

            // 先頭の値を10進数に変換
            let diffValue = parseInt(diff[1], 10);
            let satValue = parseInt(sat[1], 10);

            if (diffValue >= 1 && diffValue <= 3) {
                diffs_tmp[diffValue - 1]++;
            }

            if (satValue >= 1 && satValue <= 4) {
                // eval(`satis${satValue}++`);
                satis_tmp[satValue - 1]++;
            }
        }
        // 結果を配列に格納
        diffs.push(diffs_tmp);
        satis.push(satis_tmp);
    }
    return { diffs, satis };

    // // 結果のテキストを生成
    // let resultText = "集計結果\n";

    // for (let index = 0; index < topics_dict.length; index++) {
    //     resultText += `topic${index + 1} ${topics_dict[index].name}\n`;
    //     resultText += `理解度\n1：${diffs[index][0]}\n2：${diffs[index][1]}\n3：${diffs[index][2]}\n\n`;
    //     resultText += `満足度\n1：${satis[index][0]}\n2：${satis[index][1]}\n3：${satis[index][2]}\n4：${satis[index][3]}\n\n`;
    // }

    // // コンソールログに表示
    // console.log(resultText);
}

const displayAnketoResultTable = (diffs,satis,doc) => {
    const n_topics = diffs.length;
    // テーブル作成
    const rtable = document.createElement('table');
    rtable.border = '1';
    // rtable.style.borderCollapse = 'collapse';
    rtable.style.margin = '0 auto';
    rtable.style.color = '#000000';
    rtable.style.marginBottom = '20px';
    rtable.style.fontSize = '13px';
    rtable.style.fontFamily = 'Arial, sans-serif';
    rtable.style.border = '1px solid #B7B7B7'; // グレーの枠線


    // スタイル調整用関数
    const setCellStyle = (cell, isHeader = false) => {
        // cell.style.padding = '6px 10px';
        // cell.style.textAlign = 'center';
        if (isHeader) {
            cell.style.padding = '6px 10px';
            cell.style.textAlign = 'center';
            cell.style.fontWeight = 'bold';
            cell.style.backgroundColor = '#f0f0f0';
        }
    };

    // 1行目ヘッダー
    const headerRow1 = document.createElement('tr');

    // 空セル（行番号列）
    let blank = document.createElement('th');
    blank.rowSpan = 3; // ヘッダー用に3行分の高さを確保
    setCellStyle(blank, true);
    headerRow1.appendChild(blank);

    // 難易度ヘッダー
    let th1 = document.createElement('th');
    th1.colSpan = n_topics * 3; // 3段階評価
    th1.textContent = '難易度';
    setCellStyle(th1, true);
    headerRow1.appendChild(th1);

    // 満足度ヘッダー
    let th2 = document.createElement('th');
    th2.colSpan = n_topics * 4; // 4段階評価
    th2.textContent = '満足度';
    setCellStyle(th2, true);
    headerRow1.appendChild(th2);

    rtable.appendChild(headerRow1);

    // 2行目：トピックヘッダー
    const headerRow2 = document.createElement('tr');
    for (let i = 0; i < n_topics; i++) {
        // 難易度のトピック
        const th = document.createElement('th');
        th.colSpan = 3; // 3段階評価
        th.innerHTML = `topic${i + 1}`;
        // th.innerHTML = `topic${i + 1}<br>${topics_dict[i].name}`;
        setCellStyle(th, true);
        headerRow2.appendChild(th);
    }
    for (let i = 0; i < n_topics; i++) {
        // 満足度のトピック
        const th2 = document.createElement('th');
        th2.colSpan = 4; // 4段階評価
        th2.innerHTML = `topic${i + 1}`;
        // th2.innerHTML = `topic${i + 1}<br>${topics_dict[i].name}`;
        setCellStyle(th2, true);
        headerRow2.appendChild(th2);
    }
    rtable.appendChild(headerRow2);

    // 3行目：評価ヘッダー
    const headerRow3 = document.createElement('tr');
    for (let i = 0; i < n_topics; i++) {
        for (let j = 0; j < 3; j++) {
            // 難易度の評価
            const th = document.createElement('th');
            th.textContent = `${j + 1}`;
            setCellStyle(th, true);
            headerRow3.appendChild(th);
        }
    }

    for (let i = 0; i < n_topics; i++) {
        for (let j = 0; j < 4; j++) {
            // 満足度の評価
            const th = document.createElement('th');
            th.textContent = `${j + 1}`;
            setCellStyle(th, true);
            headerRow3.appendChild(th);
        }
    }
    rtable.appendChild(headerRow3);

    // データ行を1行だけ作成
    const row = document.createElement('tr');
    const rowHeader = document.createElement('th');
    rowHeader.textContent = "結果";
    setCellStyle(rowHeader, true);
    row.appendChild(rowHeader);

    // 難易度からデータを追加
    for (let i = 0; i < n_topics; i++) {
        for (let j = 0; j < 3; j++) {
            const td = document.createElement('td');
            td.textContent = diffs[i][j]
            setCellStyle(td);
            td.style.backgroundColor = (i % 2 === 0) ? '#FFFFFF': '#EFEFEF';
            row.appendChild(td);
        }
    }
    for (let i = 0; i < n_topics; i++) {
        for (let j = 0; j < 4; j++) {
            const td = document.createElement('td');
            td.textContent = satis[i][j]
            setCellStyle(td);
            td.style.backgroundColor = (i % 2 === 0) ? '#FFFFFF': '#EFEFEF';
            row.appendChild(td);
        }
    }

    rtable.appendChild(row);
    doc.body.insertBefore(rtable, doc.body.firstChild);

    // ラッパーdivを作成して中央ぞろえ
    const wrapper = document.createElement('div');
    // wrapper.style.display = 'flex';
    wrapper.style.marginLeft = '40px';
    wrapper.style.marginTop = '40px'; // 上部の余白を追加
    wrapper.style.fontSize = '14px';
    wrapper.style.fontFamily = 'Arial, sans-serif';
    wrapper.style.fontFamily = 'bold';


    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    p1.textContent = "・アンケート集計結果です．";
    p2.textContent = "・この表はGoogleドキュメントにコピー＆ペーストできます．";
    // p3.textContent = "・連続して実行すると結果が変わるので，集計しなおす場合は一度ページを更新してください．";
    wrapper.appendChild(p1);
    wrapper.appendChild(p2);
    // wrapper.appendChild(p3);

    // ページの先頭に追加
    doc.body.after(wrapper, doc.body.firstChild);
}

const anketo_one = async () =>{
    // ページ内にある全ての対象 <a> タグをリストとして取得
    const linkElements = document.querySelectorAll('a.list-group-item');
    const numGroups = linkElements.length;

    // 最終的な出力結果
    // const finalOutputList = [];

    if (numGroups === 0) {
        console.error('処理を中断しました: 対象のリンクが見つかりません。');
        return;
    }

    // 結果を格納する空の配列を宣言
    let diffs_result = [];
    let satis_result = [];

    for (const [index, linkElement] of linkElements.entries()) {
        // 「O班」を取得
        let groupName = '';
        const h4Element = linkElement.querySelector('h4');
        if (h4Element) {
            const fullText = h4Element.textContent.trim();
            const parts = fullText.split(/\s+/);
            
            groupName = parts.length > 1 ? parts[1] : fullText;
        } else {
            continue;
        }
        
        // 子ページのhtmlを取得
        const url = linkElement.href;

        try {
            const response = await fetch(url);
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // 「アンケート」ボタンのaタグを取得
            const anketoBtn = Array.from(doc.querySelectorAll('a.btn.btn-sm.btn-primary'))
                .find(btn => btn.textContent.trim() === 'アンケート');

            if (anketoBtn) {
                const anketoUrl = anketoBtn.href;
                const anketoDoc = await getDocumentFromUrl(anketoUrl);
                if(anketoDoc){
                    const { diffs, satis } = getAnketoResultFromDoc(anketoDoc);
                    console.log('diffs:'+diffs);
                    console.log('satis:'+satis);
                    if(index ===  0){
                        // 初回のループでは配列へコピー
                        diffs_result = structuredClone(diffs);
                        satis_result = structuredClone(satis);
                    } else {
                        // 2回目以降は配列の各要素を加算
                        const n_topics = diffs_result.length;
                        const n_diffs = 3;
                        const n_satis = 4;
                        for (let i = 0; i < n_topics; i++) {
                            for (let j = 0; j < n_diffs; j++) {
                                diffs_result[i][j] += diffs[i][j];
                            }
                            for (let j = 0; j < n_satis; j++) {
                                satis_result[i][j] += satis[i][j];
                            }
                        }
                    }
                }else{
                    console.log(`${groupName}のページでアンケートページのdocumentを取得できませんでした。`);
                }
            } else {
                console.log(`${groupName}のページでアンケートボタンを取得できませんでした。`);
            }
        } catch (error) {
            console.error(`データ取得に失敗しました (${url}):`, error);
        }
    }
    displayAnketoResultTable(diffs_result, satis_result, document);
    // console.log('diffs:'+JSON.stringify(diffs_result));
    // console.log('status:'+JSON.stringify(satis_result));
}