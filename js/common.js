/* BRIOCHE — 공통 기능 */
(function(){
  // 경로 감지: pages/ 하위인지 root인지
  var inPages = location.pathname.indexOf('/pages/') !== -1;
  var PP = inPages ? '' : 'pages/'; // privacy/terms 경로 프리픽스
  var RP = inPages ? '../' : '';    // root 경로 프리픽스

  /* ─── 1. 쿠키 동의 배너 ─── */
  if(!localStorage.getItem('b_cookie_ok')){
    var cb=document.createElement('div');
    cb.id='cookie-banner';
    cb.innerHTML=
      '<div style="max-width:500px;margin:0 auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap">'+
      '<div style="flex:1;min-width:200px;font-size:13px;color:#4A4A44;line-height:1.6">'+
      '브리오슈는 더 나은 서비스를 위해 쿠키를 사용해요. '+
      '<a href="'+PP+'privacy.html" style="color:#B8862B;font-weight:600;text-decoration:underline">자세히 보기</a></div>'+
      '<div style="display:flex;gap:8px">'+
      '<button onclick="acceptCookie(false)" style="padding:8px 16px;font-size:12px;font-weight:600;border:1px solid #E6E4DF;border-radius:50px;background:#fff;color:#4A4A44;cursor:pointer;font-family:inherit">필수만</button>'+
      '<button onclick="acceptCookie(true)" style="padding:8px 16px;font-size:12px;font-weight:600;border:none;border-radius:50px;background:#1C1C1A;color:#fff;cursor:pointer;font-family:inherit">모두 동의</button>'+
      '</div></div>';
    cb.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:999;background:#fff;border-top:1px solid #E6E4DF;padding:16px 20px;box-shadow:0 -2px 16px rgba(0,0,0,.06);transform:translateY(100%);transition:transform .4s ease';
    document.body.appendChild(cb);
    setTimeout(function(){cb.style.transform='translateY(0)'},800);
  }
  window.acceptCookie=function(all){
    localStorage.setItem('b_cookie_ok',all?'all':'essential');
    var el=document.getElementById('cookie-banner');
    if(el){el.style.transform='translateY(100%)';setTimeout(function(){el.remove()},400)}
  };

  /* ─── 2. 구독 유도 팝업 ─── */
  if(!localStorage.getItem('b_sub_closed')){
    var triggered=false;
    window.addEventListener('scroll',function(){
      if(triggered)return;
      var pct=window.scrollY/(document.body.scrollHeight-window.innerHeight);
      if(pct>.4){triggered=true;showSubPopup()}
    });
  }
  function showSubPopup(){
    var overlay=document.createElement('div');
    overlay.id='sub-overlay';
    overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .3s';
    overlay.innerHTML=
      '<div style="background:#fff;border-radius:20px;padding:32px 28px;max-width:380px;width:100%;text-align:center;position:relative;box-shadow:0 8px 40px rgba(0,0,0,.12)">'+
      '<button onclick="closeSubPopup()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:20px;color:#8E8E86;cursor:pointer;line-height:1">&times;</button>'+
      '<div style="font-size:32px;margin-bottom:12px">🧈</div>'+
      '<div style="font-size:18px;font-weight:700;margin-bottom:6px">내일 조각도 받아볼까요?</div>'+
      '<div style="font-size:14px;color:#5C5C56;line-height:1.7;margin-bottom:20px">매일 아침, 내 가게 매출을 올리는<br>디자인 팁 한 조각을 보내드려요.</div>'+
      '<input type="email" placeholder="이메일 주소" style="width:100%;padding:12px 16px;font-size:15px;border:1px solid #E6E4DF;border-radius:12px;margin-bottom:10px;outline:none;font-family:inherit;box-sizing:border-box">'+
      '<button onclick="handleSub(this)" style="width:100%;padding:13px;font-size:15px;font-weight:600;background:#1C1C1A;color:#fff;border:none;border-radius:50px;cursor:pointer;font-family:inherit;margin-bottom:12px">무료 구독하기</button>'+
      '<div style="font-size:11px;color:#8E8E86;line-height:1.5">구독은 무료이며 언제든 취소할 수 있어요.<br>'+
      '<a href="'+PP+'privacy.html" style="color:#B8862B">개인정보처리방침</a> · '+
      '<a href="'+PP+'terms.html" style="color:#B8862B">이용약관</a></div>'+
      '</div>';
    document.body.appendChild(overlay);
    setTimeout(function(){overlay.style.opacity='1'},10);
    overlay.addEventListener('click',function(e){if(e.target===overlay)closeSubPopup()});
  }
  window.closeSubPopup=function(){
    localStorage.setItem('b_sub_closed','1');
    var el=document.getElementById('sub-overlay');
    if(el){el.style.opacity='0';setTimeout(function(){el.remove()},300)}
  };
  window.handleSub=function(btn){
    var inp=document.querySelector('#sub-overlay input');
    if(inp&&inp.value.includes('@')){
      btn.textContent='감사합니다! ☕';btn.style.background='#3D7A4A';
      setTimeout(closeSubPopup,1500);
    }
  };

  /* ─── 3. 공유 버튼 ─── */
  var ctaCard=document.querySelector('.cta');
  if(ctaCard){
    var shareBar=document.createElement('div');
    shareBar.style.cssText='display:flex;justify-content:center;gap:10px;padding:20px 24px 4px';
    shareBar.innerHTML=
      '<button onclick="shareKakao()" style="display:flex;align-items:center;gap:6px;padding:10px 18px;font-size:13px;font-weight:600;background:#FEE500;color:#3C1E1E;border:none;border-radius:50px;cursor:pointer;font-family:inherit">카카오 공유</button>'+
      '<button onclick="copyLink(this)" style="display:flex;align-items:center;gap:6px;padding:10px 18px;font-size:13px;font-weight:600;background:#fff;color:#4A4A44;border:1px solid #E6E4DF;border-radius:50px;cursor:pointer;font-family:inherit">링크 복사</button>';
    ctaCard.parentElement.insertBefore(shareBar,ctaCard);
  }
  window.shareKakao=function(){
    if(window.Kakao&&Kakao.isInitialized()){
      Kakao.Share.sendDefault({objectType:'feed',content:{title:document.title,description:'부드럽게 만드는 내 가게 디자인',imageUrl:'',link:{mobileWebUrl:location.href,webUrl:location.href}}});
    }else{
      window.open('https://story.kakao.com/share?url='+encodeURIComponent(location.href),'_blank');
    }
  };
  window.copyLink=function(btn){
    navigator.clipboard.writeText(location.href).then(function(){
      var orig=btn.textContent;btn.textContent='복사됨!';setTimeout(function(){btn.textContent=orig},1500);
    });
  };

  /* ─── 4. 맨 위로 스크롤 버튼 ─── */
  var topBtn=document.createElement('button');
  topBtn.id='scroll-top';
  topBtn.innerHTML='↑';
  topBtn.style.cssText='position:fixed;bottom:80px;right:20px;z-index:90;width:40px;height:40px;border-radius:50%;background:#fff;border:1px solid #E6E4DF;box-shadow:0 2px 8px rgba(0,0,0,.08);font-size:16px;color:#4A4A44;cursor:pointer;opacity:0;transition:opacity .3s;display:grid;place-items:center';
  topBtn.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})};
  document.body.appendChild(topBtn);
  window.addEventListener('scroll',function(){
    topBtn.style.opacity=window.scrollY>600?'1':'0';
    topBtn.style.pointerEvents=window.scrollY>600?'auto':'none';
  });

  /* ─── 5. 카카오 채널 플로팅 버튼 ─── */
  var kakaoFloat=document.createElement('a');
  kakaoFloat.href='#';
  kakaoFloat.target='_blank';
  kakaoFloat.id='kakao-float';
  kakaoFloat.innerHTML='<span style="font-size:18px">💬</span>';
  kakaoFloat.style.cssText='position:fixed;bottom:20px;right:20px;z-index:90;width:48px;height:48px;border-radius:50%;background:#FEE500;display:grid;place-items:center;box-shadow:0 2px 12px rgba(0,0,0,.12);text-decoration:none;transition:transform .2s';
  kakaoFloat.onmouseenter=function(){this.style.transform='scale(1.1)'};
  kakaoFloat.onmouseleave=function(){this.style.transform='scale(1)'};
  document.body.appendChild(kakaoFloat);

})();

/* ─── 6. 읽기 진행률 바 ─── */
var progBar=document.createElement('div');
progBar.id='read-progress';
document.body.appendChild(progBar);
window.addEventListener('scroll',function(){
  var h=document.body.scrollHeight-window.innerHeight;
  if(h>0)progBar.style.width=(window.scrollY/h*100)+'%';
});

/* ─── 7. 다크모드 ─── */
if(localStorage.getItem('b_dark')==='1')document.body.classList.add('dark');
// 토글 버튼은 topnav에 삽입
var navLinks=document.querySelector('.topnav-links');
if(navLinks){
  var darkBtn=document.createElement('button');
  darkBtn.id='dark-toggle';
  darkBtn.innerHTML=document.body.classList.contains('dark')?'☀️':'🌙';
  darkBtn.onclick=function(){
    document.body.classList.toggle('dark');
    var isDark=document.body.classList.contains('dark');
    localStorage.setItem('b_dark',isDark?'1':'0');
    darkBtn.innerHTML=isDark?'☀️':'🌙';
  };
  navLinks.insertBefore(darkBtn,navLinks.firstChild);
}

/* ─── 8. 읽기 시간 표시 ─── */
var articleEl=document.querySelector('.at');
if(articleEl){
  var textLen=document.querySelector('.w')?.innerText?.length||0;
  var mins=Math.max(1,Math.round(textLen/500));
  var badge=document.createElement('span');
  badge.className='read-time';
  badge.innerHTML='☕ '+mins+'분 읽기';
  var metaBar=document.querySelector('.mb');
  if(metaBar)metaBar.appendChild(badge);
}

/* ─── 9. 좋아요 버튼 (CTA 앞에 삽입) ─── */
var ctaEl=document.querySelector('.cta');
if(ctaEl){
  var likeCard=document.createElement('div');
  likeCard.className='c';
  var sliceId=document.querySelector('.sl')?.textContent?.match(/\d+/)?.[0]||'0';
  var likeKey='b_like_'+sliceId;
  var isLiked=localStorage.getItem(likeKey)==='1';
  var likeCount=parseInt(localStorage.getItem(likeKey+'_c')||'0');
  if(isLiked)likeCount=Math.max(likeCount,1);
  likeCard.innerHTML='<div class="like-card">'+
    '<button class="like-btn'+(isLiked?' liked':'')+'" onclick="toggleLike(this)">'+
    (isLiked?'👍 도움이 됐어요!':'👍 도움이 됐어요')+
    '</button>'+
    '<div class="like-count">'+(likeCount>0?likeCount+'명이 도움받았어요':'')+'</div></div>';
  ctaEl.parentElement.insertBefore(likeCard,ctaEl);
}
window.toggleLike=function(btn){
  var sliceId=document.querySelector('.sl')?.textContent?.match(/\d+/)?.[0]||'0';
  var key='b_like_'+sliceId;
  var liked=localStorage.getItem(key)==='1';
  var count=parseInt(localStorage.getItem(key+'_c')||'0');
  if(liked){
    localStorage.removeItem(key);
    count=Math.max(0,count-1);
    btn.classList.remove('liked');
    btn.textContent='👍 도움이 됐어요';
  }else{
    localStorage.setItem(key,'1');
    count++;
    btn.classList.add('liked');
    btn.textContent='👍 도움이 됐어요!';
  }
  localStorage.setItem(key+'_c',String(count));
  btn.nextElementSibling.textContent=count>0?count+'명이 도움받았어요':'';
};

/* ─── 10. 목차 퀵점프 (index.html에서만) ─── */
var cards=document.querySelectorAll('.c');
if(cards.length>5){
  var tocFab=document.createElement('button');
  tocFab.id='toc-fab';
  tocFab.innerHTML='☰';
  tocFab.title='목차';
  document.body.appendChild(tocFab);

  var tocPanel=document.createElement('div');
  tocPanel.id='toc-panel';
  var sections=[
    {q:'.intro',label:'인사'},
    {q:'.hook',label:'핵심 숫자'},
    {q:'.why',label:'왜 매출이 오를까'},
    {q:'.ab',label:'오늘의 한조각'},
    {q:'.sh',label:'따라하기'},
    {q:'.din',label:'지금 바로'},
    {q:'.tip',label:'주의사항'},
    {q:'.tools-title',label:'사용한 도구'},
    {q:'.cl',label:'내일 예고'},
    {q:'.cta',label:'99디자인'},
    {q:'.ah',label:'지난 조각'}
  ];
  sections.forEach(function(s){
    var el=document.querySelector(s.q);
    if(el){
      var a=document.createElement('a');
      a.textContent=s.label;
      a.href='#';
      a.onclick=function(e){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth',block:'center'});
        tocPanel.classList.remove('show');
      };
      tocPanel.appendChild(a);
    }
  });
  document.body.appendChild(tocPanel);

  tocFab.onclick=function(){tocPanel.classList.toggle('show')};
  window.addEventListener('scroll',function(){
    tocFab.className=window.scrollY>400?'show':'';
    if(window.scrollY<=400)tocPanel.classList.remove('show');
  });
  document.addEventListener('click',function(e){
    if(!tocFab.contains(e.target)&&!tocPanel.contains(e.target))tocPanel.classList.remove('show');
  });
}

/* ─── 11. 이전 방문 조각 기억 ─── */
var currentSlice=document.querySelector('.sl')?.textContent?.match(/\d+/)?.[0];
if(currentSlice)localStorage.setItem('b_last_slice',currentSlice);
