import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemsModal from './itemsModal';
import DiscountsModal from './discountsModal';
import EditItemsModal from './editItemsModal';
import CartItem from './cartItem';
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


  useEffect(() => {
    axios.get('/Salon.json')
      .then(response => {
        setItems(response.data.items);
        setDiscounts(response.data.discounts);
        setCurrencyCode(response.data.currency_code);
      })
      .catch(error => console.error('JSON 파일을 불러오는 데 실패했습니다. : ', error));
  }, []);

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

  const handleEditDiscounts = (discountKey: string, selectedItems: string[]) => {
    const newCartDiscounts = { ...cartDiscounts };

    newCartDiscounts[discountKey] = selectedItems;

    setCartDiscounts(newCartDiscounts);
  };

  const handleChangeCount = (key: string, count: number) => {
    const newCartItems = { ...cartItems };

    if (newCartItems[key]) {
      newCartItems[key].count = count;
    }

    setCartItems(newCartItems);
  };

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

  const handleDeleteDiscount = (key: string) => {
    const newCartDiscounts = { ...cartDiscounts };
    delete newCartDiscounts[key];

    setCartDiscounts(newCartDiscounts);
  };

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
          <p>장바구니가 비어 있습니다</p>
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
              <div key={discountKey} className={styles.item}>
                <span>{discounts[discountKey].name} - {discounts[discountKey].rate * 100}%</span>
                <span> (적용된 아이템: {itemKeys.map((itemKey: string) => cartItems[itemKey]?.name || '삭제된 아이템').join(', ')})</span>
                <button onClick={() => handleDeleteDiscount(discountKey)}>삭제</button>
                <button onClick={() => { setEditDiscountKey(discountKey); setEditItemsModalOpen(true); }}>수정</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>
          <span>총 가격: {getCurrencySymbol(currencyCode)}{calculateTotalPrice()}</span>
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
