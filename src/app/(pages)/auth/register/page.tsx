import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Register</h1>
        <p className="mt-2 text-black dark:text-gray-400">
          Register your account
        </p>
      </div>
      <form className="space-y-4">
        <div>
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email" >
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            required
            type="email"
          />
        </div>
        <div>
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            placeholder="Password"
            required
            type="password"
          />
        </div>
        <div>
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
            Confirm Password
          </Label>
          <Input
            id="password"
            placeholder="Password"
            required
            type="password"
          />
        </div>
        <Button className="w-full" type="submit">
          Create
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        Ja possui uma conta?
        <Link className="font-medium underline underline-offset-4" href="/auth/login">
          Login
        </Link>
      </div>
    </div>
  );
}
