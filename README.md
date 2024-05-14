# Summery of The Refactoring Second Edition 

## 작성목적

Reafactoring의 2판을 summery 하여  
레거시의 리팩토링 연습 재료로 삼음


## how to use

Chapter별로 디렉토리가 있음  
Chapter 디렉토리 내 요약 markdown file과 실행 코드를 넣음  


## Install & Run

#### install

```sh
$ npm install --save-dev
```

#### Run test
- `ChapterNN` 디렉토리 이동하여 `npm run test`

```sh
$ cd Chapter04
../Chapter04 $ npm run test
> test
> mocha
  app.spec.js
    ✔ sayHello should return hello
...
  3 passing (8ms)
```

## example
+ 챕터 텍스트의 요약
  - Chapter01/README.md  
+ code의 요약
  - Chapter01/codes/blabla.js  
  - 리팩토링의 과정상 커밋이 추가될것이므로 `git` `branch`와 `tag`로 구분함.
  - `Branch` : Chapter별로 나눈 브랜치, 리팩토링 진행상의 커밋은 해당 Branch에서 진행함.
  - `tag` : Chapter별 가장 최근 커밋을 표시함 (Chapter01, 02, ...)


## 실행 환경

+ `Javascript`
  - nodejs v20.11.1
+ 이외 라이브러리
  - [package.json](https://github.com/gonnichiwa/Refactoring-2ndEdition-summery/blob/master/package.json) 참조
