import { useState } from 'react';
import { Eye, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">{t('admin.developers.headers.logo', { defaultValue: 'Logo' })}</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('name')}
              >
                {t('fields.name', { defaultValue: 'Name' })} <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('main_city')}
              >
                {t('fields.city', { defaultValue: 'City' })} <SortIcon field="main_city" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('status')}
              >
                {t('fields.status', { defaultValue: 'Status' })} <SortIcon field="status" />
              </Button>
            </TableHead>
            <TableHead>{t('fields.website', { defaultValue: 'Website' })}</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort('rating_score')}
              >
                {t('fields.rating', { defaultValue: 'Rating' })} <SortIcon field="rating_score" />
              </Button>
            </TableHead>
            <TableHead>{t('fields.contact', { defaultValue: 'Contact' })}</TableHead>
            <TableHead className="w-32">{t('actions.actions', { defaultValue: 'Actions' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDevelopers.map(dev => (
            <TableRow key={dev.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {getLogo(dev) ? (
                    <img 
                      src={getLogo(dev)} 
                      alt={`${dev.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-primary font-bold text-xs">
                      {dev.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{dev.name}</TableCell>
              <TableCell>{dev.main_city || '-'}</TableCell>
              <TableCell>
                <Badge variant={dev.status === 'active' ? 'default' : 'secondary'}>
                  {t(`status.${dev.status}`, { defaultValue: dev.status === 'active' ? 'Active' : 'Inactive' })}
                </Badge>
              </TableCell>
              <TableCell>
                {dev.website ? (
                  <a href={dev.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-32 block">
                    {dev.website}
                  </a>
                ) : '-'}
              </TableCell>
              <TableCell>
                {dev.rating_score ? `⭐ ${dev.rating_score}/10` : '-'}
              </TableCell>
              <TableCell className="max-w-48">
                <div className="text-sm space-y-1">
                  {dev.contact_info?.email && (
                    <div className="truncate">{dev.contact_info.email}</div>
                  )}
                  {dev.contact_info?.phone && (
                    <div className="text-muted-foreground">{dev.contact_info.phone}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(dev)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(dev)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(dev)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
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