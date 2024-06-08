import React, { useState } from 'react';
import styles from '../css_modules/modal.module.css';


interface DiscountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  discounts: { [key: string]: { name: string; rate: number } };
  onAddDiscounts: (selectedDiscounts: string[]) => void;
}

const DiscountsModal: React.FC<DiscountsModalProps> = ({ isOpen, onClose, discounts, onAddDiscounts }) => {
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);

  const handleSelectDiscount = (discountKey: string) => {
    setSelectedDiscounts(prevSelected =>
      prevSelected.includes(discountKey)
        ? prevSelected.filter(key => key !== discountKey)
        : [...prevSelected, discountKey]
    );
  };

  const handleAddDiscounts = () => {
    onAddDiscounts(selectedDiscounts);
    setSelectedDiscounts([]);
  };

  if (!isOpen) return null;

  
  return (
    <div className="modal">
      <div className={styles.modalHeader}>
        <h2>할인 목록</h2>
        <button className={styles.closeButton} onClick={onClose}>X</button>
      </div>

      <hr />
      <div className={styles.itemList}>
        {Object.entries(discounts).map(([key, discount]) => (
          <div className={styles.flexCheckbox} key={key}>
            <label htmlFor={key}>
              <p className={styles.discountName}>{discount.name}</p>
              <p className={styles.discountRate}>{discount.rate * 100}%</p>
            </label>
            <input
              type="checkbox"
              id={key}
              checked={selectedDiscounts.includes(key)}
              onChange={() => handleSelectDiscount(key)}
            />
          </div>
        ))}
      </div>
      
      <button className={styles.applyButton} onClick={handleAddDiscounts}>확인</button>
    </div>
  );
}

export default DiscountsModal;
