import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/feedback-ui"
import { Input } from "@workspace/feedback-ui"
import { Label } from "@workspace/feedback-ui"
import { Button } from "@workspace/feedback-ui"

export default function ChangePasswordPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
        <p className="text-muted-foreground">
          Update your password
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input id="current" type="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <Input id="new" type="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" />
          </div>

          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
