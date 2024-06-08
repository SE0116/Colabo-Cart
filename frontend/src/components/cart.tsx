import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemsModal from './itemsModal';
import DiscountsModal from './discountsModal';
import EditItemsModal from './editItemsModal';
import CartItem from './cartItem';
import DiscountItem from './discountItem';
import styles from '../css_modules/cart.module.css';


const exchangeRates: { [key: string]: number } = {
  'KRW': 1,
  'USD': 0.00085,
  'EUR': 0.00072
};

const Cart: React.FC = () => {
  const [isItemsModalOpen, setItemsModalOpen] = useState(false);
  const [isDiscountsModalOpen, setDiscountsModalOpen] = useState(false);
  const [isEditItemsModalOpen, setEditItemsModalOpen] = useState(false);

  const [editDiscountKey, setEditDiscountKey] = useState<string | null>(null);

  const [items, setItems] = useState<{ [key: string]: { count: number; name: string; price: number } }>({});
  const [discounts, setDiscounts] = useState<{ [key: string]: { name: string; rate: number } }>({});
  const [cartItems, setCartItems] = useState<{ [key: string]: { count: number; name: string; price: number } }>({});
  const [cartDiscounts, setCartDiscounts] = useState<{ [key: string]: string[] }>({});

  const [currencyCode, setCurrencyCode] = useState<string>('KRW');  // 최종 금액을 계산하기 전 가격은 원 단위이기 때문에 KRW로 초기화

  // json 파일에서 데이터를 받아 시술, 할인, 국가 통화 코드에 대한 정보를 저장합니다.
  useEffect(() => {
    axios.get('/Salon.json')
      .then(response => {
        setItems(response.data.items);
        setDiscounts(response.data.discounts);
        setCurrencyCode(response.data.currency_code);
      })
      .catch(error => console.error('JSON 파일을 불러오는 데 실패했습니다. : ', error));
  }, []);

  // 선택한 시술 아이템을 장바구니에 담습니다.
  // 요구 사항에 따라 이미 등록된 아이템은 중복으로 장바구니에 담지 않습니다.
  const handleAddItems = (selectedItems: string[]) => {
    const newCartItems = { ...cartItems };

    selectedItems.forEach(itemKey => {
      if (!newCartItems[itemKey]) {
        newCartItems[itemKey] = { ...items[itemKey], count: 1 };
      }
    });

    setCartItems(newCartItems);
    setItemsModalOpen(false);
  };

  // 선택한 할인 아이템을 장바구니에 담습니다.
  // 시술 아이템과 동일하게 중복 아이템은 담지 않습니다.
  const handleAddDiscounts = (selectedDiscounts: string[]) => {
    const newCartDiscounts = { ...cartDiscounts };

    selectedDiscounts.forEach(discountKey => {
      if (!newCartDiscounts[discountKey]) {
        newCartDiscounts[discountKey] = Object.keys(cartItems);
      }
    });

    setCartDiscounts(newCartDiscounts);
    setDiscountsModalOpen(false);
  };

  // 장바구니에 담긴 할인 아이템에 대해 할인을 적용할 시술 아이템을 설정합니다.
  const handleEditDiscounts = (discountKey: string, selectedItems: string[]) => {
    const newCartDiscounts = { ...cartDiscounts };

    newCartDiscounts[discountKey] = selectedItems;

    setCartDiscounts(newCartDiscounts);
  };

  // 시술 아이템의 수량을 변경합니다.
  const handleChangeCount = (key: string, count: number) => {
    const newCartItems = { ...cartItems };

    if (newCartItems[key]) {
      newCartItems[key].count = count;
    }

    setCartItems(newCartItems);
  };

  // 장바구니에 담은 시술 아이템을 삭제합니다.
  // 오류 방지를 위해 삭제하려는 시술 아이템에 대해 적용되는 할인이 있으면 해당 할인을 해제시키고 시술 아이템을 삭제합니다.
  const handleDeleteItem = (key: string) => {
    const newCartDiscounts = { ...cartDiscounts };

    Object.keys(newCartDiscounts).forEach(discountKey => {
      newCartDiscounts[discountKey] = newCartDiscounts[discountKey].filter(itemKey => itemKey !== key);

      if (newCartDiscounts[discountKey].length === 0) {
        delete newCartDiscounts[discountKey];
      }
    });

    const newCartItems = { ...cartItems };
    delete newCartItems[key];

    setCartDiscounts(newCartDiscounts);
    setCartItems(newCartItems);
  };

  // 장바구니에 담은 할인 아이템을 삭제합니다.
  const handleDeleteDiscount = (key: string) => {
    const newCartDiscounts = { ...cartDiscounts };
    delete newCartDiscounts[key];

    setCartDiscounts(newCartDiscounts);
  };

  // 장바구니에 담긴 전체 아이템에 대해 가격을 계산합니다.
  // 우선 원 단위로 계산 후 현재 currency code 에 맞는 환율을 곱해 최종 값을 계산합니다.
  const calculateTotalPrice = () => {
    const itemTotal = Object.values(cartItems).reduce((total, item) => {
      return total + item.price * item.count;
    }, 0);

    const discountTotal = Object.entries(cartDiscounts).reduce((total, [discountKey, itemKeys]) => {
      const discount = discounts[discountKey].rate;
      const discountAmount = itemKeys.reduce((sum, itemKey) => {
        return sum + (cartItems[itemKey].price * cartItems[itemKey].count * discount);
      }, 0);
      return total + discountAmount;
    }, 0);

    const totalPriceInKRW = itemTotal - discountTotal;
    return totalPriceInKRW * exchangeRates[currencyCode];
  };

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'KRW':
        return '₩';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'JPY':
        return '¥';
      default:
        return '';
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>장바구니</h1> 
      </div>
      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${isItemsModalOpen ? styles.active : ''}`}
          onClick={() => setItemsModalOpen(true)}
        >
          시술
        </button>
        <button
          className={`${styles.button} ${isDiscountsModalOpen ? styles.active : ''}`}
          onClick={() => setDiscountsModalOpen(true)}
        >
          할인
        </button>
      </div>

      <div className={styles.content}>
        {Object.keys(cartItems).length === 0 && Object.keys(cartDiscounts).length === 0 ? (
          <div className={styles.emptyCart}>
            <p>장바구니가 비어 있습니다</p>
            <img className={styles.emptyCartImage} src={`${process.env.PUBLIC_URL}/emptyCart.png`} alt=''></img>
          </div>
          ) : (
            <div>
            {Object.entries(cartItems).map(([key, item]) => (
              <CartItem
              key={key}
              item={item}
              onChangeCount={(count) => handleChangeCount(key, count)}
              onDelete={() => handleDeleteItem(key)}
              />
            ))}

            {Object.entries(cartDiscounts).map(([discountKey, itemKeys]) => (
              <DiscountItem
                  key={discountKey}
                  discount={discounts[discountKey]}
                  itemKeys={itemKeys}
                  cartItems={cartItems}
                  onDelete={() => handleDeleteDiscount(discountKey)}
                  onEdit={() => { setEditDiscountKey(discountKey); setEditItemsModalOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>


      <div className={styles.footer}>
        <div className={styles.total}>
          <p>합계</p>
          <p>{getCurrencySymbol(currencyCode)} {calculateTotalPrice()}</p>
        </div>
        <button className={styles.nextButton}>다음</button>
      </div>

      {isItemsModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setItemsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <ItemsModal
              isOpen={isItemsModalOpen}
              onClose={() => setItemsModalOpen(false)}
              items={items}
              onAddItems={handleAddItems}
            />
          </div>
        </div>
      )}

      {isDiscountsModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setDiscountsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <DiscountsModal
              isOpen={isDiscountsModalOpen}
              onClose={() => setDiscountsModalOpen(false)}
              discounts={discounts}
              onAddDiscounts={handleAddDiscounts}
            />
          </div>
        </div>
      )}

      {isEditItemsModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setEditItemsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <EditItemsModal
              isOpen={isEditItemsModalOpen}
              onClose={() => setEditItemsModalOpen(false)}
              cartItems={cartItems}
              appliedDiscounts={cartDiscounts}
              discountKey={editDiscountKey!}
              onEditDiscounts={handleEditDiscounts}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
