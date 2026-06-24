document.addEventListener('DOMContentLoaded', function () {
  const bundleList = [];
  const bundleListDiv = document.getElementById('bundle-list');
  const addToCartBtn = document.getElementById('add-bundle-to-cart');
  const discountText = document.getElementById('discount-text');
  const countSpan = document.getElementById('bundle-count');

  function updateBundleView() {
    bundleListDiv.innerHTML = '';
    bundleList.forEach((item, index) => {
      const div = document.createElement('div');
      div.innerText = `${index + 1}. ${item.title}`;
      bundleListDiv.appendChild(div);
    });

    countSpan.textContent = bundleList.length;
    addToCartBtn.disabled = bundleList.length === 0;

    switch (bundleList.length) {
      case 1: discountText.textContent = 'Get 1 box – No discount'; break;
      case 2: discountText.textContent = 'Save 10% on 2 boxes'; break;
      case 3: discountText.textContent = 'Save 15% on 3 boxes'; break;
      case 4: discountText.textContent = 'Save 20% on 4 boxes'; break;
    }
  }

  document.querySelectorAll('.add-to-bundle-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (bundleList.length >= 4) return alert('Only 4 items allowed in bundle.');

      const card = btn.closest('.bundle-product-card');
      const id = card.dataset.productId;
      const title = card.dataset.productTitle;
      const handle = card.dataset.productHandle;
      const price = parseInt(card.dataset.productPrice);

      bundleList.push({ id, title, handle, price });
      updateBundleView();
    });
  });

  addToCartBtn.addEventListener('click', async function () {
    const discountPercent = bundleList.length === 2 ? 10 : bundleList.length === 3 ? 15 : bundleList.length === 4 ? 20 : 0;

    const cartItems = bundleList.map(item => ({
      id: item.id,
      quantity: 1,
      properties: {
        'Bundle Discount': discountPercent + '%'
      }
    }));

    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems })
    });

    if (response.ok) {
      if (window.Shopify && Shopify.theme && Shopify.theme.jsDrawer) {
        Shopify.theme.jsDrawer.open();
      } else {
        window.location.reload();
      }
    } else {
      alert('Error adding bundle to cart.');
    }
  });
});