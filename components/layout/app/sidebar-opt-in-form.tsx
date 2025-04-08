import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export function SidebarOptInForm() {
  return (
    <Card className="shadow-none">
      <form>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm">📚 Panduan Pengguna</CardTitle>
          <CardDescription>Cek manual book kami. Lengkap dan mudah dipahami.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2.5 p-4">
          <Button
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
            size="sm"
          >
            ⬇️ Unduh Manual Book
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
