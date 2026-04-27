/*
  ╔════════════════════════════════════════════════════════════╗
  ║         持丸理貴 プロフィールサイト                         ║
  ║         main.js  —  ページの「動き」を定義するファイル     ║
  ╚════════════════════════════════════════════════════════════╝

  【JavaScript とは？】
  HTML = 骨格（構造）  /  CSS = 見た目  /  JS = 動き・インタラクション

  このファイルでやっていること:
    1. 星空アニメーション  (Canvas API で星を描画・またたかせる)
    2. ヘッダーのスクロールエフェクト (スクロールしたら境界線が出る)
    3. フェードインアニメーション (画面に入った要素がふわっと出現)
    4. ナビリンクのアクティブハイライト (現在のセクションを強調)

  【基本的な JS の読み方】
    // 一行コメント
    const 変数名 = 値;     → 変更しない変数
    let 変数名 = 値;       → 変更する変数
    function 名前() { }    → 関数（処理のかたまり）
    要素.addEventListener('イベント名', 処理);  → イベントの監視
*/


/* ══════════════════════════════════════════════════
   1. 星空アニメーション（Canvas API）

   HTML5 Canvas は「お絵描きキャンバス」のような要素です。
   JavaScript で線・円・テキストなどを自由に描けます。

   ここでは:
     - ランダムな位置に多数の円（＝星）を配置
     - 各星の透明度を sin 波で変化させてまたたきを表現
     - requestAnimationFrame で毎フレーム（約60回/秒）再描画
   ══════════════════════════════════════════════════ */

// HTML の <canvas class="star-canvas"> 要素を取得
const canvas = document.querySelector('.star-canvas');
/*
  getContext('2d') → 2次元描画コンテキストを取得
  ctx（コンテキスト）はキャンバスに描画するための「ペン」
  ctx.fillRect(), ctx.arc(), ctx.fillStyle など、
  様々な描画メソッドが使えます。
*/
const ctx = canvas.getContext('2d');

/* 星の設定値 */
const STAR_COUNT   = 160;   // 星の数
const STAR_MAX_R   = 1.8;   // 星の最大半径 (px)
const STAR_MIN_R   = 0.2;   // 星の最小半径 (px)

// 星のデータを格納する配列（後で initStars() が埋める）
let stars = [];


/**
 * キャンバスをウィンドウサイズに合わせてリサイズする関数
 *
 * ウィンドウリサイズ時や初期化時に呼ばれます。
 * canvas.width / canvas.height を設定しないと
 * 星が正しい位置に描画されません。
 */
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}


/**
 * 星を初期化する関数
 *
 * STAR_COUNT 個の星オブジェクトを作り、stars 配列に入れます。
 * 各星はランダムな位置・サイズ・またたきパラメータを持ちます。
 */
function initStars() {
  stars = [];  // 既存の星をクリア（リサイズ時などに呼ばれるため）

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      // Math.random() は 0 以上 1 未満のランダムな小数を返す
      // * canvas.width で「0 〜 キャンバス幅」の範囲になる
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,

      // 半径: STAR_MIN_R 〜 STAR_MAX_R のランダム値
      radius: Math.random() * (STAR_MAX_R - STAR_MIN_R) + STAR_MIN_R,

      // ベースとなる透明度 (0.2 〜 0.9)
      baseOpacity: Math.random() * 0.7 + 0.2,

      // またたきの速度（小さいほどゆっくり）
      twinkleSpeed: Math.random() * 0.015 + 0.004,

      // またたきの位相（全星が同時にまたたかないようにバラバラに）
      // Math.PI * 2 = 2π（sin 波の1周期）
      phase: Math.random() * Math.PI * 2,
    });
  }
}


/**
 * 毎フレーム呼ばれる描画関数
 *
 * @param {number} time - ページ表示からの経過時間 (ms)
 *                        requestAnimationFrame が自動的に渡してくれる
 */
function drawStars(time) {
  // キャンバスを全消去（前フレームの描画を消す）
  // clearRect(x, y, 幅, 高さ): 指定した矩形を透明にする
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    /*
      またたき効果:
      Math.sin(x) は -1 〜 +1 を往復する波を返す関数です。
      time * speed で「時間に応じて波が進む」表現になります。
      + star.phase で各星が異なるタイミングでまたたくようにします。
    */
    const sinVal   = Math.sin(time * star.twinkleSpeed + star.phase);
    // sinVal は -1〜1 → 0.5 + 0.5 * sinVal で 0〜1 に変換
    const twinkle  = 0.5 + 0.5 * sinVal;
    const alpha    = star.baseOpacity * (0.4 + 0.6 * twinkle);

    // 円を描く開始
    ctx.beginPath();
    /*
      arc(x, y, radius, startAngle, endAngle):
        x, y      = 中心座標
        radius    = 半径
        0 〜 Math.PI * 2 = 0° 〜 360° → 完全な円
    */
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    /*
      fillStyle: 塗りつぶし色
      rgba(赤, 緑, 青, 透明度): 青白い色（R:190, G:210, B:255）
    */
    ctx.fillStyle = `rgba(190, 210, 255, ${alpha.toFixed(3)})`;
    ctx.fill();  // 塗りつぶし実行
  });

  /*
    requestAnimationFrame(関数):
    ブラウザのリフレッシュタイミング（約60fps）に合わせて
    次フレームの描画をリクエストします。
    これで「毎フレーム drawStars が呼ばれる」無限ループができます。
  */
  requestAnimationFrame(drawStars);
}


/* ── 星空の初期化 & アニメーション開始 ── */
resizeCanvas();
initStars();
requestAnimationFrame(drawStars);  // アニメーションループ開始

/*
  ウィンドウリサイズ時の処理
  リサイズイベントは高頻度で発生するため、
  タイマーで「最後のリサイズから200ms後」だけ実行する
  「デバウンス」という最適化テクニックを使います。
*/
let resizeTimer;
window.addEventListener('resize', () => {
  // 前回のタイマーをキャンセル
  clearTimeout(resizeTimer);
  // 200ms 後に実行（その間に再度リサイズが来たらリセット）
  resizeTimer = setTimeout(() => {
    resizeCanvas();
    initStars();  // 新しいキャンバスサイズに合わせて星を再配置
  }, 200);
});


/* ══════════════════════════════════════════════════
   2. ヘッダーのスクロールエフェクト

   window.scrollY = 縦スクロール量 (px)
   スクロールが 10px を超えたら .scrolled クラスを追加。
   CSS で .scrolled のとき下線が表示されます。
   ══════════════════════════════════════════════════ */

// HTML の <header class="site-header"> を取得
const header = document.querySelector('.site-header');

/*
  scroll イベント: ページがスクロールされるたびに発火
  { passive: true } オプション:
    スクロール処理をブロックしないことをブラウザに伝える最適化。
    パフォーマンスが向上します。
*/
window.addEventListener('scroll', () => {
  /*
    classList.toggle(クラス名, 条件):
    条件が true  → クラスを追加
    条件が false → クラスを削除
  */
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ══════════════════════════════════════════════════
   3. フェードインアニメーション（IntersectionObserver）

   IntersectionObserver（交差監視 API）:
   特定の要素が「画面内に入ったか」を効率的に監視します。
   従来の scroll イベント + getBoundingClientRect() より
   はるかに効率的（処理が軽い）です。
   ══════════════════════════════════════════════════ */

/*
  querySelectorAll(): 条件に合う要素を「全部」取得する
  CSS セレクターの書き方をそのまま使えます。
  カンマ区切りで複数指定できます。
*/
const fadeTargets = document.querySelectorAll(
  '.pub-card, .activity-group, .contact-item, .hero-text > *, .hero-photo-col'
);

/*
  IntersectionObserver のコールバック関数:
  監視対象の要素が「交差状態変化」したとき呼ばれます。
  entries = 変化した要素のリスト
*/
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    /*
      entry.isIntersecting:
      true  = 要素が画面に入ってきた
      false = 要素が画面から出ていった
    */
    if (entry.isIntersecting) {
      // .visible クラスを追加 → CSS のフェードインが起動
      entry.target.classList.add('visible');

      /*
        一度フェードインしたら監視を外す:
        「画面から出ていっても再度フェードインしない」ようにします。
        また、不要な監視を減らしてパフォーマンスを向上させます。
      */
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  /*
    threshold: 0.08 = 要素の 8% が見えたらトリガー
    （0 だと少しでも入ったら、1 だと完全に見えたらトリガー）
  */
  threshold: 0.08,
  /*
    rootMargin:
    「画面の少し手前」でトリガーするようにします。
    '0px 0px -50px 0px' = 下方向に 50px 手前でトリガー
    → スクロールしてきたとき自然なタイミングでアニメーションが始まる
  */
  rootMargin: '0px 0px -50px 0px',
});

// 各要素にフェードインクラスを付け、監視を開始
fadeTargets.forEach((el, index) => {
  el.classList.add('fade-in');  // 「最初は透明」のスタイルを適用

  /*
    transitionDelay（CSS の transition-delay を JS から設定）:
    index * 0.07 秒ずつ遅らせることで、
    複数の要素が「連続してひとつずつ現れる」演出になります。
    例: index=0 → 0s, index=1 → 0.07s, index=2 → 0.14s, ...
  */
  el.style.transitionDelay = `${index * 0.07}s`;

  fadeObserver.observe(el);  // 監視開始
});


/* ══════════════════════════════════════════════════
   4. ナビリンクのアクティブハイライト

   現在画面に表示されているセクションに対応する
   ナビゲーションリンクを明るく（.active クラスを付与）します。
   ══════════════════════════════════════════════════ */

// id 属性を持つすべてのセクション（research, activities, contact）
const sections = document.querySelectorAll('section[id]');

// ナビゲーションの "#" 始まりのリンクのみを取得
// [href^="#"] = href 属性が "#" で始まる要素
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

/*
  threshold: 0.4 = セクションの 40% が画面に入ったら
  そのセクションが「現在地」と判定します。
*/
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // すべてのナビリンクから .active を外す
      navLinks.forEach(link => link.classList.remove('active'));

      // 現在のセクション ID に対応するリンクだけに .active を付ける
      // template literal: `...` の中に ${変数} で値を埋め込める
      const currentLink = document.querySelector(
        `.nav a[href="#${entry.target.id}"]`
      );
      if (currentLink) {
        currentLink.classList.add('active');
      }
    }
  });
}, {
  threshold: 0.4,
});

// 各セクションの監視を開始
sections.forEach(section => navObserver.observe(section));
