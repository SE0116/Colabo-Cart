import React, { useState } from 'react';

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
      <h2>할인 목록</h2>

      {Object.entries(discounts).map(([key, discount]) => (
        <div key={key}>
          <input
            type="checkbox"
            id={key}
            checked={selectedDiscounts.includes(key)}
            onChange={() => handleSelectDiscount(key)}
          />
          <label htmlFor={key}>{discount.name} - {discount.rate * 100}%</label>
        </div>
      ))}
      
      <button onClick={handleAddDiscounts}>확인</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}

export default DiscountsModal;
