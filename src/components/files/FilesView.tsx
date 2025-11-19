import React, { useState, useMemo } from 'react';
import { Search, Folder, FileAudio, FileText, FileJson, FileImage, File, MoreHorizontal, Upload, FolderPlus, ArrowUpDown, Trash2, Download } from 'lucide-react';
import { mockFiles } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
type FileType = 'folder' | 'wav' | 'pdf' | 'txt' | 'json' | 'svg' | string;
type SortKey = 'name' | 'type' | 'size' | 'lastModified';
type SortDirection = 'asc' | 'desc';
interface MockFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  lastModified: string;
}
const FileIcon = ({ type }: { type: FileType }) => {
  const iconProps = { size: 20, className: "mr-3 text-muted-foreground" };
  switch (type) {
    case 'folder':
      return <Folder {...iconProps} />;
    case 'wav':
      return <FileAudio {...iconProps} />;
    case 'pdf':
      return <FileText {...iconProps} />;
    case 'txt':
      return <FileText {...iconProps} />;
    case 'json':
      return <FileJson {...iconProps} />;
    case 'svg':
      return <FileImage {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
};
export const FilesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: 'asc' });
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const sortedAndFilteredFiles = useMemo(() => {
    let filtered = mockFiles.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [searchTerm, sortConfig]);
  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
    <TableHead onClick={() => handleSort(sortKey)} className="cursor-pointer hover:bg-muted/50">
      <div className="flex items-center gap-2">
        {label}
        {sortConfig.key === sortKey && <ArrowUpDown className="h-4 w-4" />}
      </div>
    </TableHead>
  );
  return (
    <div className="h-full flex flex-col animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gerenciador de Arquivos</h2>
          <p className="text-sm text-muted-foreground">Navegue e gerencie os arquivos do sistema.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><FolderPlus className="mr-2 h-4 w-4" /> Nova Pasta</Button>
          <Button><Upload className="mr-2 h-4 w-4" /> Upload</Button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          type="text"
          placeholder="Buscar arquivos e pastas..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full overflow-y-auto custom-scroll">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <SortableHeader label="Nome" sortKey="name" />
                <SortableHeader label="Tipo" sortKey="type" />
                <SortableHeader label="Tamanho" sortKey="size" />
                <SortableHeader label="Última Modificação" sortKey="lastModified" />
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredFiles.map((file) => (
                <TableRow key={file.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileIcon type={file.type} />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground uppercase text-xs">{file.type}</TableCell>
                  <TableCell className="text-muted-foreground">{file.size}</TableCell>
                  <TableCell className="text-muted-foreground">{file.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Baixar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};