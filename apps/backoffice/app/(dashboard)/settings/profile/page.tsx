import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/feedback-ui"
import { Input } from "@workspace/feedback-ui"
import { Label } from "@workspace/feedback-ui"
import { Button } from "@workspace/feedback-ui"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
