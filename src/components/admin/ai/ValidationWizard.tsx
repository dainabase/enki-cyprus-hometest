import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Edit, 
  Save,
  Trash
} from 'lucide-react';

export function ValidationWizard({ 
  data, 
  onValidate, 
  onCancel 
}: {
  data: any;
  onValidate: (data: any) => void;
  onCancel: () => void;
}) {
  const [editedData, setEditedData] = useState(data);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Set<number>>(new Set());

  const validateData = () => {
    const errors: string[] = [];
    
    // Validation rules
    if (!editedData.developer.name) errors.push('Nom du développeur requis');
    if (!editedData.project.name) errors.push('Nom du projet requis');
    if (editedData.buildings.length === 0) errors.push('Au moins un bâtiment requis');
    if (editedData.properties.length === 0) errors.push('Au moins une propriété requise');
    
    // Vérifier les doublons
    const unitNumbers = editedData.properties.map((p: any) => p.unit_number);
    const duplicates = unitNumbers.filter((u: string, i: number) => unitNumbers.indexOf(u) !== i);
    if (duplicates.length > 0) {
      errors.push(`Numéros d'unité en double: ${duplicates.join(', ')}`);
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePropertyEdit = (index: number, field: string, value: any) => {
    const updated = [...editedData.properties];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalculer Golden Visa si le prix change
    if (field === 'price') {
      updated[index].is_golden_visa = value >= 300000;
    }
    
    setEditedData({ ...editedData, properties: updated });
  };

  const handleBulkAction = (action: string) => {
    if (selectedProperties.size === 0) return;
    
    const updated = [...editedData.properties];
    
    switch (action) {
      case 'delete':
        const filtered = updated.filter((_, i) => !selectedProperties.has(i));
        setEditedData({ ...editedData, properties: filtered });
        setSelectedProperties(new Set());
        break;
      case 'mark_available':
        selectedProperties.forEach(i => {
          updated[i].status = 'available';
        });
        setEditedData({ ...editedData, properties: updated });
        break;
      case 'increase_price':
        selectedProperties.forEach(i => {
          updated[i].price = Math.round(updated[i].price * 1.05);
          updated[i].is_golden_visa = updated[i].price >= 300000;
        });
        setEditedData({ ...editedData, properties: updated });
        break;
    }
  };

  const handleFinalValidation = () => {
    if (validateData()) {
      onValidate(editedData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Validation et Correction des Données</span>
            <div className="flex gap-2">
              <Badge variant="outline">
                {editedData.properties.length} propriétés
              </Badge>
              <Badge variant="outline" className="bg-yellow-100">
                {editedData.properties.filter((p: any) => p.is_golden_visa).length} Golden Visa
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Erreurs de validation */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs de validation */}
      <Tabs defaultValue="developer">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="developer">
            Développeur
            {editedData.developer.name ? <CheckCircle className="ml-2 h-3 w-3" /> : <XCircle className="ml-2 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="project">
            Projet
            {editedData.project.name ? <CheckCircle className="ml-2 h-3 w-3" /> : <XCircle className="ml-2 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="buildings">
            Bâtiments ({editedData.buildings.length})
          </TabsTrigger>
          <TabsTrigger value="properties">
            Propriétés ({editedData.properties.length})
          </TabsTrigger>
        </TabsList>

        {/* Développeur */}
        <TabsContent value="developer">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between">
                Informations Développeur
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditMode({ ...editMode, developer: !editMode.developer })}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {editMode.developer ? 'Terminer' : 'Modifier'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom de l'entreprise *</Label>
                  <Input
                    value={editedData.developer.name}
                    disabled={!editMode.developer}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      developer: { ...editedData.developer, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editedData.developer.email}
                    disabled={!editMode.developer}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      developer: { ...editedData.developer, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={editedData.developer.phone}
                    disabled={!editMode.developer}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      developer: { ...editedData.developer, phone: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Site web</Label>
                  <Input
                    value={editedData.developer.website || ''}
                    disabled={!editMode.developer}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      developer: { ...editedData.developer, website: e.target.value }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projet */}
        <TabsContent value="project">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between">
                Informations Projet
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditMode({ ...editMode, project: !editMode.project })}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {editMode.project ? 'Terminer' : 'Modifier'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom du projet *</Label>
                  <Input
                    value={editedData.project.name}
                    disabled={!editMode.project}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      project: { ...editedData.project, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Localisation</Label>
                  <Input
                    value={editedData.project.location}
                    disabled={!editMode.project}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      project: { ...editedData.project, location: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Unités totales</Label>
                  <Input
                    type="number"
                    value={editedData.project.total_units}
                    disabled={!editMode.project}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      project: { ...editedData.project, total_units: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={editedData.project.status}
                    disabled={!editMode.project}
                    className="border rounded px-3 py-2 w-full"
                    onChange={(e) => setEditedData({
                      ...editedData,
                      project: { ...editedData.project, status: e.target.value }
                    })}
                  >
                    <option value="planned">Planifié</option>
                    <option value="construction">En construction</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bâtiments */}
        <TabsContent value="buildings">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Bâtiments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editedData.buildings.map((building: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div><strong>{building.name}</strong></div>
                        <div>Étages: {building.floors}</div>
                        <div>Unités/étage: {building.units_per_floor}</div>
                        <div>Total: {building.total_units} unités</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Propriétés avec édition en ligne */}
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between">
                <span>Liste des Propriétés</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('mark_available')}
                    disabled={selectedProperties.size === 0}
                  >
                    Marquer disponible
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('increase_price')}
                    disabled={selectedProperties.size === 0}
                  >
                    +5% prix
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction('delete')}
                    disabled={selectedProperties.size === 0}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">
                        <Checkbox
                          checked={selectedProperties.size === editedData.properties.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProperties(new Set(editedData.properties.map((_: any, i: number) => i)));
                            } else {
                              setSelectedProperties(new Set());
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-2 text-left">Unité</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Ch.</th>
                      <th className="px-4 py-2 text-left">SdB</th>
                      <th className="px-4 py-2 text-left">Surface</th>
                      <th className="px-4 py-2 text-left">Prix</th>
                      <th className="px-4 py-2 text-left">GV</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedData.properties.map((prop: any, idx: number) => (
                      <tr key={idx} className={selectedProperties.has(idx) ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-2">
                          <Checkbox
                            checked={selectedProperties.has(idx)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedProperties);
                              if (checked) {
                                newSelected.add(idx);
                              } else {
                                newSelected.delete(idx);
                              }
                              setSelectedProperties(newSelected);
                            }}
                          />
                        </td>
                        <td className="px-4 py-2">
                          {editMode[`prop-${idx}`] ? (
                            <Input
                              value={prop.unit_number}
                              className="w-20"
                              onChange={(e) => handlePropertyEdit(idx, 'unit_number', e.target.value)}
                            />
                          ) : (
                            prop.unit_number
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editMode[`prop-${idx}`] ? (
                            <select
                              value={prop.type}
                              className="border rounded px-2 py-1"
                              onChange={(e) => handlePropertyEdit(idx, 'type', e.target.value)}
                            >
                              <option value="studio">Studio</option>
                              <option value="apartment">Appartement</option>
                              <option value="penthouse">Penthouse</option>
                              <option value="villa">Villa</option>
                            </select>
                          ) : (
                            prop.type
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editMode[`prop-${idx}`] ? (
                            <Input
                              type="number"
                              value={prop.bedrooms}
                              className="w-12"
                              onChange={(e) => handlePropertyEdit(idx, 'bedrooms', parseInt(e.target.value))}
                            />
                          ) : (
                            prop.bedrooms
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editMode[`prop-${idx}`] ? (
                            <Input
                              type="number"
                              value={prop.bathrooms}
                              className="w-12"
                              onChange={(e) => handlePropertyEdit(idx, 'bathrooms', parseInt(e.target.value))}
                            />
                          ) : (
                            prop.bathrooms
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editMode[`prop-${idx}`] ? (
                            <Input
                              type="number"
                              value={prop.size_m2}
                              className="w-16"
                              onChange={(e) => handlePropertyEdit(idx, 'size_m2', parseFloat(e.target.value))}
                            />
                          ) : (
                            `${prop.size_m2} m²`
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editMode[`prop-${idx}`] ? (
                            <Input
                              type="number"
                              value={prop.price || ''}
                              className="w-24"
                              onChange={(e) => handlePropertyEdit(idx, 'price', parseFloat(e.target.value) || 0)}
                            />
                          ) : (
                            prop.price ? `€${prop.price.toLocaleString()}` : 'N/A'
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {prop.is_golden_visa && <Badge className="bg-yellow-500">✓</Badge>}
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={prop.status === 'available' ? 'default' : 'secondary'}>
                            {prop.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditMode({
                              ...editMode,
                              [`prop-${idx}`]: !editMode[`prop-${idx}`]
                            })}
                          >
                            {editMode[`prop-${idx}`] ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions finales */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Vérifiez toutes les données avant l'import final
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button 
                onClick={handleFinalValidation}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Valider et Importer Tout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}