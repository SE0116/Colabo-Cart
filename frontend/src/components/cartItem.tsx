import React from 'react';
import styles from '../css_modules/cartItem.module.css';


interface CartItemProps {
    item: { count: number; name: string; price: number };
    onChangeCount: (count: number) => void;
    onDelete: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onChangeCount, onDelete }) => {
  return (
    <div>
      <p className={styles.itemName}>{item.name}</p>

      <div className={styles.itemQuantity}>
        <p className={styles.itemPrice}>{item.price * item.count}</p>

        <div>
          <select className={styles.selectButton} value={item.count} onChange={(e) => onChangeCount(Number(e.target.value))}>
            {[...Array(10).keys()].map(i => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <button className={styles.deleteButton} onClick={onDelete}>X</button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
