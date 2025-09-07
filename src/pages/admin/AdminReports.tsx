import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Download, FileText } from 'lucide-react';

export default function AdminReports() {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState('projects');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [reportData, setReportData] = useState([]);
  const [totals, setTotals] = useState<{
    count?: number;
    totalValue?: number;
    goldenVisa?: number;
    converted?: number;
    lost?: number;
    conversionRate?: number;
    goldenVisaInterest?: number;
    totalAmount?: number;
    pending?: number;
    paid?: number;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReport();
  }, [reportType, startDate, endDate]);

  const generateReport = async () => {
    setLoading(true);
    
    switch(reportType) {
      case 'projects':
        await generateProjectsReport();
        break;
      case 'leads':
        await generateLeadsReport();
        break;
      case 'commissions':
        await generateCommissionsReport();
        break;
    }
    
    setLoading(false);
  };

  const generateProjectsReport = async () => {
    try {
      const { data } = await supabase
        .from('projects')
        .select(`
          *,
          developers(name)
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59')
        .order('created_at', { ascending: false });

      if (data) {
        setReportData(data);
        setTotals({
          count: data.length,
          totalValue: data.reduce((sum, p) => sum + (Number(p.price) || 0), 0),
          goldenVisa: data.filter(p => p.golden_visa_eligible).length
        });
      }
    } catch (error) {
      console.error('Error generating projects report:', error);
    }
  };

  const generateLeadsReport = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59')
        .order('created_at', { ascending: false });

      if (data) {
        setReportData(data);
        
        const statusCounts: Record<string, number> = data.reduce((acc, lead) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const converted = statusCounts.converted || 0;
        const conversionRate = data.length > 0 ? (converted / data.length * 100) : 0;
        
        setTotals({
          count: data.length,
          converted,
          lost: statusCounts.lost || 0,
          conversionRate: Number(conversionRate.toFixed(1)),
          goldenVisaInterest: data.filter(l => l.golden_visa_interest).length
        });
      }
    } catch (error) {
      console.error('Error generating leads report:', error);
    }
  };

  const generateCommissionsReport = async () => {
    try {
      const { data } = await supabase
        .from('commissions')
        .select(`
          *,
          promoters(name),
          projects(title)
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (data) {
        setReportData(data);
        setTotals({
          count: data.length,
          totalAmount: data.reduce((sum, c) => sum + (Number(c.amount) || 0), 0),
          pending: data.filter(c => c.status === 'pending')
            .reduce((sum, c) => sum + (Number(c.amount) || 0), 0),
          paid: data.filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
        });
      }
    } catch (error) {
      console.error('Error generating commissions report:', error);
    }
  };

  const exportToCSV = () => {
    if (!reportData.length) return;

    let csv = '';
    let headers = [];
    let rows = [];

    switch(reportType) {
      case 'projects':
        headers = ['Date', 'Projet', 'Développeur', 'Zone', 'Statut', 'Prix', 'Golden Visa'];
        rows = reportData.map(p => [
          new Date(p.created_at).toLocaleDateString(),
          p.title || p.name || '',
          p.developers?.name || '',
          p.cyprus_zone || '',
          p.status || '',
          p.price || 0,
          p.golden_visa_eligible ? 'Oui' : 'Non'
        ]);
        break;

      case 'leads':
        headers = ['Date', 'Nom', 'Email', 'Téléphone', 'Budget Max', 'Statut', 'Score', 'Source', 'Golden Visa'];
        rows = reportData.map(l => [
          new Date(l.created_at).toLocaleDateString(),
          `${l.first_name} ${l.last_name}`,
          l.email,
          l.phone || '',
          l.budget_max || 0,
          l.status,
          l.score || 0,
          l.source || '',
          l.golden_visa_interest ? 'Oui' : 'Non'
        ]);
        break;

      case 'commissions':
        headers = ['Date', 'Projet', 'Promoteur', 'Montant', 'Statut'];
        rows = reportData.map(c => [
          new Date(c.date).toLocaleDateString(),
          c.projects?.title || '',
          c.promoters?.name || '',
          c.amount || 0,
          c.status
        ]);
        break;
    }

    // Créer le CSV
    csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Ajouter les totaux
    csv += '\n';
    if (reportType === 'projects') {
      csv += `"TOTAL","${totals.count} projets","","","","€${totals.totalValue}","${totals.goldenVisa} éligibles"\n`;
    } else if (reportType === 'leads') {
      csv += `"TOTAL","${totals.count} leads","","","","${totals.converted} convertis","","","${totals.goldenVisaInterest} intéressés"\n`;
    } else if (reportType === 'commissions') {
      csv += `"TOTAL","${totals.count} commissions","","€${totals.totalAmount}",""\n`;
    }

    // Télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport_${reportType}_${startDate}_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderTable = () => {
    if (!reportData.length) {
      return <p className="text-center p-4 text-muted-foreground">{t('reports.noData')}</p>;
    }

    switch(reportType) {
      case 'projects':
        return (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('reports.date')}</th>
                <th className="text-left p-2">{t('reports.project')}</th>
                <th className="text-left p-2">{t('reports.developer')}</th>
                <th className="text-left p-2">{t('reports.zone')}</th>
                <th className="text-left p-2">{t('reports.status')}</th>
                <th className="text-right p-2">{t('reports.price')}</th>
                <th className="text-center p-2">GV</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(project => (
                <tr key={project.id} className="border-b">
                  <td className="p-2">{new Date(project.created_at).toLocaleDateString()}</td>
                  <td className="p-2">{project.title || project.name}</td>
                  <td className="p-2">{project.developers?.name}</td>
                  <td className="p-2">{project.cyprus_zone}</td>
                  <td className="p-2">{project.status}</td>
                  <td className="text-right p-2">{formatCurrency(project.price || 0)}</td>
                  <td className="text-center p-2">
                    {project.golden_visa_eligible && <span className="text-yellow-500">✓</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'leads':
        return (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('reports.date')}</th>
                <th className="text-left p-2">{t('reports.name')}</th>
                <th className="text-left p-2">{t('reports.email')}</th>
                <th className="text-left p-2">{t('reports.status')}</th>
                <th className="text-right p-2">{t('reports.budget')}</th>
                <th className="text-center p-2">{t('reports.score')}</th>
                <th className="text-center p-2">GV</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(lead => (
                <tr key={lead.id} className="border-b">
                  <td className="p-2">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="p-2">{lead.first_name} {lead.last_name}</td>
                  <td className="p-2">{lead.email}</td>
                  <td className="p-2">{t(`leads.status.${lead.status}`)}</td>
                  <td className="text-right p-2">{formatCurrency(lead.budget_max || 0)}</td>
                  <td className="text-center p-2">{lead.score}</td>
                  <td className="text-center p-2">
                    {lead.golden_visa_interest && <span className="text-yellow-500">✓</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'commissions':
        return (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('reports.date')}</th>
                <th className="text-left p-2">{t('reports.project')}</th>
                <th className="text-left p-2">{t('reports.promoter')}</th>
                <th className="text-right p-2">{t('reports.commission')}</th>
                <th className="text-center p-2">{t('reports.status')}</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(commission => (
                <tr key={commission.id} className="border-b">
                  <td className="p-2">{new Date(commission.date).toLocaleDateString()}</td>
                  <td className="p-2">{commission.projects?.title}</td>
                  <td className="p-2">{commission.promoters?.name}</td>
                  <td className="text-right p-2">{formatCurrency(commission.amount || 0)}</td>
                  <td className="text-center p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      commission.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {t(`commissions.status.${commission.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  const renderTotals = () => {
    return (
      <div className="bg-muted p-4 rounded mt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{t('reports.totals')}</span>
          <div className="flex gap-4">
            {reportType === 'projects' && (
              <>
                <span>{totals.count} {t('reports.projects')}</span>
                <span>{formatCurrency(totals.totalValue || 0)}</span>
                <span>{totals.goldenVisa} GV</span>
              </>
            )}
            {reportType === 'leads' && (
              <>
                <span>{totals.count} {t('reports.leads')}</span>
                <span>{totals.converted} {t('reports.converted')}</span>
                <span>{totals.conversionRate}% {t('reports.conversion')}</span>
              </>
            )}
            {reportType === 'commissions' && (
              <>
                <span>{totals.count} {t('reports.commissions')}</span>
                <span>{formatCurrency(totals.totalAmount || 0)} {t('reports.total')}</span>
                <span>{formatCurrency(totals.pending || 0)} {t('reports.pending')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText />
              {t('reports.title')}
            </CardTitle>
            <Button onClick={exportToCSV} disabled={!reportData.length}>
              <Download className="mr-2" size={16} />
              {t('reports.downloadCSV')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projects">{t('reports.projectsReport')}</SelectItem>
                <SelectItem value="leads">{t('reports.leadsReport')}</SelectItem>
                <SelectItem value="commissions">{t('reports.commissionsReport')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder={t('reports.startDate')}
            />
            
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder={t('reports.endDate')}
            />
            
            <Button onClick={generateReport} disabled={loading}>
              {loading ? t('reports.generating') : t('reports.generate')}
            </Button>
          </div>

          {/* Tableau de données */}
          <div className="overflow-x-auto">
            {renderTable()}
          </div>

          {/* Totaux */}
          {reportData.length > 0 && renderTotals()}
        </CardContent>
      </Card>
    </div>
  );
}