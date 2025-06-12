import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ProductCard from '../components/ProductCard';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Footer from '../components/Footer';
import { showNotification } from '../utils/PushNotificationConfig';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [open, setOpen] = useState(false);
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        setToken(storedToken);
        setUserId(storedUserId);

        await fetchCategories();
      } catch (error) {
        console.error('Error fetching token:', error);
        setErrorMessage('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://192.168.1.11:5000/categories`);

      const fetchedCategories = response.data.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));

      setCategories([{ label: 'All', value: 'all' }, ...fetchedCategories]);

      if (response.data.length > 0) {
        setSelectedCategoryId('all');
        await fetchProducts('all');
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Failed to load categories. Please try again later.');
    }
  };

  const fetchProducts = async (categoryId) => {
    try {
      const response = await axios.get(`http://192.168.1.11:5000/products`, {
        params: categoryId !== 'all' ? { categoryId } : {},
      });

      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (userId && token) {
        try {
          const response = await axios.get(`http://192.168.1.11:5000/wishlists/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWishlist(response.data.products.map((product) => product._id));
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };

    if (isFocused) {
      fetchWishlist();
    }
  }, [isFocused, userId, token]);

  const toggleWishlist = async (productId) => {
    if (!userId) {
      Toast.show({
        type: 'info',
        text1: 'Please sign in',
        text2: 'You must be logged in to manage your wishlist',
        visibilityTime: 3000,
      });
      showNotification('Sign In Required', 'You must be logged in to manage your wishlist.');
      return;
    }

    const isInWishlist = wishlist.includes(productId);

    try {
      if (isInWishlist) {
        await axios.delete(
          `http://192.168.1.11:5000/wishlists/${userId}/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist(wishlist.filter((id) => id !== productId));
        Toast.show({
          type: 'info',
          text1: 'Removed from Wishlist',
        });
        showNotification('Wishlist Updated', 'Item removed from your wishlist.');
      } else {
        await axios.post(
          `http://192.168.1.11:5000/wishlists/`,
          { user: userId, product: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist([...wishlist, productId]);
        Toast.show({
          type: 'success',
          text1: 'Added to Wishlist',
        });
        showNotification('Wishlist Updated', 'Item added to your wishlist.');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: 'Wishlist Error',
        text2: 'Could not update wishlist.',
      });
      showNotification('Wishlist Error', 'Could not update wishlist.');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!userId) {
      Toast.show({
        type: 'info',
        text1: 'Please sign in',
        text2: 'You must be logged in to add products to your cart',
        visibilityTime: 3000,
      });
      showNotification('Sign In Required', 'You must be logged in to add products to your cart.');
      return;
    }

    try {
      await axios.post(
        `http://192.168.1.11:5000/carts/add`,
        { user: userId, product: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Toast.show({
        type: 'success',
        text1: 'Item Added to Cart',
        text2: 'The item has been successfully added to your cart.',
        visibilityTime: 3000,
      });
      showNotification('Item Added', 'You added a product to your cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add product to cart.',
        visibilityTime: 3000,
      });
      showNotification('Cart Error', 'Failed to add product to cart.');
    }
  };

  const handleLeaveReview = (productId) => {
    if (!userId) {
      Toast.show({
        type: 'info',
        text1: 'Please sign in',
        text2: 'You must be logged in to leave a review',
        visibilityTime: 3000,
      });
      showNotification('Sign In Required', 'You must be logged in to leave a review.');
      return;
    }

    router.push({
      pathname: '/review',
      params: { productId }, // or just productId variable
    });
  };

  const renderProductCard = ({ item }) => {
    return (
      <ProductCard
        product={item}
        onAddToCart={() => handleAddToCart(item._id)}
        isInWishlist={wishlist.includes(item._id)}
        onToggleWishlist={() => toggleWishlist(item._id)}
        onLeaveReview={() => handleLeaveReview(item._id)}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#880e4f" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity onPress={() => fetchCategories(token)} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Makeup Store</Text>

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={selectedCategoryId}
          items={categories}
          setOpen={setOpen}
          setValue={setSelectedCategoryId}
          onChangeValue={(value) => {
            fetchProducts(value);
          }}
          placeholder="Select a Category"
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.placeholderText}
          accessible
          accessibilityLabel="Category dropdown"
        />
      </View>

      <View style={{ flex: 1 }}>
        {products.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.messageText}>No products found in this category.</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Footer />

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push('/cart')}
      >
        <MaterialIcons name="shopping-cart" size={24} color="#fff" />
      </TouchableOpacity>

      <Toast position="bottom" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
    paddingTop: 16,
  },
  cartButton: {
    position: 'absolute',
    bottom: 66,
    right: 16,
    backgroundColor: '#880e4f',
    borderRadius: 50,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#880e4f',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Playfair Display, serif',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: '#880e4f',
  },
  dropdownText: {
    fontSize: 16,
  },
  placeholderText: {
    color: '#880e4f',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    color: '#880e4f',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#880e4f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});

export default HomeScreen;
