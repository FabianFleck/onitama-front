"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  username: z
    .string()
    .regex(/^[A-Za-z]+$/i, "Somente letras são permitidas")
    .min(2, {
      message: "O nome de usuário deve ter pelo menos 2 caracteres",
    }),
  password: z.string().nonempty("Senha necessária"),
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const result = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false
    });

    if (result?.error) {
      alert("Login Failed: " + result.error);
    } else {
      router.push('/auth/register');
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Login</h1>
        <p className="mt-2 text-black dark:text-gray-400">
          Sign in to your account
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
}
