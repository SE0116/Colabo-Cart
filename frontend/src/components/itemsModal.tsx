import React, { useState } from 'react';

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
      <h2>{items ? '아이템 목록' : '할인 목록'}</h2>
      {items && Object.entries(items).map(([key, item]) => (
        <div key={key}>
          <input
            type="checkbox"
            id={key}
            checked={selectedItems.includes(key)}
            onChange={() => handleSelectItem(key)}
          />
          <label htmlFor={key}>{item.name} - {item.price}</label>
        </div>
      ))}
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
      <button onClick={handleAddItems}>확인</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}

export default ItemsModal;