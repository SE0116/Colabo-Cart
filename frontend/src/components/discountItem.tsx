import React from 'react';
import styles from '../css_modules/discountItem.module.css';


interface DiscountItemProps {
    discount: { name: string; rate: number };
    itemKeys: string[];
    cartItems: { [key: string]: { count: number; name: string; price: number } };
    onDelete: () => void;
    onEdit: () => void;
}

const DiscountItem: React.FC<DiscountItemProps> = ({ discount, itemKeys, cartItems, onDelete, onEdit }) => {
  const discountAmount = itemKeys.reduce((sum, itemKey) => {
    const item = cartItems[itemKey];
    return sum + (item ? item.price * item.count * discount.rate : 0);
  }, 0);


  return (
    <div>
      <p className={styles.discountName}>{discount.name}</p>

      <div className={styles.itemEdit}>
        <p className={styles.discountedItem}>{itemKeys.map((itemKey: string) => cartItems[itemKey]?.name || '삭제된 아이템').join(', ')}</p>
        <div>
          <button className={styles.editButton} onClick={onEdit}>수정</button>
          <button className={styles.deleteButton} onClick={onDelete}>X</button>
        </div>
      </div>

      <p className={styles.discountRate}>{discount.rate * 100}% (-{discountAmount}원)</p>
    </div>
  );
};

export default DiscountItem;
