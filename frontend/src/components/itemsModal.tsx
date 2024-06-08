import React, { useState } from 'react';
import styles from '../css_modules/modal.module.css';


interface ItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: { [key: string]: { count: number; name: string; price: number } };
  discounts?: { [key: string]: { name: string; rate: number } };
  onAddItems: (selectedItems: string[]) => void;
}

const ItemsModal: React.FC<ItemsModalProps> = ({ isOpen, onClose, items, discounts, onAddItems }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (itemKey: string) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(itemKey)
        ? prevSelected.filter(key => key !== itemKey)
        : [...prevSelected, itemKey]
    );
  };

  const handleAddItems = () => {
    onAddItems(selectedItems);
    setSelectedItems([]);
  };

  if (!isOpen) return null;

  
  return (
    <div className="modal">
      <div className={styles.modalHeader}>
        <h2>아이템 목록</h2>
        <button className={styles.closeButton} onClick={onClose}>X</button>
      </div>

      <hr />

      <div className={styles.itemList}>
        {items && Object.entries(items).map(([key, item]) => (
          <div className={styles.flexCheckbox} key={key}>
            <label htmlFor={key}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemPrice}>{item.price}</p>
            </label>
            <input
              type="checkbox"
              id={key}
              checked={selectedItems.includes(key)}
              onChange={() => handleSelectItem(key)}
            />
          </div>
        ))}
      </div>

      {discounts && Object.entries(discounts).map(([key, discount]) => (
        <div key={key}>
          <input
            type="checkbox"
            id={key}
            checked={selectedItems.includes(key)}
            onChange={() => handleSelectItem(key)}
          />
          <label htmlFor={key}>{discount.name} - {discount.rate * 100}%</label>
        </div>
      ))}

      <button className={styles.applyButton} onClick={handleAddItems}>확인</button>
    </div>
  );
}

export default ItemsModal;