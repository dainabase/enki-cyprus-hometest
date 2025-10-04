import { useProjectTypologies } from '@/hooks/useProjectTypologies';
import { Loader2, Home, Check, Clock, X } from 'lucide-react';

interface Section5Props {
  projectId: string;
}

export function Section5TypologiesReal({ projectId }: Section5Props) {
  const { data: typologies, isLoading, error } = useProjectTypologies(projectId);

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  if (error || !typologies?.length) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Plans & Typologies Disponibles</h2>
          <p className="text-xl text-gray-600">
            {typologies.length} types d'appartements disponibles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {typologies.map((type) => {
            const hasStock = type.available_units > 0;

            return (
              <div
                key={`${type.property_type}-${type.bedrooms_count}`}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  !hasStock ? 'opacity-60' : ''
                }`}
              >
                {type.has_bestseller && hasStock && (
                  <div className="bg-amber-500 text-white px-4 py-2 text-center font-bold text-sm">
                    ⭐ BESTSELLER
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="w-6 h-6 text-blue-600" />
                    <h3 className="text-2xl font-bold capitalize">
                      {type.property_type}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-600 mb-4">
                    {type.bedrooms_count} {type.bedrooms_count === 1 ? 'Chambre' : 'Chambres'}
                  </p>

                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {type.available_units} disponible{type.available_units > 1 ? 's' : ''}
                      </span>
                    </div>

                    {type.reserved_units > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-500">
                          {type.reserved_units} réservée{type.reserved_units > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {type.sold_units > 0 && (
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">
                          {type.sold_units} vendue{type.sold_units > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">À partir de</p>
                    <p className="text-3xl font-bold text-blue-600">
                      €{(type.price_from / 1000).toFixed(0)}K
                    </p>
                    {type.price_to > type.price_from && (
                      <p className="text-sm text-gray-500">
                        Jusqu'à €{(type.price_to / 1000).toFixed(0)}K
                      </p>
                    )}
                  </div>

                  <div className="mb-6 pb-6 border-b">
                    <p className="text-sm text-gray-500 mb-1">Surface totale</p>
                    <p className="text-xl font-semibold">
                      {Math.round(type.area_from)}-{Math.round(type.area_to)}m²
                    </p>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      hasStock
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!hasStock}
                  >
                    {hasStock ? 'Voir les plans' : 'Plus de stock'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
