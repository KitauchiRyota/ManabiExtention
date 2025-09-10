(function () {// ラッパーdivを作成して中央ぞろえ
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
p3.textContent = "・連続して実行すると結果が変わるので，集計しなおす場合は一度ページを更新してください．";
wrapper.appendChild(p1);
wrapper.appendChild(p2);
wrapper.appendChild(p3);

// ページの先頭に追加
document.body.insertBefore(wrapper, document.body.firstChild);
})();

// // 25Std用汎用型アンケート集計スクリプト
// // 2025.05.12　25Std3rd前に作成
// // Created with collaboration of Kitauchi, chatGPT, and GitHub Copilot.


// // アンケート結果の表を取得
// const table = document.querySelector('table');

// // ヘッダ行から，集計対象のインデックス（列）と個数を取得する
// const headers = table.rows[0].cells;

// var n_topics = 0; // 集計対象のトピック数

// // インデックスとトピック名を格納する辞書型配列を宣言
// var topics_dict = [];

// for (let i = 0; i < headers.length; i++) {
//     let headerText = headers[i].textContent;
    
//     if(headerText.includes('で扱った内容について') && headerText.includes('あてはまるものを答えてください')) {
//     // 「，」と「、」を考慮．半角全角のパターンも考慮するとパターン数が多くなるので置換はしない．
//         // 「」の中身を取得
//         topics_dict.push( { name : headerText.match(/「(.*?)」/)[1] , index : i } );
//         n_topics++;
//     }
// }

// // 結果を格納する空の配列を宣言．
// var diffs = []; // 難易度
// var satis = []; // 満足度

// const n_rows = table.rows.length; // 表の行数

// for (let i = 0; i < topics_dict.length; i++) {  // トピック数分ループ
//     var diff1 = 0;
//     var diff2 = 0;
//     var diff3 = 0;

//     var satis1 = 0;
//     var satis2 = 0;
//     var satis3 = 0;
//     var satis4 = 0;
    
//     for (let j = 1; j < n_rows; j++) { // 1行目はヘッダ行なので2行目から
//         let diff = table.rows[j].cells[topics_dict[i].index].textContent;
//         let sat = table.rows[j].cells[topics_dict[i].index + 1].textContent;

//         let diffValue = parseInt(diff[1], 10); // 10進数に変換
//         let satValue = parseInt(sat[1], 10);

//         if (diffValue >= 1 && diffValue <= 3) {
//             eval(`diff${diffValue}++`);
//         }

//         if (satValue >= 1 && satValue <= 4) {
//             eval(`satis${satValue}++`);
//         }
//     }
//     // 結果を配列に格納
//     diffs.push([diff1, diff2, diff3]);
//     satis.push([satis1, satis2, satis3, satis4]);
// }

// // 結果をアラートで表示
// let resultText = "集計結果\n";

// for (let index = 0; index < topics_dict.length; index++) {
//     resultText += `topic${index + 1} ${topics_dict[index].name}\n`;
//     resultText += `理解度\n1：${diffs[index][0]}\n2：${diffs[index][1]}\n3：${diffs[index][2]}\n\n`;
//     resultText += `満足度\n1：${satis[index][0]}\n2：${satis[index][1]}\n3：${satis[index][2]}\n4：${satis[index][3]}\n\n`;
// }

// // alert(resultText);

// // コンソールログにも表示
// console.log(resultText);

// // テーブル作成
// const rtable = document.createElement('table');
// rtable.border = '1';
// // rtable.style.borderCollapse = 'collapse';
// rtable.style.margin = '0 auto';
// rtable.style.color = '#000000';
// rtable.style.marginBottom = '20px';
// rtable.style.fontSize = '13px';
// rtable.style.fontFamily = 'Arial, sans-serif';
// rtable.style.border = '1px solid #B7B7B7'; // グレーの枠線


// // スタイル調整用関数
// const setCellStyle = (cell, isHeader = false) => {
//     // cell.style.padding = '6px 10px';
//     // cell.style.textAlign = 'center';
//     if (isHeader) {
//         cell.style.padding = '6px 10px';
//         cell.style.textAlign = 'center';
//         cell.style.fontWeight = 'bold';
//         cell.style.backgroundColor = '#f0f0f0';
//     }
// };

// // 1行目ヘッダー
// const headerRow1 = document.createElement('tr');

// // 空セル（行番号列）
// let blank = document.createElement('th');
// blank.rowSpan = 3;
// setCellStyle(blank, true);
// headerRow1.appendChild(blank);

// // 難易度ヘッダー
// let th1 = document.createElement('th');
// th1.colSpan = n_topics * 3; // 3段階評価
// th1.textContent = '難易度';
// setCellStyle(th1, true);
// headerRow1.appendChild(th1);

// // 満足度ヘッダー
// let th2 = document.createElement('th');
// th2.colSpan = n_topics * 4; // 4段階評価
// th2.textContent = '満足度';
// setCellStyle(th2, true);
// headerRow1.appendChild(th2);

// rtable.appendChild(headerRow1);

// // 2行目：トピックヘッダー
// const headerRow2 = document.createElement('tr');
// for (let i = 0; i < n_topics; i++) {
//     // 難易度のトピック
//     const th = document.createElement('th');
//     th.colSpan = 3; // 3段階評価
//     th.textContent = `topic${i + 1}`;
//     setCellStyle(th, true);
//     headerRow2.appendChild(th);
// }
// for (let i = 0; i < n_topics; i++) {
//     // 満足度のトピック
//     const th2 = document.createElement('th');
//     th2.colSpan = 4; // 4段階評価
//     th2.textContent = `topic${i + 1}`;
//     setCellStyle(th2, true);
//     headerRow2.appendChild(th2);
// }
// rtable.appendChild(headerRow2);

// // 3行目：評価ヘッダー
// const headerRow3 = document.createElement('tr');
// for (let i = 0; i < n_topics; i++) {
//     for (let j = 0; j < 3; j++) {
//         // 難易度の評価
//         const th = document.createElement('th');
//         th.textContent = `${j + 1}`;
//         setCellStyle(th, true);
//         headerRow3.appendChild(th);
//     }
// }

// for (let i = 0; i < n_topics; i++) {
//     for (let j = 0; j < 4; j++) {
//         // 満足度の評価
//         const th = document.createElement('th');
//         th.textContent = `${j + 1}`;
//         setCellStyle(th, true);
//         headerRow3.appendChild(th);
//     }
// }
// rtable.appendChild(headerRow3);

// // データ行を1行だけ作成
// const row = document.createElement('tr');
// const rowHeader = document.createElement('th');
// rowHeader.textContent = "結果";
// setCellStyle(rowHeader, true);
// row.appendChild(rowHeader);

// // 難易度からデータを追加
// for (let i = 0; i < n_topics; i++) {
//     for (let j = 0; j < 3; j++) {
//         const td = document.createElement('td');
//         td.textContent = diffs[i][j]
//         setCellStyle(td);
//         td.style.backgroundColor = (i % 2 === 0) ? '#FFFFFF': '#EFEFEF';
//         row.appendChild(td);
//     }
// }
// for (let i = 0; i < n_topics; i++) {
//     for (let j = 0; j < 4; j++) {
//         const td = document.createElement('td');
//         td.textContent = satis[i][j]
//         setCellStyle(td);
//         td.style.backgroundColor = (i % 2 === 0) ? '#FFFFFF': '#EFEFEF';
//         row.appendChild(td);
//     }
// }

// rtable.appendChild(row);
// document.body.insertBefore(rtable, document.body.firstChild);

// // ラッパーdivを作成して中央ぞろえ
// const wrapper = document.createElement('div');
// // wrapper.style.display = 'flex';
// wrapper.style.marginLeft = '40px';
// wrapper.style.marginTop = '40px'; // 上部の余白を追加
// wrapper.style.fontSize = '14px';
// wrapper.style.fontFamily = 'Arial, sans-serif';
// wrapper.style.fontFamily = 'bold';


// const p1 = document.createElement('p');
// const p2 = document.createElement('p');
// const p3 = document.createElement('p');
// p1.textContent = "・アンケート集計結果です．";
// p2.textContent = "・この表はGoogleドキュメントにコピー＆ペーストできます．";
// p3.textContent = "・連続して実行すると結果が変わるので，集計しなおす場合は一度ページを更新してください．";
// wrapper.appendChild(p1);
// wrapper.appendChild(p2);
// wrapper.appendChild(p3);

// // ページの先頭に追加
// document.body.insertBefore(wrapper, document.body.firstChild);


// alert("集計結果をページの先頭に表形式で出力しました．\n\nコンソールログにも表示しています．");