// 並び替えUIの挿入と並び替え処理
(function () {
  // 対象リストの親要素を取得
  const items = Array.from(document.querySelectorAll('.list-group-item.list-group-item-warning'));
  if (items.length === 0) return;
  const parent = items[0].parentNode;

  // 並び替えUIを作成
  const controls = document.createElement('div');
  controls.id = 'sort-controls';
  controls.style.margin = '10px 0';

  controls.innerHTML = `
    <select id="sort-key">
      <option value="title-asc">タイトル昇順</option>
      <option value="title-desc">タイトル降順</option>
      <option value="date-asc">日付昇順</option>
      <option value="date-desc">日付降順</option>
    </select>
    <button id="sort-btn" style="margin-left:8px;">並び替え</button>
  `;

  // 親要素の直前にUIを挿入
  parent.parentNode.insertBefore(controls, parent);

  // 並び替え関数
  function sortItems(items, key) {
    return items.slice().sort((a, b) => {
      // タイトル取得
      const getTitle = el => (el.querySelector('h4.list-group-item-heading')?.textContent || '').trim();
    //   const getDate = el => (el.querySelector('.fa.fa-clock-o')?.textContent || '').trim();

      // 日付取得
      const getDate = el => {
        // Find the clock icon anywhere inside el
        const clock = el.querySelector('.fa-clock-o');
        if (!clock) return '';
        // The date text may be in a text node or span after the icon

        let node = clock.nextSibling;
        // Skip empty text nodes
        while (node && node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
          node = node.nextSibling;
        }
        if (!node) return '';
        return (node.textContent || node.nodeValue || '').trim();
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
          cmp = vA.localeCompare(vB, 'ja');
          break;
        case 'date-desc':
          vA = getDate(a); vB = getDate(b);
          cmp = vB.localeCompare(vA, 'ja');
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
  });
})();
