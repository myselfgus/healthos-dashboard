import React from 'react';
import { User, Palette, HardDrive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/use-theme';
import { toast } from 'sonner';
const ProfileSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Perfil do Usuário</CardTitle>
      <CardDescription>Gerencie as informações da sua conta.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" defaultValue="Dr. Voither" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue="dr.voither@healthos.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="crm">CRM</Label>
        <Input id="crm" defaultValue="CRM/SP 123.456" />
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={() => toast.success("Perfil atualizado com sucesso!")}>Salvar Alterações</Button>
    </CardFooter>
  </Card>
);
const AppearanceSettings = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>Personalize a aparência da interface.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode" className="text-base">Modo Escuro</Label>
            <p className="text-sm text-muted-foreground">
              Alterne entre o tema claro e escuro.
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={isDark}
            onCheckedChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="font-family">Fonte da Interface</Label>
          <Select defaultValue="inter">
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Selecione uma fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter (Padr��o)</SelectItem>
              <SelectItem value="system">Fonte do Sistema</SelectItem>
              <SelectItem value="mono">Monoespaçada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => toast.success("Preferências de aparência salvas!")}>Salvar Preferências</Button>
      </CardFooter>
    </Card>
  );
};
const SystemSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Sistema</CardTitle>
      <CardDescription>Informações sobre o ambiente e a aplicação.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Versão do App:</span>
        <span className="font-medium">v2.8.0-final</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Última Verificação:</span>
        <span className="font-medium">Hoje, 14:30</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Status do Gateway:</span>
        <span className="font-medium text-green-500">Conectado</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Ambiente:</span>
        <span className="font-medium">Produção</span>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" onClick={() => toast.info("Verificando atualizações...", { description: "Nenhuma nova atualização encontrada." })}>Verificar Atualizações</Button>
    </CardFooter>
  </Card>
);
export const SettingsView = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground">Gerencie as configurações da sua conta e do sistema.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="system">
            <HardDrive className="mr-2 h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="system" className="mt-6">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};