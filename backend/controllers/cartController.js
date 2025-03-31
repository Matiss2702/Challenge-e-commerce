const { Cart, CartItem, Product } = require("../models/postgres");
const UserMongo = require("../models/mongo/UserMongo");
const CartMongo = require("../models/mongo/CartMongo");
const CartItemMongo = require("../models/mongo/CartItemMongo");

function getAgeFromBirthdate(birthdate) {
  const now = new Date();
  const birth = new Date(birthdate);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

exports.getOrCreateCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { user_id: userId, status: "active" },
      include: [{ model: CartItem }],
    });

    if (!cart) {
      cart = await Cart.create({ user_id: userId, status: "active" });

      await CartMongo.create({
        postgresId: cart.id.toString(),
        user_id: userId.toString(),
        status: "active",
      });
    } else {
      const cartMongo = await CartMongo.findOne({ postgresId: cart.id.toString() });
      if (!cartMongo) {
        await CartMongo.create({
          postgresId: cart.id.toString(),
          user_id: userId.toString(),
          status: cart.status,
        });
      }
    }

    return res.json(cart);
  } catch (err) {
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
              attributes: ["id", "name", "price", "imagePath", "category", "isAgeRestricted"],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.json({ items: [] });
    }
    let cartMongo = await CartMongo.findOne({ postgresId: cart.id.toString() });
    if (!cartMongo) {
      await CartMongo.create({
        postgresId: cart.id.toString(),
        user_id: cart.user_id.toString(),
        status: cart.status,
      });
    }

    return res.json(cart);
  } catch (err) {
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

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }

    if (product.isAgeRestricted) {
      const user = await UserMongo.findOne({ postgresId: userId });
      if (!user || !user.birthdate) {
        return res.status(403).json({ error: "Date de naissance non disponible. Impossible de vérifier l'âge." });
      }

      const age = getAgeFromBirthdate(user.birthdate);
      if (age < 18) {
        return res.status(403).json({ error: "Vous devez avoir au moins 18 ans pour acheter ce produit." });
      }
    }

    const tvaRate = product.isAgeRestricted ? 20 : 5.5;
    const priceHT = product.price;
    const priceTTC = parseFloat((priceHT * (1 + tvaRate / 100)).toFixed(2));

    let cart = await Cart.findOne({ where: { user_id: userId, status: "active" } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId, status: "active" });
      await CartMongo.create({
        postgresId: cart.id.toString(),
        user_id: userId.toString(),
        status: "active",
      });
    }

    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();

      const cartItemMongo = await CartItemMongo.findOne({ postgresId: cartItem.id.toString() });
      if (cartItemMongo) {
        cartItemMongo.quantity = cartItem.quantity;
        await cartItemMongo.save();
      } else {
        await CartItemMongo.create({
          postgresId: cartItem.id.toString(),
          cart_id: cart.id.toString(),
          product_id: product_id.toString(),
          quantity: cartItem.quantity,
          price: cartItem.price,
        });
      }

      return res.json(cartItem);
    } else {
      const newItem = await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity,
        price: priceTTC,
      });

      await CartItemMongo.create({
        postgresId: newItem.id.toString(),
        cart_id: cart.id.toString(),
        product_id: product_id.toString(),
        quantity,
        price: priceTTC,
      });

      return res.json(newItem);
    }
  } catch (err) {
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

    const cart = await Cart.findOne({ where: { user_id: userId, status: "active" } });
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

    const cartItemMongo = await CartItemMongo.findOne({
      postgresId: cartItem.id.toString(),
    });
    if (cartItemMongo) {
      cartItemMongo.quantity = quantity;
      await cartItemMongo.save();
    }

    return res.json(cartItem);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ where: { user_id: userId, status: "active" } });
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

    await CartItemMongo.findOneAndDelete({ postgresId: itemId.toString() });

    return res.json({ message: "Article retiré du panier" });
  } catch (err) {
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

    await CartItemMongo.deleteMany({ cart_id: cart.id.toString() });

    return res.json({ message: "Panier vidé" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
