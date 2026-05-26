/**
 * 브리오슈 매일 콘텐츠 자동 생성 스크립트
 * GitHub Actions에서 매일 실행됨
 * 
 * 흐름:
 * 1. content-plan.md에서 오늘 조각 번호 계산
 * 2. Claude API로 초안 생성
 * 3. HTML 템플릿에 삽입
 * 4. 파일 저장 (PR로 올라감, 머지는 재영이 직접)
 */

const fs = require('fs');
const path = require('path');

// 시작일 기준으로 조각 번호 계산
const START_DATE = new Date('2026-05-20');
const today = new Date();
const diffDays = Math.floor((today - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
const sliceNum = diffDays;

// content-plan.md에서 주제 데이터 읽기 (실제 구현 시 파싱)
// 여기서는 간단한 JSON으로 관리하는 방식 예시
const planFile = path.join(__dirname, '..', 'data', 'plan.json');

async function generateContent() {
  console.log(`🍞 브리오슈 ${sliceNum}조각째 생성 시작`);
  console.log(`📅 날짜: ${today.toISOString().split('T')[0]}`);

  // plan.json에서 오늘 주제 읽기
  let plan;
  try {
    plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
  } catch (e) {
    console.error('❌ data/plan.json을 찾을 수 없습니다.');
    process.exit(1);
  }

  const todayPlan = plan.find(p => p.slice === sliceNum);
  if (!todayPlan) {
    console.error(`❌ ${sliceNum}조각째에 해당하는 주제가 없습니다.`);
    process.exit(1);
  }

  console.log(`📝 주제: ${todayPlan.title}`);

  // Claude API 호출
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY가 설정되지 않았습니다.');
    process.exit(1);
  }

  const systemPrompt = fs.readFileSync(
    path.join(__dirname, '..', 'data', 'system-prompt.txt'), 'utf8'
  );

  const userPrompt = `오늘은 브리오슈 ${sliceNum}조각째입니다.
날짜: ${today.toISOString().split('T')[0]}

주제: ${todayPlan.title}
카테고리: ${todayPlan.category}
오늘의 즉각 실행: ${todayPlan.action}
내일 주제: ${todayPlan.nextTitle}

아래 구조에 맞게 내용을 작성해주세요:

[인사] [숫자 후킹] [왜 이게 매출과 연결되는지] [본문] [따라하기] [지금 바로 할 수 있는 것] [주의사항] [사용한 도구] [내일 예고] [99디자인 CTA]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    const content = data.content[0].text;

    // 초안을 drafts/ 폴더에 저장
    const draftsDir = path.join(__dirname, '..', 'drafts');
    if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir);

    const draftFile = path.join(draftsDir, `slice-${sliceNum}.md`);
    fs.writeFileSync(draftFile, `# ${sliceNum}조각째 — ${todayPlan.title}\n\n${content}`);

    console.log(`✅ 초안 저장: drafts/slice-${sliceNum}.md`);
    console.log('📋 PR이 생성되면 재영이 검수 후 머지하세요.');

  } catch (error) {
    console.error('❌ API 호출 실패:', error.message);
    process.exit(1);
  }
}

generateContent();
