import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, TrendingUp, Scale, Palmtree, Calendar, ArrowRight, User, Clock } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

// Types pour les articles de blog
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

// Types pour les catégories
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

  // Catégories du blog
  const categories: Category[] = [
    {
      id: 'immobilier',
      name: 'Immobilier & Opportunités',
      description: 'Visites express, avant/après rénovation, comparatifs de prix',
      icon: Building2,
      color: 'bg-blue-500',
      count: 12
    },
    {
      id: 'conseils',
      name: 'Conseils Financiers & Juridiques',
      description: 'Processus d\'achat, fiscalité, Golden Visa, erreurs à éviter',
      icon: Scale,
      color: 'bg-green-500',
      count: 8
    },
    {
      id: 'lifestyle',
      name: 'Style de Vie & Attractivité',
      description: 'Lifestyle, climat, culture, témoignages d\'expatriés',
      icon: Palmtree,
      color: 'bg-orange-500',
      count: 15
    },
    {
      id: 'tendances',
      name: 'Tendances & Données Marché',
      description: 'Prix au m², évolution du marché, projets en développement',
      icon: TrendingUp,
      color: 'bg-purple-500',
      count: 6
    }
  ];

  // Articles de blog (mock data)
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Ce que vous achetez à 500k€ : Paris vs. Limassol',
      excerpt: 'Comparatif détaillé entre l\'immobilier parisien et chypriote pour un budget de 500 000€. Découvrez les différences de surface, localisation et potentiel d\'investissement.',
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
      excerpt: 'Tout ce que vous devez savoir sur l\'obtention de la résidence permanente à Chypre via l\'investissement immobilier. Conditions, délais et avantages.',
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
      excerpt: 'Climat, culture, gastronomie, éducation... Découvrez tous les aspects de la vie quotidienne à Chypre pour les expatriés français.',
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
      excerpt: 'Évolution des prix au m² dans les principales villes chypriotes. Tendances, prévisions et opportunités d\'investissement.',
      image: '/lovable-uploads/marina-bay-exterior-1.jpg',
      category: 'tendances',
      author: 'Alexandre Rousseau',
      date: '2024-03-08',
      readTime: '6 min',
      slug: 'prix-immobilier-chypre-2024'
    },
    {
      id: '5',
      title: 'Avant/Après : Rénovation villa à Paphos (+200k€ de valorisation)',
      excerpt: 'Découvrez comment cette villa traditionnelle à Paphos a été transformée en joyau moderne, avec un retour sur investissement exceptionnel.',
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
      excerpt: 'Imposition faible, avantages fiscaux pour les nouveaux résidents, optimisation fiscale légale... Tout savoir sur la fiscalité à Chypre.',
      image: '/lovable-uploads/marina-bay-kitchen-luxury.jpg',
      category: 'conseils',
      author: 'Jean-Pierre Martin',
      date: '2024-03-03',
      readTime: '10 min',
      slug: 'fiscalite-chypre-avantages'
    }
  ];

  // Filtrer les articles
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
        title="Blog Immobilier Chypre | Conseils & Actualités - Enki Realty"
        description="Découvrez nos articles d'experts sur l'immobilier à Chypre : Golden Visa, investissement, lifestyle, tendances marché. Conseils gratuits pour votre projet."
        image="/og-image.jpg"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section - Style Enki Realty */}
        <section className="relative bg-gradient-hero py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Floating particles effect like homepage */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative max-w-7xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <span className="swaarg-body font-medium">Centre de Connaissances</span>
            </div>
            
            <h1 className="swaarg-hero-title mb-8">
              Actualités & Conseils
              <br />
              <span className="text-cyprus-terra">Immobilier Chypre</span>
            </h1>
            
            <p className="swaarg-body-large text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Découvrez les derniers articles, guides et analyses d'experts sur l'investissement immobilier, 
              le Golden Visa, le lifestyle chypriote et les tendances du marché.
            </p>

            {/* Barre de recherche - Style Enki */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 pr-6 py-4 bg-card backdrop-blur-sm border-border/20 text-foreground placeholder:text-muted-foreground rounded-2xl shadow-lg focus:shadow-premium transition-all duration-300"
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Catégories - Style Enki Realty */}
          <section className="mb-20">
            <h2 className="swaarg-large-title text-center mb-16 text-foreground">Explorez par Catégorie</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer card-hover bg-card border-border/20 rounded-2xl shadow-lg group ${
                      selectedCategory === category.id ? 'ring-2 ring-primary shadow-premium' : ''
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                  >
                    <CardHeader className="text-center pb-6 p-8">
                      <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="swaarg-card-title font-medium mb-3 text-foreground">{category.name}</h3>
                      <p className="swaarg-body text-muted-foreground leading-relaxed">{category.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0 text-center pb-8">
                      <Badge 
                        variant="secondary" 
                        className="bg-muted/50 text-muted-foreground px-4 py-2 rounded-full"
                      >
                        {category.count} articles
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="btn-premium px-8 py-3 rounded-2xl"
              >
                Voir tous les articles
              </Button>
            </div>
          </section>

          {/* Articles à la une - Style Enki Realty */}
          {featuredPosts.length > 0 && selectedCategory === 'all' && (
            <section className="mb-20">
              <h2 className="swaarg-large-title mb-12 text-foreground">Articles à la Une</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                {featuredPosts.map((post) => {
                  const categoryInfo = getCategoryInfo(post.category);
                  return (
                    <Card key={post.id} className="overflow-hidden group cursor-pointer card-hover bg-card border-border/20 rounded-3xl shadow-lg">
                      <div className="relative h-80 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover image-hover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-6 left-6">
                          <Badge className={`${categoryInfo?.color} text-white px-4 py-2 rounded-full backdrop-blur-sm`}>
                            À la une
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-8">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
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
                        
                        <h3 className="swaarg-card-title mb-4 group-hover:text-primary transition-colors text-foreground">
                          {post.title}
                        </h3>
                        
                        <p className="swaarg-body text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className="capitalize bg-muted/30 border-border/30 text-muted-foreground px-3 py-1 rounded-full"
                          >
                            {categoryInfo?.name.split(' ')[0]}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="btn-outline-premium rounded-2xl group-hover:shadow-md"
                          >
                            Lire l'article
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tous les articles - Style Enki Realty */}
          <section>
            <div className="flex items-center justify-between mb-12">
              <h2 className="swaarg-large-title text-foreground">
                {selectedCategory === 'all' ? 'Tous les Articles' : 
                 `Articles - ${getCategoryInfo(selectedCategory)?.name}`}
              </h2>
              <div className="swaarg-body text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
                {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {regularPosts.map((post) => {
                const categoryInfo = getCategoryInfo(post.category);
                const Icon = categoryInfo?.icon;
                
                return (
                  <Card key={post.id} className="overflow-hidden group cursor-pointer card-hover bg-card border-border/20 rounded-2xl shadow-lg">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover image-hover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className={`${categoryInfo?.color} text-white flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm`}>
                          {Icon && <Icon className="w-3 h-3" />}
                          {categoryInfo?.name.split(' ')[0]}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="font-medium">{post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      
                      <h3 className="swaarg-body-large font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                        {post.title}
                      </h3>
                      
                      <p className="swaarg-body text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full btn-outline-premium rounded-2xl button-hover"
                      >
                        Lire l'article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="swaarg-card-title mb-4 text-foreground">Aucun article trouvé</h3>
                <p className="swaarg-body text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
                </p>
                <Button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                  className="btn-premium px-8 py-3 rounded-2xl"
                >
                  Voir tous les articles
                </Button>
              </div>
            )}
          </section>

          {/* Newsletter Section - Style Enki Realty */}
          <section className="mt-24">
            <Card className="bg-gradient-premium text-white border-0 rounded-3xl shadow-2xl overflow-hidden">
              <CardContent className="p-12 text-center relative">
                {/* Background particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative z-10">
                  <h3 className="swaarg-large-title mb-6">Restez Informé</h3>
                  <p className="swaarg-body-large text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Recevez nos derniers articles et analyses du marché immobilier chypriote directement dans votre boîte mail.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                    <Input 
                      type="email" 
                      placeholder="Votre adresse email"
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 rounded-2xl py-3 px-6"
                    />
                    <Button 
                      variant="secondary" 
                      className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 py-3 font-semibold button-hover"
                    >
                      S'abonner
                    </Button>
                  </div>
                  
                  <p className="text-sm text-white/70 mt-6">
                    Pas de spam, désabonnement en un clic.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default Blog;