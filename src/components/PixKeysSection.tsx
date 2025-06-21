
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Plus,
  Copy,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  Smartphone,
  Mail,
  Phone,
  Hash
} from 'lucide-react';
import { mockPIXKeys } from '@/data/mockData';
import { PIXKey } from '@/types';

export function PixKeysSection() {
  const [pixKeys, setPixKeys] = useState<PIXKey[]>(mockPIXKeys);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKey, setNewKey] = useState({
    type: 'cpf' as PIXKey['type'],
    value: ''
  });

  const handleToggleKey = (keyId: string) => {
    setPixKeys(prev =>
      prev.map(key =>
        key.id === keyId ? { ...key, active: !key.active } : key
      )
    );
  };

  const handleAddKey = () => {
    const key: PIXKey = {
      id: Date.now().toString(),
      type: newKey.type,
      value: newKey.value,
      active: true
    };
    setPixKeys(prev => [...prev, key]);
    setNewKey({ type: 'cpf', value: '' });
    setShowAddKeyModal(false);
  };

  const getKeyTypeIcon = (type: PIXKey['type']) => {
    switch (type) {
      case 'cpf':
      case 'cnpj':
        return <CreditCard className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'random':
        return <Hash className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getKeyTypeLabel = (type: PIXKey['type']) => {
    switch (type) {
      case 'cpf':
        return 'CPF';
      case 'cnpj':
        return 'CNPJ';
      case 'email':
        return 'E-mail';
      case 'phone':
        return 'Telefone';
      case 'random':
        return 'Chave Aleatória';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Minhas Chaves PIX</CardTitle>
          <Dialog open={showAddKeyModal} onOpenChange={setShowAddKeyModal}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Chave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Chave PIX</DialogTitle>
                <DialogDescription>
                  Cadastre uma nova chave PIX para receber pagamentos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyType">Tipo de Chave</Label>
                  <select
                    id="keyType"
                    value={newKey.type}
                    onChange={(e) => setNewKey(prev => ({ ...prev, type: e.target.value as PIXKey['type'] }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                    <option value="email">E-mail</option>
                    <option value="phone">Telefone</option>
                    <option value="random">Chave Aleatória</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyValue">Valor da Chave</Label>
                  <Input
                    id="keyValue"
                    value={newKey.value}
                    onChange={(e) => setNewKey(prev => ({ ...prev, value: e.target.value }))}
                    placeholder={`Digite ${getKeyTypeLabel(newKey.type).toLowerCase()}`}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddKeyModal(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddKey} disabled={!newKey.value.trim()}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pixKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getKeyTypeIcon(key.type)}
                </div>
                <div>
                  <div className="font-medium">{getKeyTypeLabel(key.type)}</div>
                  <div className="text-sm text-gray-600">{key.value}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={key.active ? "default" : "secondary"}>
                  {key.active ? 'Ativa' : 'Inativa'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleKey(key.id)}
                >
                  {key.active ? (
                    <ToggleRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}