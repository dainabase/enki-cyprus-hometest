import { useState } from 'react';
import { Eye, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Building, Euro, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProjectTableViewProps {
  projects: any[];
  onEdit: (project: any) => void;
  selectedProjects: string[];
  onSelectionChange: (ids: string[]) => void;
}

type SortField = 'title' | 'developer' | 'city' | 'price' | 'completion_month' | 'launch_date' | 'cyprus_zone';
type SortOrder = 'asc' | 'desc';

export const ProjectTableView = ({ 
  projects, 
  onEdit, 
  selectedProjects, 
  onSelectionChange 
}: ProjectTableViewProps) => {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleProjectSelect = (projectId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProjects, projectId]);
    } else {
      onSelectionChange(selectedProjects.filter(id => id !== projectId));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getDeveloperName = (project: any) => {
    // Essayer d'abord project.developer (objet)
    if (project.developer && typeof project.developer === 'object') {
      return project.developer.name || 'Non défini';
    }
    // Sinon essayer developers (array - ancien format)
    if (project.developers && Array.isArray(project.developers) && project.developers[0]) {
      return project.developers[0].name || 'Non défini';
    }
    return 'Non défini';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCommercialStatusColor = (status: string) => {
    switch (status) {
      case 'prelancement': return 'bg-purple-100 text-purple-800';
      case 'lancement_commercial': return 'bg-blue-100 text-blue-800';
      case 'en_commercialisation': return 'bg-green-100 text-green-800';
      case 'derniere_opportunite': return 'bg-orange-100 text-orange-800';
      case 'vendu': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommercialStatusLabel = (status: string) => {
    switch (status) {
      case 'prelancement': return 'Prélancement';
      case 'lancement_commercial': return 'Lancement commercial';
      case 'en_commercialisation': return 'En commercialisation';
      case 'derniere_opportunite': return 'Dernière opportunité';
      case 'vendu': return 'Vendu';
      default: return status || '-';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pre_lancement': return 'bg-purple-100 text-purple-800';
      case 'lancement_commercial': return 'bg-blue-100 text-blue-800';
      case 'en_commercialisation': return 'bg-green-100 text-green-800';
      case 'dernieres_opportunites': return 'bg-orange-100 text-orange-800';
      case 'vendu': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'developer':
        aValue = getDeveloperName(a);
        bValue = getDeveloperName(b);
        break;
      case 'price':
        aValue = a.price || a.price_from || 0;
        bValue = b.price || b.price_from || 0;
        break;
      default:
        aValue = a[sortField] || '';
        bValue = b[sortField] || '';
    }

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
          <TableRow className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <TableHead className="text-white font-bold border-0 w-12">
              <Checkbox 
                checked={selectedProjects.length === projects.length && projects.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectionChange(projects.map(p => p.id));
                  } else {
                    onSelectionChange([]);
                  }
                }}
                className="border-white data-[state=checked]:bg-white data-[state=checked]:text-slate-900"
              />
            </TableHead>
            <TableHead className="text-white font-bold border-0">Image</TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('title')}
              >
                Projet <SortIcon field="title" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('developer')}
              >
                Développeur <SortIcon field="developer" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('city')}
              >
                Ville <SortIcon field="city" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('cyprus_zone')}
              >
                Zone <SortIcon field="cyprus_zone" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('price')}
              >
                Prix <SortIcon field="price" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">Statut commercial</TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('launch_date')}
              >
                Lancement <SortIcon field="launch_date" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0">
              <Button 
                variant="ghost" 
                className="h-auto p-0 font-bold text-white hover:bg-white/10"
                onClick={() => handleSort('completion_month')}
              >
                Livraison <SortIcon field="completion_month" />
              </Button>
            </TableHead>
            <TableHead className="text-white font-bold border-0 w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project, index) => (
            <TableRow 
              key={project.id} 
              className={`
                hover:bg-slate-50 transition-colors border-0
                ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
              `}
            >
              <TableCell className="py-4">
                <Checkbox
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={(checked) => 
                    handleProjectSelect(project.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell className="py-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {project.photos && project.photos.length > 0 && project.photos[0] ? (
                    <img 
                      src={project.photos[0]} 
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                   <div className="w-6 h-6 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center" style={{ display: project.photos && project.photos.length > 0 && project.photos[0] ? 'none' : 'flex' }}>
                     <Building className="h-4 w-4 text-white" />
                   </div>
                </div>
              </TableCell>
              <TableCell className="font-bold text-slate-900 py-4 max-w-48">
                <div className="truncate">{project.title}</div>
                {project.neighborhood && (
                  <div className="text-xs text-slate-500 truncate">{project.neighborhood}</div>
                )}
              </TableCell>
              <TableCell className="text-slate-600 py-4">{getDeveloperName(project)}</TableCell>
              <TableCell className="text-slate-600 py-4">{project.city || '-'}</TableCell>
              <TableCell className="text-slate-600 py-4">{project.cyprus_zone || '-'}</TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-1 font-bold text-emerald-700">
                  <Euro className="h-4 w-4" />
                  <span>{formatPrice(project.price || project.price_from || 0)}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge className={getCommercialStatusColor(project.statut_commercial || '')}>
                  {getCommercialStatusLabel(project.statut_commercial || '')}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                {project.launch_date ? (
                  <div className="flex items-center gap-1 text-slate-600">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">
                      {new Date(project.launch_date).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>
              <TableCell className="py-4">
                {/* Date de livraison */}
                {project.completion_month ? (
                  <div className="flex items-center gap-1 text-slate-600">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">{project.completion_month}</span>
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>
              <TableCell className="py-4">
                {project.completion_date_new ? (
                  <div className="flex items-center gap-1 text-slate-600">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">
                      {new Date(project.completion_date_new).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
                    onClick={() => onEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
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