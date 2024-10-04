# 가져올 image 정의
FROM node:20.11.0
# 경로 설정
# WORKDIR /editor
# pakage.json를 workdir에 복사 (.은 설정한 워킹 디렉토리를 의미함)
COPY package.json .
COPY package-lock.json .

# 명령어 실행 (의존성 설치)
RUN npm install
# RUN yarn upgrade

# 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사
COPY . ./

# 각각의 명령어들은 1줄씩 캐싱되어 실행된다.
# 작업 시 package.json의 내용은 자주 바뀌지 않지만 소스코드는 자주 변경이 된다.
# npm install과 COPY . . 를 동시에 수행하면 소스코드의 변화가 미미하더라도
# 항상 install을 수행해서 리소스가 낭비된다.

# 3000 포트 노출  
EXPOSE 3000  

# npm start 스크립트 실행
CMD [ "npm", "start" ]