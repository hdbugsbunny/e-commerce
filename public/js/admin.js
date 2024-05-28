const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name="productId"]').value;
  const csrfToken = btn.parentNode.querySelector('[name="_csrf"]').value;
};
