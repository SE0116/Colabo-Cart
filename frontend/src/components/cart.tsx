import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemsModal from './itemsModal';
import DiscountsModal from './discountsModal';
import CartItem from './cartItem';

const Cart: React.FC = () => {
  const [isItemsModalOpen, setItemsModalOpen] = useState(false);
  const [isDiscountsModalOpen, setDiscountsModalOpen] = useState(false);
  const [items, setItems] = useState<{ [key: string]: { count: number; name: string; price: number } }>({});
  const [discounts, setDiscounts] = useState<{ [key: string]: { name: string; rate: number } }>({});
  const [cartItems, setCartItems] = useState<{ [key: string]: { count: number; name: string; price: number } }>({});
  const [cartDiscounts, setCartDiscounts] = useState<{ [key: string]: { name: string; rate: number } }>({});

  useEffect(() => {
    axios.get('/Salon.json')
      .then(response => {
        setItems(response.data.items);
        setDiscounts(response.data.discounts);
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
        newCartDiscounts[discountKey] = discounts[discountKey];
      }
    });

    setCartDiscounts(newCartDiscounts);
    setDiscountsModalOpen(false);
  };

  const handleChangeCount = (key: string, count: number) => {
    const newCartItems = { ...cartItems };

    if (newCartItems[key]) {
      newCartItems[key].count = count;
    }

    setCartItems(newCartItems);
  };

  const handleDeleteItem = (key: string) => {
    const newCartItems = { ...cartItems };
    delete newCartItems[key];
    setCartItems(newCartItems);
  };

  const handleDeleteDiscount = (key: string) => {
    const newCartDiscounts = { ...cartDiscounts };
    delete newCartDiscounts[key];
    setCartDiscounts(newCartDiscounts);
  };

  return (
    <div>
      <h1>장바구니</h1>
      <button onClick={() => setItemsModalOpen(true)}>추가</button>
      <button onClick={() => setDiscountsModalOpen(true)}>할인</button>

      <ItemsModal
        isOpen={isItemsModalOpen}
        onClose={() => setItemsModalOpen(false)}
        items={items}
        onAddItems={handleAddItems}
        />

      <DiscountsModal
        isOpen={isDiscountsModalOpen}
        onClose={() => setDiscountsModalOpen(false)}
        discounts={discounts}
        onAddDiscounts={handleAddDiscounts}
        />

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

          {Object.entries(cartDiscounts).map(([key, discount]) => (
            <div key={key}>
              <span>{discount.name} - {discount.rate * 100}%</span>
              <button onClick={() => handleDeleteDiscount(key)}>삭제</button>
              <button onClick={() => setItemsModalOpen(true)}>수정</button>
            </div>
          ))}
        </div>
      )}
      
      <button>다음</button>
    </div>
  );
}

export default Cart;
