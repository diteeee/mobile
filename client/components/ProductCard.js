import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProductCard = ({
  product,
  onAddToCart,
  showAddToCart = true,
  isInWishlist,
  onToggleWishlist,
  hideWishlistButton = false, // New prop
}) => {
  const price = typeof product.price === 'number' ? product.price : 0;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>{product.name || 'Unnamed Product'}</Text>
      <Text style={styles.description}>
        {product.description || 'No description available.'}
      </Text>
      <Text style={styles.price}>${price.toFixed(2)}</Text>
      <Text style={styles.stock}>
        Stock: {product.stock !== undefined ? product.stock : 'Unknown'}
      </Text>

      {showAddToCart && (
        <TouchableOpacity
          style={[
            styles.addButton,
            product.stock === 0 && { backgroundColor: '#ccc' },
          ]}
          onPress={onAddToCart}
          disabled={product.stock === 0}
        >
          <Text style={styles.addButtonText}>
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Wishlist button */}
      {!hideWishlistButton && (
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={onToggleWishlist}
          accessibilityLabel={
            isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
          }
        >
          <MaterialIcons
            name={isInWishlist ? 'favorite' : 'favorite-border'}
            size={28}
            color={isInWishlist ? '#e91e63' : '#888'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    position: 'relative', // needed for wishlist button
  },
  image: {
    width: '90%',
    maxWidth: 300,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  stock: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#880e4f',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default ProductCard;
