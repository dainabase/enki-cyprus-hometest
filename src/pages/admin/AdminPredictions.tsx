import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, AlertCircle, Activity } from 'lucide-react';

export default function AdminPredictions() {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState({
    salesNext: { value: 0, trend: 0, confidence: 'low' },
    leadsNext: { value: 0, trend: 0, confidence: 'medium' },
    commissionsNext: { value: 0, trend: 0, confidence: 'medium' },
    conversionNext: { value: 0, trend: 0, confidence: 'high' }
  });
  const [comparison, setComparison] = useState([]);
  const [historicalData, setHistoricalData] = useState({
    sales: [],
    leads: [],
    commissions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    setLoading(true);
    
    // Récupérer les 6 derniers mois de données
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Sales data
    const { data: projects } = await supabase
      .from('projects')
      .select('created_at, price_from')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at');
    
    // Leads data
    const { data: leads } = await supabase
      .from('leads')
      .select('created_at, status')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at');
    
    // Commissions data
    const { data: commissions } = await supabase
      .from('commissions')
      .select('date, amount')
      .gte('date', sixMonthsAgo.toISOString())
      .order('date');
    
    if (projects && leads && commissions) {
      // Grouper par mois
      const salesByMonth = groupDataByMonth(projects, 'price');
      const leadsByMonth = groupDataByMonth(leads);
      const commissionsByMonth = groupDataByMonth(commissions, 'amount', 'date');
      
      setHistoricalData({
        sales: salesByMonth,
        leads: leadsByMonth,
        commissions: commissionsByMonth
      });
      
      // Calculer les prédictions
      calculatePredictions(salesByMonth, leadsByMonth, commissionsByMonth, leads);
      
      // Préparer la comparaison du mois dernier
      prepareComparison(salesByMonth, leadsByMonth, commissionsByMonth);
    }
    
    setLoading(false);
  };

  const groupDataByMonth = (data, valueField = null, dateField = 'created_at') => {
    const months = {};
    
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthKey,
          value: 0,
          count: 0
        };
      }
      
      if (valueField) {
        months[monthKey].value += item[valueField] || 0;
      }
      months[monthKey].count += 1;
    });
    
    return Object.values(months).sort((a: any, b: any) => a.month.localeCompare(b.month));
  };

  const calculateLinearTrend = (data) => {
    if (data.length < 2) return { next: 0, trend: 0 };
    
    // Calcul de régression linéaire simple
    const n = data.length;
    const lastThree = data.slice(-3); // Utiliser les 3 derniers mois
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    lastThree.forEach((point, i) => {
      const x = i;
      const y = point.value || point.count;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Prédire le prochain point
    const nextValue = slope * n + intercept;
    const lastValue = data[data.length - 1].value || data[data.length - 1].count;
    const trend = lastValue > 0 ? ((nextValue - lastValue) / lastValue * 100) : 0;
    
    return { next: Math.max(0, nextValue), trend };
  };

  const calculateMovingAverage = (data, periods = 3) => {
    if (data.length < periods) return 0;
    
    const recentData = data.slice(-periods);
    const sum = recentData.reduce((acc, item) => acc + (item.value || item.count), 0);
    return sum / periods;
  };

  const calculatePredictions = (sales, leads, commissions, allLeads) => {
    // Prédiction des ventes (tendance linéaire)
    const salesPrediction = calculateLinearTrend(sales);
    
    // Prédiction des leads (moyenne mobile)
    const leadsAvg = calculateMovingAverage(leads);
    const leadsPrevAvg = calculateMovingAverage(leads.slice(0, -1));
    const leadsTrend = leadsPrevAvg > 0 ? ((leadsAvg - leadsPrevAvg) / leadsPrevAvg * 100) : 0;
    
    // Prédiction des commissions (basée sur le pipeline actuel)
    const commissionsPrediction = calculateLinearTrend(commissions);
    
    // Prédiction du taux de conversion (moyenne pondérée récente)
    const recentLeads = allLeads.slice(-90); // 3 derniers mois
    const converted = recentLeads.filter(l => l.status === 'converted').length;
    const conversionRate = recentLeads.length > 0 ? (converted / recentLeads.length * 100) : 0;
    
    // Déterminer la confiance basée sur la quantité de données
    const getConfidence = (dataLength) => {
      if (dataLength >= 6) return 'high';
      if (dataLength >= 3) return 'medium';
      return 'low';
    };
    
    setPredictions({
      salesNext: {
        value: Math.round(salesPrediction.next),
        trend: salesPrediction.trend,
        confidence: getConfidence(sales.length)
      },
      leadsNext: {
        value: Math.round(leadsAvg),
        trend: leadsTrend,
        confidence: getConfidence(leads.length)
      },
      commissionsNext: {
        value: Math.round(commissionsPrediction.next),
        trend: commissionsPrediction.trend,
        confidence: getConfidence(commissions.length)
      },
      conversionNext: {
        value: conversionRate,
        trend: 0, // Tendance plate pour le taux
        confidence: recentLeads.length > 30 ? 'high' : 'medium'
      }
    });
  };

  const prepareComparison = (sales, leads, commissions) => {
    // Comparer les prédictions du mois dernier avec les résultats réels
    if (sales.length < 2 || leads.length < 2 || commissions.length < 2) return;
    
    const lastMonth = sales[sales.length - 1];
    const previousData = sales.slice(0, -1);
    const prediction = calculateLinearTrend(previousData);
    
    const comparisonData = [
      {
        metric: t('predictions.sales'),
        predicted: Math.round(prediction.next),
        actual: Math.round(lastMonth.value),
        accuracy: calculateAccuracy(prediction.next, lastMonth.value)
      },
      {
        metric: t('predictions.leads'),
        predicted: Math.round(calculateMovingAverage(leads.slice(0, -1))),
        actual: leads[leads.length - 1].count,
        accuracy: calculateAccuracy(
          calculateMovingAverage(leads.slice(0, -1)),
          leads[leads.length - 1].count
        )
      },
      {
        metric: t('predictions.commissions'),
        predicted: Math.round(calculateLinearTrend(commissions.slice(0, -1)).next),
        actual: Math.round(commissions[commissions.length - 1].value),
        accuracy: calculateAccuracy(
          calculateLinearTrend(commissions.slice(0, -1)).next,
          commissions[commissions.length - 1].value
        )
      }
    ];
    
    setComparison(comparisonData);
  };

  const calculateAccuracy = (predicted, actual) => {
    if (actual === 0) return predicted === 0 ? 100 : 0;
    const error = Math.abs(predicted - actual) / actual;
    return Math.max(0, Math.round((1 - error) * 100));
  };

  const getConfidenceColor = (confidence) => {
    switch(confidence) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConfidenceIcon = (confidence) => {
    switch(confidence) {
      case 'high': return '●●●';
      case 'medium': return '●●○';
      case 'low': return '●○○';
      default: return '○○○';
    }
  };

  const PredictionCard = ({ title, prediction, unit = '', icon: Icon = TrendingUp }) => {
    const TrendIcon = prediction.trend > 0 ? TrendingUp : TrendingDown;
    const trendColor = prediction.trend > 0 ? 'text-green-500' : 'text-red-500';
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>{title}</span>
            <Icon className="w-4 h-4 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {unit === '€' && '€'}
            {unit === '%' ? prediction.value.toFixed(1) : prediction.value.toLocaleString()}
            {unit === '%' && '%'}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className={`flex items-center ${trendColor}`}>
              <TrendIcon size={16} />
              <span className="ml-1 text-sm">
                {Math.abs(prediction.trend).toFixed(1)}%
              </span>
            </div>
            <div className={`text-sm ${getConfidenceColor(prediction.confidence)}`}>
              <span title={t(`predictions.confidence.${prediction.confidence}`)}>
                {getConfidenceIcon(prediction.confidence)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('predictions.title')}</h1>
        <p className="text-gray-400 mt-1">{t('predictions.subtitle')}</p>
      </div>

      {/* Predictions Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('predictions.nextMonth')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <PredictionCard
            title={t('predictions.expectedSales')}
            prediction={predictions.salesNext}
            unit="€"
            icon={TrendingUp}
          />
          <PredictionCard
            title={t('predictions.expectedLeads')}
            prediction={predictions.leadsNext}
            icon={Activity}
          />
          <PredictionCard
            title={t('predictions.expectedCommissions')}
            prediction={predictions.commissionsNext}
            unit="€"
            icon={TrendingUp}
          />
          <PredictionCard
            title={t('predictions.expectedConversion')}
            prediction={predictions.conversionNext}
            unit="%"
            icon={Activity}
          />
        </div>
      </div>

      {/* Confidence Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('predictions.confidenceLevels')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">●●●</span>
              <span>{t('predictions.confidence.high')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">●●○</span>
              <span>{t('predictions.confidence.medium')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500">●○○</span>
              <span>{t('predictions.confidence.low')}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t('predictions.confidenceNote')}
          </p>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {comparison.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('predictions.lastMonthComparison')}</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t('predictions.metric')}</th>
                  <th className="text-right p-2">{t('predictions.predicted')}</th>
                  <th className="text-right p-2">{t('predictions.actual')}</th>
                  <th className="text-right p-2">{t('predictions.accuracy')}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{row.metric}</td>
                    <td className="text-right p-2">{row.predicted.toLocaleString()}</td>
                    <td className="text-right p-2">{row.actual.toLocaleString()}</td>
                    <td className="text-right p-2">
                      <span className={
                        row.accuracy >= 80 ? 'text-green-500' :
                        row.accuracy >= 60 ? 'text-yellow-500' :
                        'text-red-500'
                      }>
                        {row.accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      <Card className="bg-blue-900 bg-opacity-20 border-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-500 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="font-medium text-blue-400">{t('predictions.disclaimer')}</p>
              <p className="text-gray-400 mt-1">
                {t('predictions.disclaimerText')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}