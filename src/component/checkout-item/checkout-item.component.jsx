import React from 'react';
import './checkout-item.styles.scss';
import { ReactComponent as DeleteIcon } from '../../assets/svg/delete.svg';
import { connect } from 'react-redux';
import { clearItemFromCart, addItem, removeItem } from '../../redux/cart/cart.actions';
import { ReactComponent as Minus } from '../../assets/svg/minus.svg';
import { ReactComponent as Plus } from '../../assets/svg/plus.svg';

const CheckoutItem = ({ cartItem, clearItem, addItem, removeItem }) => {
  const { name, imageUrl, price, quantity } = cartItem;
  return (
    <div className="checkout-item">
      <div className="image-container">
        <img src={imageUrl} alt={name} />
      </div>
      <span className="name">{name}</span>
      <span className="quantity">
        <Minus className="cursor-pointer w-6 mr-2" onClick={() => removeItem(cartItem)} />
        <span>{quantity}</span>
        <Plus className="cursor-pointer w-6 ml-2" onClick={() => addItem(cartItem)} />
      </span>
      <span className="price">${price}</span>
      <div onClick={() => clearItem(cartItem)} className="remove-button">
        <DeleteIcon />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  clearItem: (item) => dispatch(clearItemFromCart(item)),
  addItem: (item) => dispatch(addItem(item)),
  removeItem: (item) => dispatch(removeItem(item)),
});

export default connect(null, mapDispatchToProps)(CheckoutItem);
