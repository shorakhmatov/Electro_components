<!-- Модальное окно для просмотра товара -->
<div id="productModal" class="product-modal">
    <div class="product-modal-content">
        <span class="close-modal">&times;</span>
        <div class="product-modal-inner">
            <div class="product-modal-image">
                <div class="image-container">
                    <img id="modalProductImage" src="/assets/images/products/default.jpg" alt="Изображение товара">
                </div>
                <button id="modalAddToFavoritesBtn" class="btn-favorite-modal" title="Добавить в избранное">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-modal-details">
                <h2 id="modalProductName" class="product-modal-title"></h2>
                <div class="product-modal-price">
                    <span id="modalProductPrice"></span> ₽
                </div>
                <div class="product-modal-description">
                    <p id="modalProductDescription"></p>
                </div>
                <div class="product-modal-characteristics">
                    <h3>Характеристики</h3>
                    <ul id="modalProductCharacteristics" class="characteristics-list">
                        <!-- Характеристики будут добавлены динамически -->
                    </ul>
                </div>
                <div class="product-modal-actions">
                    <div class="product-modal-quantity">
                        <button class="btn-quantity" onclick="decrementModalQuantity()">-</button>
                        <input type="number" id="modalQuantityInput" class="quantity-input" value="1" min="1" max="99">
                        <button class="btn-quantity" onclick="incrementModalQuantity()">+</button>
                    </div>
                    <button id="modalAddToCartBtn" class="btn btn-primary add-to-cart">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
