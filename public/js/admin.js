const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name="productId"]').value;
  const csrfToken = btn.parentNode.querySelector('[name="_csrf"]').value;

  const productElement = btn.closest("article");

  fetch(`/admin/delete-product/${productId}`, {
    method: "DELETE",
    headers: { "csrf-token": csrfToken },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log("🚀 ~ .then ~ data:", data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch((error) => {
      console.log("🚀 ~ deleteProduct ~ error:", error);
      return;
    });
};
