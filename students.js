(function(){
    // UI作成
    const controls = document.createElement('div');
    controls.id = 'table-display-btn';
    controls.style.margin = '0 auto';
    // controlsをページ先頭に挿入
    controls.innerHTML = `
    <button id="table-display-btn" style="margin:10px auto; display:block;">受講生一覧を表示</button>
    `;
    document.body.insertBefore(controls, document.body.firstChild);
    
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
    document.body.insertBefore(rtable, document.body.firstChild);
    }
    const btn = document.getElementById('table-display-btn');
    btn.addEventListener('click', () => {
        displayTable();
    })
})();