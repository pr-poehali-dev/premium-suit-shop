import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Классический костюм-тройка',
    price: 129000,
    image: 'https://cdn.poehali.dev/projects/461f3626-f981-44a0-93e3-adeee195c0f9/files/55292b82-daaa-4136-a7f5-84411a0d274f.jpg',
    category: 'Классика',
    description: 'Премиальный шерстяной костюм цвета navy blue с золотыми акцентами'
  },
  {
    id: 2,
    name: 'Деловой костюм в полоску',
    price: 149000,
    image: 'https://cdn.poehali.dev/projects/461f3626-f981-44a0-93e3-adeee195c0f9/files/07a27ad8-87c1-46d5-871d-8791e948d294.jpg',
    category: 'Деловой',
    description: 'Элегантный костюм-тройка из шерсти с пинстрайпом'
  },
  {
    id: 3,
    name: 'Индивидуальный пошив',
    price: 199000,
    image: 'https://cdn.poehali.dev/projects/461f3626-f981-44a0-93e3-adeee195c0f9/files/24bc445a-1466-4534-af62-6ecf67f23bf3.jpg',
    category: 'Bespoke',
    description: 'Костюм премиум-класса, созданный по вашим меркам'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('Все');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-navy/90 border-b border-gold/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-cormorant font-bold text-cream">
              ELEGANTE
            </h1>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#catalog" className="text-cream/80 hover:text-gold transition-colors">Каталог</a>
              <a href="#bespoke" className="text-cream/80 hover:text-gold transition-colors">Индивидуальный пошив</a>
              <a href="#about" className="text-cream/80 hover:text-gold transition-colors">О бренде</a>
              <a href="#contacts" className="text-cream/80 hover:text-gold transition-colors">Контакты</a>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative border-gold/30 hover:bg-gold/10">
                  <Icon name="ShoppingBag" className="h-5 w-5 text-cream" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-gold text-navy h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg bg-cream">
                <SheetHeader>
                  <SheetTitle className="font-cormorant text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg border border-gold/20">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                          <div className="flex-1">
                            <h3 className="font-cormorant font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.price.toLocaleString('ru-RU')} ₽</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-gold/30"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" className="h-3 w-3" />
                              </Button>
                              <span className="text-sm w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-gold/30"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Trash2" className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-gold/20 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-cormorant text-xl">Итого:</span>
                          <span className="font-cormorant text-2xl font-bold text-gold">
                            {totalPrice.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <Button className="w-full bg-navy hover:bg-navy/90 text-cream">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-navy/80" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gold/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in">
          <h2 className="font-cormorant text-6xl md:text-8xl font-bold text-cream mb-6">
            Премиальные костюмы
          </h2>
          <p className="text-xl md:text-2xl text-cream/80 mb-8 max-w-2xl mx-auto">
            Элегантность в каждой детали. Совершенство в каждом стежке.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-semibold">
              <a href="#catalog">Посмотреть каталог</a>
            </Button>
            <Button size="lg" variant="outline" className="border-gold text-cream hover:bg-gold/10">
              <a href="#bespoke">Индивидуальный пошив</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-cormorant text-5xl font-bold text-center mb-12 text-navy">
            Наша коллекция
          </h2>
          
          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                className={activeCategory === category 
                  ? 'bg-navy text-cream hover:bg-navy/90' 
                  : 'border-gold/30 hover:bg-gold/10'
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden border-gold/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in bg-white"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Button 
                      className="bg-gold hover:bg-gold/90 text-navy font-semibold"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Icon name="Maximize2" className="mr-2 h-4 w-4" />
                      3D Примерка
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2 bg-gold/20 text-navy hover:bg-gold/30">
                    {product.category}
                  </Badge>
                  <h3 className="font-cormorant text-2xl font-bold mb-2 text-navy">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-cormorant text-2xl font-bold text-gold">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <Button 
                      className="bg-navy hover:bg-navy/90 text-cream"
                      onClick={() => addToCart(product)}
                    >
                      <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="bespoke" className="py-20 bg-navy text-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-cormorant text-5xl font-bold mb-6">
                Индивидуальный пошив
              </h2>
              <p className="text-lg text-cream/80 mb-6">
                Каждый костюм создается вручную нашими мастерами с учетом ваших индивидуальных особенностей и пожеланий.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Снятие мерок мастером',
                  'Выбор премиальных тканей',
                  'Индивидуальный дизайн',
                  '3 примерки в процессе',
                  'Гарантия идеальной посадки'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-semibold">
                Записаться на консультацию
              </Button>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden animate-scale-in">
              <img 
                src="https://cdn.poehali.dev/projects/461f3626-f981-44a0-93e3-adeee195c0f9/files/24bc445a-1466-4534-af62-6ecf67f23bf3.jpg"
                alt="Индивидуальный пошив"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-gold/30 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-cormorant text-3xl font-bold text-navy">
                3D Виртуальная примерка
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(null)}>
                <Icon name="X" className="h-6 w-6" />
              </Button>
            </div>
            
            <Tabs defaultValue="front" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="front">Спереди</TabsTrigger>
                <TabsTrigger value="side">Сбоку</TabsTrigger>
                <TabsTrigger value="back">Сзади</TabsTrigger>
              </TabsList>
              
              <TabsContent value="front" className="space-y-4">
                <div className="relative h-96 bg-gradient-to-br from-cream to-muted rounded-lg flex items-center justify-center">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full object-contain" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Вид спереди - {selectedProduct.name}
                </p>
              </TabsContent>
              
              <TabsContent value="side" className="space-y-4">
                <div className="relative h-96 bg-gradient-to-br from-cream to-muted rounded-lg flex items-center justify-center">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full object-contain transform -rotate-12" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Вид сбоку - {selectedProduct.name}
                </p>
              </TabsContent>
              
              <TabsContent value="back" className="space-y-4">
                <div className="relative h-96 bg-gradient-to-br from-cream to-muted rounded-lg flex items-center justify-center">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full object-contain transform scale-x-[-1]" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Вид сзади - {selectedProduct.name}
                </p>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-4">
              <Button 
                className="flex-1 bg-navy hover:bg-navy/90 text-cream"
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                Добавить в корзину
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-gold/30"
                onClick={() => setSelectedProduct(null)}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-navy text-cream py-12 border-t border-gold/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-cormorant text-2xl font-bold mb-4">ELEGANTE</h3>
              <p className="text-cream/70">Премиальные мужские костюмы с 2010 года</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-cream/70">
                <li>+7 (495) 123-45-67</li>
                <li>info@elegante.ru</li>
                <li>Москва, Тверская ул., 1</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Следите за нами</h4>
              <div className="flex gap-4">
                <Icon name="Instagram" className="h-6 w-6 text-cream/70 hover:text-gold cursor-pointer transition-colors" />
                <Icon name="Facebook" className="h-6 w-6 text-cream/70 hover:text-gold cursor-pointer transition-colors" />
                <Icon name="Twitter" className="h-6 w-6 text-cream/70 hover:text-gold cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          <div className="border-t border-gold/20 mt-8 pt-8 text-center text-cream/70">
            <p>&copy; 2024 ELEGANTE. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
