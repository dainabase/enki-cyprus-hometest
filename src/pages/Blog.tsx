import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, TrendingUp, Scale, TreePalm as Palmtree, Calendar, ArrowRight, User, Clock } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer } from '@/lib/animations';

// Types
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  slug: string;
  featured?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number;
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const categories: Category[] = [
    {
      id: 'immobilier',
      name: 'Immobilier & Opportunités',
      description: 'Visites express, avant/après rénovation, comparatifs de prix',
      icon: Building2,
      color: 'bg-gray-900',
      count: 12
    },
    {
      id: 'conseils',
      name: 'Conseils Financiers',
      description: 'Processus d\'achat, fiscalité, Golden Visa, erreurs à éviter',
      icon: Scale,
      color: 'bg-gray-800',
      count: 8
    },
    {
      id: 'lifestyle',
      name: 'Style de Vie',
      description: 'Lifestyle, climat, culture, témoignages d\'expatriés',
      icon: Palmtree,
      color: 'bg-gray-700',
      count: 15
    },
    {
      id: 'tendances',
      name: 'Tendances Marché',
      description: 'Prix au m², évolution du marché, projets en développement',
      icon: TrendingUp,
      color: 'bg-gray-600',
      count: 6
    }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Ce que vous achetez à 500k€ : Paris vs. Limassol',
      excerpt: 'Comparatif détaillé entre l\'immobilier parisien et chypriote pour un budget de 500 000€.',
      image: '/lovable-uploads/marina-bay-hero.jpg',
      category: 'immobilier',
      author: 'Marie Dubois',
      date: '2024-03-15',
      readTime: '5 min',
      slug: 'paris-vs-limassol-500k',
      featured: true
    },
    {
      id: '2',
      title: 'Golden Visa Chypre : Guide complet 2024',
      excerpt: 'Tout ce que vous devez savoir sur l\'obtention de la résidence permanente à Chypre.',
      image: '/lovable-uploads/marina-bay-interior-1.jpg',
      category: 'conseils',
      author: 'Jean-Pierre Martin',
      date: '2024-03-12',
      readTime: '8 min',
      slug: 'golden-visa-chypre-guide',
      featured: true
    },
    {
      id: '3',
      title: 'Vivre à Chypre : Le guide de l\'expatrié français',
      excerpt: 'Climat, culture, gastronomie, éducation... Découvrez tous les aspects de la vie quotidienne à Chypre.',
      image: '/lovable-uploads/marina-bay-sea-view.jpg',
      category: 'lifestyle',
      author: 'Sophie Laurent',
      date: '2024-03-10',
      readTime: '12 min',
      slug: 'vivre-a-chypre-guide-expatrie'
    },
    {
      id: '4',
      title: 'Prix de l\'immobilier à Chypre : Analyse 2024',
      excerpt: 'Évolution des prix au m² dans les principales villes chypriotes.',
      image: '/lovable-uploads/marina-bay-exterior-1.jpg',
      category: 'tendances',
      author: 'Alexandre Rousseau',
      date: '2024-03-08',
      readTime: '6 min',
      slug: 'prix-immobilier-chypre-2024'
    },
    {
      id: '5',
      title: 'Avant/Après : Rénovation villa à Paphos',
      excerpt: 'Découvrez comment cette villa a été transformée avec +200k€ de valorisation.',
      image: '/lovable-uploads/marina-bay-interior-2.jpg',
      category: 'immobilier',
      author: 'Marie Dubois',
      date: '2024-03-05',
      readTime: '7 min',
      slug: 'renovation-villa-paphos'
    },
    {
      id: '6',
      title: 'Fiscalité chypriote : Les avantages pour les expatriés',
      excerpt: 'Imposition faible, avantages fiscaux, optimisation fiscale légale.',
      image: '/lovable-uploads/marina-bay-kitchen-luxury.jpg',
      category: 'conseils',
      author: 'Jean-Pierre Martin',
      date: '2024-03-03',
      readTime: '10 min',
      slug: 'fiscalite-chypre-avantages'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  return (
    <>
      <SEOHead
        title="Blog Immobilier Chypre - Enki Realty"
        description="Articles d'experts sur l'immobilier à Chypre : Golden Visa, investissement, lifestyle, tendances marché."
        image="/og-image.jpg"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section avec Parallax */}
        <motion.section
          ref={heroRef}
          style={{ opacity, scale }}
          className="relative h-screen bg-black flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <img
              src="/lovable-uploads/marina-bay-panoramic.jpg"
              alt="Blog Hero"
              className="w-full h-full object-cover opacity-40"
            />
          </div>

          <div className="relative z-10 text-center text-white w-full px-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 sm:mb-8 font-light text-white/70">
                Centre de Connaissances
              </p>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-[0.95] mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Blog Immobilier
                <br />
                <span className="text-white/70">Chypre</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Guides, analyses et conseils d'experts sur l'investissement immobilier à Chypre
              </motion.p>

              {/* Search Bar - Full width sur mobile */}
              <motion.div
                className="w-full max-w-2xl mx-auto relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-6 text-sm sm:text-base bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 rounded-full shadow-2xl focus:bg-white/20 transition-all duration-300"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-white/50 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.section>

        <div className="w-full px-6 md:px-8 lg:px-12 py-16 sm:py-20 md:py-24 max-w-7xl mx-auto">
          {/* Catégories avec Stagger Animation */}
          <section className="mb-20 sm:mb-24 md:mb-32">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-light text-center mb-12 sm:mb-16 md:mb-20 text-gray-900 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Explorer par Catégorie
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {categories.map((category, i) => {
                const Icon = category.icon;
                return (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                    Icon={Icon}
                    index={i}
                  />
                );
              })}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="px-8 py-3 rounded-full font-medium"
              >
                Voir tous les articles
              </Button>
            </motion.div>
          </section>

          {/* Articles Featured */}
          {featuredPosts.length > 0 && selectedCategory === 'all' && (
            <FeaturedSection posts={featuredPosts} getCategoryInfo={getCategoryInfo} formatDate={formatDate} />
          )}

          {/* Regular Articles avec Horizontal Scroll */}
          <RegularArticlesSection
            posts={regularPosts}
            getCategoryInfo={getCategoryInfo}
            formatDate={formatDate}
            selectedCategory={selectedCategory}
            filteredCount={filteredPosts.length}
          />

          {filteredPosts.length === 0 && (
            <EmptyState onReset={() => { setSearchTerm(''); setSelectedCategory('all'); }} />
          )}

          {/* Newsletter avec Animation */}
          <NewsletterSection />
        </div>
      </div>
    </>
  );
};

// CategoryCard Component avec Tilt Effect
function CategoryCard({ category, isSelected, onClick, Icon, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
    >
      <Card
        className={`cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isSelected ? 'ring-2 ring-gray-900 shadow-xl' : ''
        }`}
        onClick={onClick}
      >
        <CardHeader className="text-center p-8">
          <motion.div
            className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-6`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-lg font-medium mb-3 text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
        </CardHeader>
        <CardContent className="pt-0 text-center pb-6">
          <Badge variant="outline" className="border-gray-200 text-gray-600 px-4 py-1">
            {category.count} articles
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Featured Section
function FeaturedSection({ posts, getCategoryInfo, formatDate }) {
  return (
    <section className="mb-20 sm:mb-24 md:mb-32">
      <motion.h2
        className="text-3xl sm:text-4xl font-light mb-12 sm:mb-16 text-gray-900 tracking-tight"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        À la Une
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
        {posts.map((post, i) => (
          <FeaturedCard
            key={post.id}
            post={post}
            getCategoryInfo={getCategoryInfo}
            formatDate={formatDate}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

// Featured Card avec Image Zoom
function FeaturedCard({ post, getCategoryInfo, formatDate, index }) {
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="overflow-hidden group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="relative h-80 overflow-hidden">
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute top-6 left-6">
            <Badge className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium">
              Featured
            </Badge>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>

          <h3 className="text-2xl font-medium mb-4 text-gray-900 group-hover:text-gray-700 transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-gray-200 text-gray-600 px-3 py-1">
              {categoryInfo?.name.split(' ')[0]}
            </Badge>
            <Button variant="ghost" size="sm" className="group/btn">
              Lire
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Regular Articles Section
function RegularArticlesSection({ posts, getCategoryInfo, formatDate, selectedCategory, filteredCount }) {
  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 sm:mb-16">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {selectedCategory === 'all' ? 'Tous les Articles' :
           `Articles - ${getCategoryInfo(selectedCategory)?.name}`}
        </motion.h2>
        <Badge variant="outline" className="border-gray-200 text-gray-600 px-3 sm:px-4 py-1 sm:py-2 text-sm">
          {filteredCount} article{filteredCount > 1 ? 's' : ''}
        </Badge>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {posts.map((post, i) => (
          <ArticleCard
            key={post.id}
            post={post}
            getCategoryInfo={getCategoryInfo}
            formatDate={formatDate}
            index={i}
          />
        ))}
      </motion.div>
    </section>
  );
}

// Article Card
function ArticleCard({ post, getCategoryInfo, formatDate, index }) {
  const categoryInfo = getCategoryInfo(post.category);
  const Icon = categoryInfo?.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
      }}
    >
      <Card className="overflow-hidden group cursor-pointer bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <Badge className={`${categoryInfo?.color} text-white flex items-center gap-2 px-3 py-1 rounded-full`}>
              {Icon && <Icon className="w-3 h-3" />}
              {categoryInfo?.name.split(' ')[0]}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span className="font-medium">{post.author}</span>
            <span>•</span>
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h3 className="text-lg font-medium mb-3 text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          <Button variant="ghost" size="sm" className="w-full group/btn">
            Lire l'article
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Empty State
function EmptyState({ onReset }) {
  return (
    <motion.div
      className="text-center py-24"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-medium mb-4 text-gray-900">Aucun article trouvé</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
      </p>
      <Button onClick={onReset} className="px-8 py-3 rounded-full">
        Voir tous les articles
      </Button>
    </motion.div>
  );
}

// Newsletter Section
function NewsletterSection() {
  return (
    <motion.section
      className="mt-20 sm:mt-24 md:mt-32"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Card className="bg-black text-white border-0 rounded-2xl sm:rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>

        <CardContent className="p-8 sm:p-12 md:p-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 tracking-tight">Restez Informé</h3>
            <p className="text-base sm:text-lg text-white/70 mb-8 sm:mb-12 max-w-2xl mx-auto font-light px-4">
              Recevez nos derniers articles et analyses directement dans votre boîte mail.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 rounded-full py-4 sm:py-6 px-4 sm:px-6 text-sm sm:text-base"
              />
              <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 py-4 sm:py-6 font-medium text-sm sm:text-base whitespace-nowrap">
                S'abonner
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-white/50 mt-4 sm:mt-6">
              Pas de spam, désabonnement en un clic.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

export default Blog;
