import { useState } from 'react';
import { Eye, CreditCard as Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

interface Developer {
  id: string;
  name: string;
  logo?: string;
  main_city?: string;
  status?: string;
  commission_rate?: number;
  contact_info?: any;
  total_projects?: number;
  rating_score?: number;
  website?: string;
}

interface DeveloperTableViewProps {
  developers: Developer[];
  getLogo: (dev: Developer) => string | undefined;
  onEdit: (dev: Developer) => void;
  onDelete: (dev: Developer) => void;
  onViewDetails: (dev: Developer) => void;
}

type SortField = 'name' | 'main_city' | 'status' | 'commission_rate' | 'total_projects' | 'rating_score';
type SortOrder = 'asc' | 'desc';

export const DeveloperTableView = ({ 
  developers, 
  getLogo, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: DeveloperTableViewProps) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedDevelopers = [...developers].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle nested contact_info for email
    if (sortField === 'name') {
      aValue = a.name || '';
      bValue = b.name || '';
    }

    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] hover:from-[hsl(199,63%,55%)] hover:to-[hsl(199,63%,60%)]">
            <TableHead className="text-white font-bold border-0">Logo</TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button
                variant="ghost"
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('name')}
              >
                Nom <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button
                variant="ghost"
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('main_city')}
              >
                Ville <SortIcon field="main_city" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button
                variant="ghost"
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('status')}
              >
                Statut <SortIcon field="status" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">Site Web</TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button
                variant="ghost"
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('rating_score')}
              >
                Note <SortIcon field="rating_score" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">Contact</TableHead>
            <TableHead className="text-white font-bold border-0 w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDevelopers.map((dev, index) => (
            <TableRow 
              key={dev.id} 
              className={`
                hover:bg-slate-50 transition-colors border-0
                ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
              `}
            >
              <TableCell className="py-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {getLogo(dev) ? (
                    <img 
                      src={getLogo(dev)} 
                      alt={`${dev.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-700 font-bold text-sm">
                      {dev.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-bold text-slate-900 py-4">{dev.name}</TableCell>
              <TableCell className="text-slate-600 py-4">{dev.main_city || '-'}</TableCell>
              <TableCell className="py-4">
                <Badge 
                  variant={dev.status === 'active' ? 'default' : 'secondary'}
                  className={`
                    ${dev.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    }
                  `}
                >
                  {dev.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                {dev.website ? (
                  <a 
                    href={dev.website.startsWith('http') ? dev.website : `https://${dev.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 font-medium underline truncate max-w-32 block transition-colors"
                  >
                    {dev.website}
                  </a>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>
              <TableCell className="py-4">
                {dev.rating_score ? (
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">⭐</span>
                    <span className="font-bold text-amber-800">{dev.rating_score}/10</span>
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>
              <TableCell className="max-w-48 py-4">
                <div className="text-sm space-y-1">
                  {dev.contact_info?.email && (
                    <div className="truncate text-slate-700 font-medium">{dev.contact_info.email}</div>
                  )}
                  {dev.contact_info?.phone && (
                    <div className="text-slate-500">{dev.contact_info.phone}</div>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                    onClick={() => onViewDetails(dev)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
                    onClick={() => onEdit(dev)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
                    onClick={() => onDelete(dev)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};