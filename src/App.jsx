import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, X, Search } from 'lucide-react';

const NarutoShop = () => {
  // États
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données des produits
  const products = Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    title: `Naruto T-Shirt ${index + 1}`,
    price: 300,
    image: '/api/placeholder/200/200',
    quantity: 1
  }));

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Nombre de produits par page
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Logique de pagination
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Fonctions de gestion du panier
  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  // Calcul du total du panier
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Composant du tiroir du panier
  const CartDrawer = () => (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Cart ({cart.length})</h3>
          <button onClick={() => setIsCartOpen(false)} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Articles du panier */}
        <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Votre panier est vide</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover" />
                <div className="flex-grow">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm">${item.price}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Détails du prix */}
        <div className="mt-6 space-y-4 border-t pt-4">
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            className="w-full bg-black text-white py-2 rounded disabled:bg-gray-300"
            disabled={cart.length === 0}
          >
            Payer Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white/70 p-4 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-bold text-xl">Logo</span>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[80vh] container mx-auto  ">
        <img 
          src="/1686273830257.png" 
          alt="Naruto Banner"
          className="w-full h-full object-cover "
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-neutral-500">
            <h1 className="text-4xl font-bold mb-4">Welcome to Anime Website</h1>
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-200 hover:text-black transition-colors">
              Shopping Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Description */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Bienvenue sur Anime Website T-Shirts !
          </h2>
          <p className="text-gray-600">
          Découvrez notre collection unique de t-shirts inspirés de vos animes préférés ! Conçus pour les véritables passionnés, nos t-shirts offrent un style moderne, confortable et une qualité exceptionnelle. Que vous soyez fan de classiques intemporels ou de nouveaux anime populaires, trouvez votre coup de cœur dans notre sélection.
          Chaque design est soigneusement créé pour refléter l'essence de vos personnages et scènes favoris, avec des options variées pour tous les goûts et toutes les tailles. Rejoignez la communauté des amateurs d’anime et affichez fièrement votre passion avec nos t-shirts exclusifs !
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-xl font-bold">All Product</h3>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{product.title}</h4>
                      <span className="text-sm">${product.price}</span>
                    </div>
                    <button 
                      onClick={() => {
                        addToCart(product);
                        setIsCartOpen(true);
                      }}
                      className="w-full bg-black text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Shopping Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-center items-center gap-4">
            <button 
              className="p-2 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${currentPage === index + 1 
                      ? 'bg-black text-white' 
                      : 'border hover:bg-gray-50'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button 
              className="p-2 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">Logo</span>
            <div className="flex items-center gap-4">
              <button>
                <img src="/api/placeholder/24/24" alt="Social" className="w-6 h-6" />
              </button>
              <button>
                <img src="/api/placeholder/24/24" alt="Social" className="w-6 h-6" />
              </button>
              <p>Copyright © 2024</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />
      
      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
};

export default NarutoShop;