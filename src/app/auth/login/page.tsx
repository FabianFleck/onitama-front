"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Alert from '@mui/material/Alert';
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
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    <Suspense fallback={<>Loading...</>}></Suspense>
    setLoading(true);
    const result = await signIn("login", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setErrorMessage(result.error); // Definindo a mensagem de erro
    } else {
      router.replace("/battle");
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Login</h1>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
          <Button className="w-full" type="submit">
            {loading ? "Carregando..." : "Login"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          Não possiu uma conta?
          <a className="font-medium underline " href="/auth/register">
            <p>Cadastre-se</p>
          </a>
        </div>
      </Form>
    </div>
  );
}
