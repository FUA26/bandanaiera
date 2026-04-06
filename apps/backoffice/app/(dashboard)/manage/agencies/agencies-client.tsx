"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Agency {
  id: string;
  name: string;
  nickname: string;
  category: string;
  status: string;
  logo: { cdnUrl: string } | null;
  _count: { servicesAsOwner: number };
}

export function AgenciesClient() {
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agencies')
      .then((res) => res.json())
      .then((data) => {
        setAgencies(data.items);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/manage/agencies/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Agency
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Nickname</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agencies.map((agency) => (
            <TableRow
              key={agency.id}
              className="cursor-pointer"
              onClick={() => router.push(`/manage/agencies/${agency.id}`)}
            >
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={agency.logo?.cdnUrl || undefined} />
                  <AvatarFallback>{agency.nickname.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{agency.name}</TableCell>
              <TableCell>{agency.nickname}</TableCell>
              <TableCell>
                <Badge variant="outline">{agency.category}</Badge>
              </TableCell>
              <TableCell>{agency._count.servicesAsOwner}</TableCell>
              <TableCell>
                <Badge variant={agency.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {agency.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/manage/agencies/${agency.id}`);
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
