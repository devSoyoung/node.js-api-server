// DB 서버의 정보, JWT 생성 시 사용되는 secret 키의 정보 관리
// 보안 관련 파일은 따로 분리해서 관리해야 함
// remote repository 에 코드를 올릴 때, .gitignore 에 해당 파일을 추가해서 공유되지 않도록 설정

const password = 'your password';

module.exports = {
  'secret': 'SeCrEtKeYfOrHaShInG',
  'mongodbUri': `mongodb+srv://yours:${password}@your info`,
};