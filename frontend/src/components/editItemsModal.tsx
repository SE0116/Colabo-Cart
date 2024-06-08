import React, { useState } from 'react';
import styles from '../css_modules/modal.module.css';


interface EditItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { [key: string]: { count: number; name: string; price: number } };
  appliedDiscounts: { [key: string]: string[] };
  discountKey: string;
  onEditDiscounts: (discountKey: string, selectedItems: string[]) => void;
}

const EditItemsModal: React.FC<EditItemsModalProps> = ({ isOpen, onClose, cartItems, appliedDiscounts, discountKey, onEditDiscounts }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(appliedDiscounts[discountKey] || []);

  const handleSelectItem = (itemKey: string) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(itemKey)
        ? prevSelected.filter(key => key !== itemKey)
        : [...prevSelected, itemKey]
    );
  };

  const handleSaveChanges = () => {
    onEditDiscounts(discountKey, selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  
  return (
    <div className="modal">
      <div className={styles.modalHeader}>
        <h2>할인 적용 아이템 선택</h2>
        <button className={styles.closeButton} onClick={onClose}>X</button>
      </div>

      <hr />

      {Object.entries(cartItems).map(([key, item]) => (
        <div key={key}>
          <input
            type="checkbox"
            id={key}
            checked={selectedItems.includes(key)}
            onChange={() => handleSelectItem(key)}
          />
          <label htmlFor={key}>{item.name}</label>
        </div>
      ))}
      <button className={styles.applyButton} onClick={handleSaveChanges}>저장</button>
    </div>
  );
};

export default EditItemsModal;
