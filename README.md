### **[Semi-Project]**

# Google Gemini API를 활용한 AI 번역 기능, 커뮤니티 기본 기능을 제공하는 통합 웹사이트 구축

안녕하세요. 이 세미프로젝트는 Webkit640 7기 (2025년 대학·기업 협력형 SW아카데미 사업 풀스택 개발자 양성과정 7기)에 제출한 Node.js와 React.js를 활용하여 개발한 풀스택 웹 애플리케이션입니다. Google Gemini API를 활용한 AI 번역 기능과 함께, 사용자들이 소통할 수 있는 기본적인 커뮤니티 기능을 제공합니다.

-----

### **주요 기능**

  * **AI 번역 기능**:
      * 텍스트 및 웹사이트 URL을 입력하여 번역할 수 있습니다.
      * 번역 결과를 클립보드에 복사하거나, 게시글로 바로 공유할 수 있습니다.
      * Gemini API의 API 키, 프롬프트, 테마 등을 사용자가 직접 설정할 수 있습니다.
  * **커뮤니티 게시판**:
      * 게시글(작성, 조회, 수정, 삭제) 및 댓글(작성, 수정, 삭제) 기능
      * 게시글 제목, 내용, 댓글을 통합하여 검색하는 기능
      * 회원가입 및 로그인 등 기본적인 사용자 인증 기능

-----

### **기술 스택**

  * **프론트엔드 (Frontend)**: `React.js`
  * **백엔드 (Backend)**: `Node.js`, `Express.js`
  * **데이터베이스 (Database)**: `MySQL`
  * **형상관리 (Version Control)**: `Git`, `GitHub`

-----

### **설치 및 실행 방법**

**1. 프로젝트 클론하기**

```bash
git clone https://github.com/your-username/semi-project.git
cd semi-project
```

**2. 백엔드 설정**

`backend` 폴더로 이동한 후, `node_modules`를 설치하고 `.env` 파일을 생성합니다.

```bash
cd backend
npm install
```

`.env` 파일에 아래 내용을 작성하여 데이터베이스 정보를 설정합니다.

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=semi_project
JWT_SECRET=your_jwt_secret
```

설정이 완료되면 서버를 실행합니다.

```bash
node server.js
```

**3. 프론트엔드 설정**

`frontend` 폴더로 이동한 후, `node_modules`를 설치하고 프로젝트를 실행합니다.

```bash
cd frontend
npm install
npm start
```

프로젝트가 `http://localhost:3000` (또는 다른 포트)에서 실행됩니다.

-----

### **시스템 아키텍처**

이 프로젝트는 **프론트엔드**와 **백엔드**가 분리된 풀스택 아키텍처로 구성되어 있습니다.

  * **프론트엔드(React)**: 사용자의 요청을 처리하며, 백엔드의 API를 호출합니다.
  * **백엔드(Node.js)**: API 요청에 따라 MySQL 데이터베이스와 Google Gemini API를 활용하여 응답을 보냅니다.
