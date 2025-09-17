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

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary-glow to-secondary py-20 px-4">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-6xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium">Centre de Connaissances</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Actualités & Conseils
              <br />
              <span className="text-accent">Immobilier Chypre</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Découvrez les derniers articles, guides et analyses d'experts sur l'investissement immobilier, 
              le Golden Visa, le lifestyle chypriote et les tendances du marché.
            </p>

            {/* Barre de recherche */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Catégories */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Explorez par Catégorie</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${
                      selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0 text-center">
                      <Badge variant="secondary">{category.count} articles</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-primary text-white' : ''}
              >
                Voir tous les articles
              </Button>
            </div>
          </section>

          {/* Articles à la une */}
          {featuredPosts.length > 0 && selectedCategory === 'all' && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Articles à la Une</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => {
                  const categoryInfo = getCategoryInfo(post.category);
                  return (
                    <Card key={post.id} className="overflow-hidden group cursor-pointer hover:shadow-elegant transition-all duration-300">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={`${categoryInfo?.color} text-white`}>
                            À la une
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {categoryInfo?.name}
                          </Badge>
                          <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
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

          {/* Tous les articles */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {selectedCategory === 'all' ? 'Tous les Articles' : 
                 `Articles - ${getCategoryInfo(selectedCategory)?.name}`}
              </h2>
              <div className="text-muted-foreground">
                {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => {
                const categoryInfo = getCategoryInfo(post.category);
                const Icon = categoryInfo?.icon;
                
                return (
                  <Card key={post.id} className="overflow-hidden group cursor-pointer hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${categoryInfo?.color} text-white flex items-center gap-1`}>
                          {Icon && <Icon className="w-3 h-3" />}
                          {categoryInfo?.name.split(' ')[0]}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
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
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
                </p>
                <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                  Voir tous les articles
                </Button>
              </div>
            )}
          </section>

          {/* Newsletter Section */}
          <section className="mt-20">
            <Card className="bg-gradient-to-r from-primary to-primary-glow text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Restez Informé</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Recevez nos derniers articles et analyses du marché immobilier chypriote directement dans votre boîte mail.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Votre adresse email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    S'abonner
                  </Button>
                </div>
                
                <p className="text-xs text-white/70 mt-4">
                  Pas de spam, désabonnement en un clic.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default Blog;