# Colabo-Cart
장바구니 페이지 구현 웹 페이지

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=JavaScript&logoColor=white"/>

<img src="https://github.com/SE0116/Colabo-Cart/assets/87646738/8e1f79d6-a58f-4b18-ba05-2274ad932861" width="270" height="300">
 

## 주요 기능
### 장바구니에 담기
- 원하는 서비스를 장바구니에 담고, 수량 및 할인 적용 여부를 선택할 수 있게 했습니다.

![salon_1](https://github.com/SE0116/Colabo-Cart/assets/87646738/cfa26d90-f89c-4bcc-ae83-e9fdfa4afbd6)
![salon_2](https://github.com/SE0116/Colabo-Cart/assets/87646738/76eef002-50e3-4c81-9e66-3e94c56d615f)

### 장바구니 목록 삭제
- 장바구니에 담긴 시술 / 할인 아이템을 삭제 후 남아있는 아이템들의 총 가격을 계산합니다.

![salon_3](https://github.com/SE0116/Colabo-Cart/assets/87646738/f785e4c2-73b2-4387-bd3b-29f22e508ccb)


## 구현 사항 체크리스트
- [x] `item`, `discount`는 각각 장바구니로 추가/삭제 가능
- [x] 동일한 아이템을 장바구니로 담을 수 없음
- [x] `item`의 수량 선택 가능 eg. `item x 3`
- [x] `discount`의 할인 대상 `item`을 선택하지 않으면 장바구니에 담긴 모든 `item`을 할인 적용
- [x] `discount`의 할인 대상 `item`을 선택한 경우 선택한 항목만 할인 적용
- [x] 장바구니에 담긴 내용이 변경될 때 마다 사용자에게 최종 금액을 표시
- [x] 최종 금액은 `currency_code`에 따라 표시
  - 현재 가능한 화폐 단위는 KRW, USD, EUR 세 가지입니다.


## 고민했던 점
### axios vs fetch
- 별도의 라이브러리 설치가 필요없고 비교적 가벼운 fetch를 사용할 가능성을 고려했습니다.
- 브라우저 호환성 등의 의도치 못한 변수가 생길 경우를 대비하고자 axios를 사용하기로 결정했습니다.

### CSS
- 코드의 가독성을 위해 css 파일을 분리하고자 했습니다.
- 전역 CSS 오염을 막고자 했습니다.  
- 위의 두 조건을 만족하는 CSS Modules를 사용하기로 결정했습니다.

- 서로 다른 파일에 일부 동일한 CSS 코드가 작성된 이유 ( ex : 버튼 )
  - 당장은 동일한 코드일 수 있지만 이후 수정사항이 생겼을 경우 다른 컴포넌트의 CSS가 영향을 받지 않게 하기 위해 서로 다른 CSS 파일로 분리했습니다.
  - 모달 창에 관한 경우 위와 같이 분리된 파일로 작성하려 했지만, 각 모달 창에서의 동작 과정이 동일하고 이후 변경 될 가능성이 적다고 생각해 하나의 CSS 파일로 코드를 작성했습니다.

### 오류 수정
- 시술과 할인 아이템을 추가하고, 할인이 적용되어 있는 시술 아이템을 삭제 시 오류가 발생했습니다.
  - 시술 삭제 시 할인 대상 아이템에서 해당 시술을 먼저 제거하고 삭제 처리가 될 수 있게 변경했습니다.


## 아쉬운 점
- TDD 방식으로 테스트 코드를 작성하려 했지만 중간에 테스트 코드를 작성하지 않고 코드를 작성해 이후에 발생한 axios 관련 오류로 정상적인 테스트를 하지 못했습니다.
- 결과를 한눈에 볼 수 있게 배포를 시도하던 중 버전 불일치 문제를 해결하지 못해 배포에 실패했습니다.


## 프로젝트 구조
```bash
├── frontend
│   ├── node_modules
│   ├── public
│   ├── src
│   │   ├── __tests__
│   │   │    └── cart.test.tsx        # TDD 방식으로 구현하기 위한 테스트 파일
│   │   ├── components
│   │   │    ├── cart.tsx             # 장바구니 컴포넌트
│   │   │    ├── cartItem.tsx         # 시술 버튼을 통해 담긴 아이템에 대한 컴포넌트
│   │   │    ├── discountItem.tsx     # 할인 버튼을 통해 담긴 아이템에 대한 컴포넌트
│   │   │    ├── discountsModal.tsx   # 장바구니 내의 할인 버튼에 대한 모달 컴포넌트
│   │   │    ├── editItemsModal.tsx   # 할인 목록 수정 버튼에 필요한 모달 컴포넌트
│   │   │    └── itemsModal.tsx       # 장바구니 내의 시술 버튼에 대한 모달 컴포넌트
│   │   ├── css_modules
│   │   │    ├── cart.module.css 
│   │   │    ├── cartItem.module.css 
│   │   │    ├── discountItem.module.css 
│   │   │    └── modal.module.css 
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
``` 