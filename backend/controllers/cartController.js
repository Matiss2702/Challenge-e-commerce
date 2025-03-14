const { Cart, CartItem, Product } = require("../models/postgres");

exports.getOrCreateCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { user_id: userId, status: "active" },
      include: [{ model: CartItem }],
    });

    if (!cart) {
      cart = await Cart.create({ user_id: userId, status: "active" });
    }

    return res.json(cart);
  } catch (err) {
    console.error("Erreur getOrCreateCart:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { user_id: userId, status: "active" },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "imagePath", "category"],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.json({ items: [] });
    }
    return res.json(cart);
  } catch (err) {
    console.error("Erreur getCart:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ error: "product_id et quantity sont requis" });
    }

    let cart = await Cart.findOne({
      where: { user_id: userId, status: "active" },
    });
    if (!cart) {
      cart = await Cart.create({ user_id: userId, status: "active" });
    }

    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.json(cartItem);
    } else {
      const newItem = await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity,
      });
      return res.json(newItem);
    }
  } catch (err) {
    console.error("Erreur addItemToCart:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ error: "quantity est requis" });
    }

    const cart = await Cart.findOne({
      where: { user_id: userId, status: "active" },
    });
    if (!cart) {
      return res.status(404).json({ error: "Panier introuvable" });
    }

    const cartItem = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
    });
    if (!cartItem) {
      return res.status(404).json({ error: "Cet article n'est pas dans le panier" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    return res.json(cartItem);
  } catch (err) {
    console.error("Erreur updateCartItem:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({
      where: { user_id: userId, status: "active" },
    });
    if (!cart) {
      return res.status(404).json({ error: "Panier introuvable" });
    }

    const cartItem = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
    });
    if (!cartItem) {
      return res.status(404).json({ error: "Cet article n'est pas dans le panier" });
    }

    await cartItem.destroy();
    return res.json({ message: "Article retiré du panier" });
  } catch (err) {
    console.error("Erreur removeCartItem:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ where: { user_id: userId, status: "active" } });

    if (!cart) {
      return res.status(404).json({ error: "Panier introuvable" });
    }

    await CartItem.destroy({ where: { cart_id: cart.id } });
    return res.json({ message: "Panier vidé" });
  } catch (err) {
    console.error("Erreur clearCart:", err);
    return res.status(500).json({ error: err.message });
  }
};
