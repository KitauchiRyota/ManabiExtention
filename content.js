// by Cline (,Kitaucni) 2025
(function () {
    // 対象要素のリストを取得
    const items = Array.from(document.querySelectorAll('.list-group-item.list-group-item-warning'));
    if (items.length === 0) {
        return;
    }
    const parent = items[0].parentNode; // UI挿入位置のために親要素を取得

    // 並び替えUIを作成
    const sort_controls = document.createElement('div');
    sort_controls.id = 'sort-controls';
    sort_controls.style.margin = '10px 0';

    sort_controls.innerHTML = `
    <select id="sort-key">
        <option value="title-asc">タイトル昇順(A→Z)</option>
        <option value="title-desc">タイトル降順(Z→A)</option>
        <option value="date-asc">日付昇順(01/01→12/31)</option>
        <option value="date-desc">日付降順(12/31→01/01)</option>
    </select>
    <button id="sort-btn" style="margin-left:8px;">並び替え</button>
    `;

    // 親要素の直前にUIを挿入
    parent.parentNode.insertBefore(sort_controls, parent);

    // 並び替え関数
    function sortItems(items, key) {
        return items.slice().sort((a, b) => {
            // タイトル取得
            const getTitle = el => (el.querySelector('h4.list-group-item-heading')?.textContent || '').trim();

            // 日付取得
            const getDate = el => {
                const divs = el.querySelector('.list-group-item-body')
                const date_string = (divs.querySelector('ul.list-inline').querySelectorAll('li i.fa.fa-clock-o')[0]?.textContent || '').trim();
                const isoString = date_string.replace(
                    /(\d{4})\/(\d{1,2})\/(\d{1,2})\s(.+)/,
                    (match, year, month, day, time) => {
                        const paddedMonth = month.padStart(2, '0');
                        const paddedDay = day.padStart(2, '0');
                        // 年月日をハイフンで、日付と時刻の間を'T'でつなぐ
                        return `${year}-${paddedMonth}-${paddedDay}T${time}`;
                    }
                );
                return new Date(isoString);
            };

            let vA, vB, cmp;
            switch (key) {
                case 'title-asc':
                    vA = getTitle(a); vB = getTitle(b);
                    cmp = vA.localeCompare(vB, 'ja');
                    break;
                case 'title-desc':
                    vA = getTitle(a); vB = getTitle(b);
                    cmp = vB.localeCompare(vA, 'ja');
                    break;
                case 'date-asc':
                    vA = getDate(a); vB = getDate(b);
                    cmp = vA - vB;
                    break;
                case 'date-desc':
                    vA = getDate(a); vB = getDate(b);
                    cmp = vB - vA;
                    break;
                default:
                    cmp = 0;
            }
            return cmp;
        });
    }

    // ボタンイベント
    document.getElementById('sort-btn').addEventListener('click', () => {
        const key = document.getElementById('sort-key').value;
        const sorted = sortItems(items, key);
        sorted.forEach(item => parent.appendChild(item));
        // 既存のアイテムをappendChildで末尾に移動させることで並び替えを実現
    });
})();
