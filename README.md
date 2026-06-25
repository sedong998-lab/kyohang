# 교행 단일 사이트

`apps`, `packages`, `shared` 없이 하나의 웹사이트만 관리하는 단순한 Vite + React 프로젝트입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 표시되는 주소를 열면 됩니다. 보통 다음 주소입니다.

```text
http://localhost:5173
```

## 기존 교행 문서 옮기기

기존 저장소에서 아래 폴더 안의 내용을 복사합니다.

```text
kyohang-sites/apps/kyohang/src/content
```

이 프로젝트의 아래 폴더에 붙여넣습니다.

```text
kyohang-single-site/src/content
```

즉, 최종 구조는 다음처럼 됩니다.

```text
kyohang-single-site
├─ src
│  ├─ content
│  │  ├─ 급여
│  │  ├─ 기록물
│  │  ├─ 산업안전보건
│  │  ├─ 서무
│  │  └─ 인사
│  ├─ App.tsx
│  ├─ content.ts
│  ├─ main.tsx
│  └─ style.css
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

## 새 글 작성 방법

`src/content` 안에 `.md` 파일을 만들면 됩니다.

```md
---
title: 문서 제목
date: 2026-06-25
---

# 문서 제목

본문을 작성합니다.
```

## 배포

Cloudflare Pages 기준 설정 예시입니다.

- Build command: `npm run build`
- Build output directory: `dist`
