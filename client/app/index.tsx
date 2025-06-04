import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';
import DropDownPicker from 'react-native-dropdown-picker';

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [open, setOpen] = useState(false); // For dropdown picker
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchTokenAndCategories = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId'); // assuming you store userId
        setToken(storedToken);
        setUserId(storedUserId);

        if (storedToken) {
          await fetchCategories(storedToken);
        } else {
          setLoadingCategories(false);
          setLoadingProducts(false);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        setLoadingCategories(false);
        setLoadingProducts(false);
      }
    };

    if (isFocused) {
      fetchTokenAndCategories();
    }
  }, [isFocused]);

  const fetchCategories = async (authToken) => {
    try {
      setLoadingCategories(true);
      const response = await axios.get('http://192.168.1.4:5000/categories', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const fetchedCategories = response.data.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));

      // Add the "All" option
      const allOption = { label: 'All', value: 'all' };

      setCategories([allOption, ...fetchedCategories]);

      if (response.data.length > 0) {
        setSelectedCategoryId('all'); // Default to "All" option
        fetchProducts(authToken, 'all');
      } else {
        setLoadingProducts(false);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoadingCategories(false);
      setLoadingProducts(false);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async (authToken, categoryId) => {
    try {
      setLoadingProducts(true);
      const response = await axios.get('http://192.168.1.4:5000/products', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      let filteredProducts = response.data;

      if (categoryId !== 'all') {
        filteredProducts = response.data.filter(
          (product) => product.category && product.category._id === categoryId
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle adding a product to the cart
  const handleAddToCart = async (productId) => {
    if (!userId) {
      Alert.alert('Please sign in to add products to your cart');
      return;
    }

    try {
      await axios.post(
        'http://192.168.1.4:5000/carts/add',
        {
          user: userId,
          product: productId,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart.');
    }
  };

  const renderProductCard = ({ item }) => (
    <ProductCard product={item} onAddToCart={() => handleAddToCart(item._id)} />
  );

  if (loadingCategories || loadingProducts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#880e4f" />
        <Text style={styles.loadingText}>Loading your favorite products...</Text>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>
          Please sign in to view our fabulous makeup products.
        </Text>
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
            if (token) fetchProducts(token, value);
          }}
          placeholder="Select a Category"
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.placeholderText}
        />
      </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
    paddingTop: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#880e4f',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Playfair Display, serif',
  },
  dropdownContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    zIndex: 1000, // Ensures dropdown appears above other elements
  },
  dropdown: {
    borderColor: '#880e4f',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#880e4f',
  },
  placeholderText: {
    color: '#bdbdbd',
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#880e4f',
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fce4ec',
  },
  messageText: {
    fontSize: 18,
    color: '#880e4f',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;
