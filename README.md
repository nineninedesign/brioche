# 🧈 브리오슈 (Brioche)

**부드럽게 만드는 내 가게 디자인 · 하루 한 조각**

디자인 무경험 소상공인을 위한 매일 한 편 웹 매거진입니다.

## 구조

```
├── index.html              ← 메인 (오늘의 조각)
├── 404.html                ← 에러 페이지
├── pages/
│   ├── archive.html        ← 전체 조각 보기
│   ├── about.html          ← 서비스 소개
│   ├── login.html          ← 로그인/회원가입
│   ├── privacy.html        ← 개인정보처리방침
│   └── terms.html          ← 이용약관
├── css/style.css           ← 디자인 시스템 (배포용)
├── js/common.js            ← 공통 기능 (배포용)
├── scripts/
│   └── generate-daily.js   ← 매일 콘텐츠 자동 생성
├── data/
│   ├── plan.json           ← 30일 주제 데이터
│   └── system-prompt.txt   ← AI 생성 프롬프트
├── drafts/                 ← 자동 생성된 초안 (검수 대기)
├── content-plan.md         ← 30일 콘텐츠 플랜
├── prompt-template.md      ← 프롬프트 템플릿 설명
└── .github/workflows/
    ├── daily-brioche.yml   ← 매일 초안 생성 자동화
    └── deploy.yml          ← GitHub Pages 자동 배포
```

## 운영 흐름

1. 매일 오전 6시(KST) → GitHub Actions가 Claude API로 초안 생성
2. PR(Pull Request)이 자동으로 올라옴 → 검수 체크리스트 포함
3. 재영이 초안 확인·수정 → Merge 버튼 클릭
4. 자동으로 GitHub Pages에 배포

## 세팅 방법

1. 이 저장소를 GitHub에 올린다
2. Settings → Pages → Source를 "GitHub Actions"로 설정
3. Settings → Secrets → `ANTHROPIC_API_KEY` 추가
4. 끝. 매일 오전 6시에 자동으로 돌아갑니다.

## 수동 실행

Actions 탭 → "브리오슈 매일 초안 생성" → "Run workflow" 클릭

## 만든 사람

99디자인 · [brioche.kr](https://brioche.kr)
