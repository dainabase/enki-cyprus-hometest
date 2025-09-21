import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Trophy, Diamond, Zap, Star, Sparkles, Moon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Segment {
  id: string;
  name: string;
  criteria: string;
  icon: string;
  color: string;
  count: number;
  percentage: number;
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  budget_min: number;
  budget_max: number;
  score: number;
  status: string;
  created_at: string;
  updated_at: string;
  urgency: string;
  golden_visa_interest: boolean;
}

export default function AdminSegmentation() {
  const { t } = useTranslation();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [segmentLeads, setSegmentLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const predefinedSegments = [
    {
      id: 'golden-visa',
      name: t('segmentation.segments.goldenVisa'),
      criteria: 'budget_min.gte.300000,golden_visa_interest.eq.true',
      icon: 'Trophy',
      color: 'bg-yellow-600'
    },
    {
      id: 'high-budget',
      name: t('segmentation.segments.highBudget'),
      criteria: 'budget_min.gte.500000',
      icon: 'Diamond',
      color: 'bg-purple-600'
    },
    {
      id: 'urgent',
      name: t('segmentation.segments.urgent'),
      criteria: 'urgency.in.(immediate,1_month,3_months)',
      icon: 'Zap',
      color: 'bg-red-600'
    },
    {
      id: 'qualified',
      name: t('segmentation.segments.qualified'),
      criteria: 'score.gte.4',
      icon: 'Star',
      color: 'bg-green-600'
    },
    {
      id: 'new-leads',
      name: t('segmentation.segments.newLeads'),
      criteria: `created_at.gte.${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`,
      icon: 'Sparkles',
      color: 'bg-blue-600'
    },
    {
      id: 'dormant',
      name: t('segmentation.segments.dormant'),
      criteria: `status.eq.contacted,updated_at.lt.${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
      icon: 'Moon',
      color: 'bg-gray-600'
    }
  ];

  useEffect(() => {
    loadSegmentData();
  }, []);

  const loadSegmentData = async () => {
    setLoading(true);

    // Get total leads count
    const { count: total } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    setTotalLeads(total || 0);

    // Calculate each segment
    const segmentPromises = predefinedSegments.map(async (segment) => {
      const count = await getSegmentCount(segment.criteria);
      const percentage = total ? Math.round((count / total) * 100) : 0;

      return {
        ...segment,
        count,
        percentage
      };
    });

    const segmentResults = await Promise.all(segmentPromises);
    setSegments(segmentResults);
    setLoading(false);
  };

  const getSegmentCount = async (criteria: string): Promise<number> => {
    try {
      // Simplified query approach to avoid TypeScript inference issues
      if (criteria.includes('budget_min.gte.300000,golden_visa_interest.eq.true')) {
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('budget_min', 300000)
          .eq('golden_visa_interest', true);
        return count || 0;
      } else if (criteria.includes('budget_min.gte.500000')) {
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('budget_min', 500000);
        return count || 0;
      } else if (criteria.includes('urgency.in.')) {
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .in('urgency', ['immediate', '1_month', '3_months']);
        return count || 0;
      } else if (criteria.includes('score.gte.4')) {
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('score', 4);
        return count || 0;
      } else if (criteria.includes('created_at.gte.')) {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo);
        return count || 0;
      } else if (criteria.includes('status.eq.contacted')) {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'contacted')
          .lt('updated_at', monthAgo);
        return count || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting segment count:', error);
      return 0;
    }
  };

  const getSegmentLeads = async (criteria: string): Promise<Lead[]> => {
    try {
      // Simplified query approach to avoid TypeScript inference issues
      if (criteria.includes('budget_min.gte.300000,golden_visa_interest.eq.true')) {
        const { data } = await supabase
          .from('leads')
          .select('*')
          .gte('budget_min', 300000)
          .eq('golden_visa_interest', true)
          .order('created_at', { ascending: false });
        return data || [];
      } else if (criteria.includes('budget_min.gte.500000')) {
        const { data } = await supabase
          .from('leads')
          .select('*')
          .gte('budget_min', 500000)
          .order('created_at', { ascending: false });
        return data || [];
      } else if (criteria.includes('urgency.in.')) {
        const { data } = await supabase
          .from('leads')
          .select('*')
          .in('urgency', ['immediate', '1_month', '3_months'])
          .order('created_at', { ascending: false });
        return data || [];
      } else if (criteria.includes('score.gte.4')) {
        const { data } = await supabase
          .from('leads')
          .select('*')
          .gte('score', 4)
          .order('created_at', { ascending: false });
        return data || [];
      } else if (criteria.includes('created_at.gte.')) {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data } = await supabase
          .from('leads')
          .select('*')
          .gte('created_at', weekAgo)
          .order('created_at', { ascending: false });
        return data || [];
      } else if (criteria.includes('status.eq.contacted')) {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data } = await supabase
          .from('leads')
          .select('*')
          .eq('status', 'contacted')
          .lt('updated_at', monthAgo)
          .order('created_at', { ascending: false });
        return data || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting segment leads:', error);
      return [];
    }
  };

  const handleSegmentClick = async (segment: Segment) => {
    setSelectedSegment(segment.id);
    setLeadsLoading(true);

    const leads = await getSegmentLeads(segment.criteria);
    setSegmentLeads(leads);
    setLeadsLoading(false);
  };

  const formatBudget = (min?: number, max?: number) => {
    if (min && max) {
      return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    } else if (min) {
      return `€${min.toLocaleString()}+`;
    } else if (max) {
      return `< €${max.toLocaleString()}`;
    }
    return t('segmentation.notSpecified');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('segmentation.title')}</h1>
        <p className="text-gray-400 mt-1">{t('segmentation.subtitle')}</p>
        <p className="text-sm text-gray-500 mt-2">
          {t('segmentation.totalLeads', { count: totalLeads })}
        </p>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((segment) => (
          <Card
            key={segment.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              selectedSegment === segment.id 
                ? 'border-primary' 
                : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => handleSegmentClick(segment)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   {(() => {
                     const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
                       Trophy, Diamond, Zap, Star, Sparkles, Moon
                     };
                     const IconComponent = iconMap[segment.icon];
                     return IconComponent ? <IconComponent className="w-6 h-6 text-gray-600" /> : null;
                   })()}
                  <span className="text-lg">{segment.name}</span>
                </div>
                <Badge variant="secondary" className={`${segment.color} text-white`}>
                  {segment.percentage}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{segment.count}</p>
                  <p className="text-sm text-gray-500">{t('segmentation.leads')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{t('segmentation.clickToView')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leads Table */}
      {selectedSegment && (
        <Card>
          <CardHeader>
            <CardTitle>
              {t('segmentation.leadsInSegment', { 
                segment: segments.find(s => s.id === selectedSegment)?.name 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="text-center py-8">Loading leads...</div>
            ) : segmentLeads.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('segmentation.table.name')}</TableHead>
                    <TableHead>{t('segmentation.table.email')}</TableHead>
                    <TableHead>{t('segmentation.table.budget')}</TableHead>
                    <TableHead>{t('segmentation.table.score')}</TableHead>
                    <TableHead>{t('segmentation.table.status')}</TableHead>
                    <TableHead>{t('segmentation.table.created')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segmentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        {lead.first_name} {lead.last_name}
                      </TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>
                        {formatBudget(lead.budget_min, lead.budget_max)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.score >= 4 ? "default" : "secondary"}>
                          {lead.score}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t(`leads.status.${lead.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(lead.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('segmentation.noLeadsInSegment')}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}