import React from 'react';

interface CartItemProps {
    item: { count: number; name: string; price: number };
    onChangeCount: (count: number) => void;
    onDelete: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onChangeCount, onDelete }) => {
  return (
    <div>
      <span>{item.name}</span>
      <span>{item.price}</span>
      <select value={item.count} onChange={(e) => onChangeCount(Number(e.target.value))}>
        {[...Array(10).keys()].map(i => (
          <option key={i} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <button onClick={onDelete}>삭제</button>
    </div>
  );
}

export default CartItem;
