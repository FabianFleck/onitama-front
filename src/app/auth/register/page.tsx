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
import { apiClientWithToken } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react"; 
import Alert from '@mui/material/Alert';

const FormSchema = z
  .object({
    name: z
      .string()
      .regex(/^[A-Za-z]+$/i, "Somente letras são permitidas")
      .min(2, {
        message: "O nome de usuário deve ter pelo menos 2 caracteres",
      }),
    email: z
      .string()
      .nonempty("Digite o e-mail")
      .email({ message: "Endereço de email inválido" }),
    username: z
      .string()
      .regex(/^[A-Za-z]+$/i, "Somente letras são permitidas")
      .min(2, {
        message: "O username deve ter pelo menos 2 caracteres",
      }),
    password: z.string().nonempty("Senha necessária"),
    confirmPassword: z.string().nonempty("Confirmação de senha necessária"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem", // Mensagem de erro se as senhas não coincidirem
    path: ["confirmPassword"], // Indica o campo que causou a falha na validação
  });

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const client = apiClientWithToken(); // Obtém a instância do cliente Axios
      const response = await client.post("/api/user/register", {
        name: values.name,
        email: values.email,
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if(response.status === 201) {
        setSuccessMessage("Usuário cadastrado com sucesso")
        router.replace("/auth/login");
      }
      // Adicional: Redirecionar para a página de login ou dashboard
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response.data.errors[0]);
      // Adicional: Mostrar mensagem de erro na interface do usuário
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="digite seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="digite seu username" {...field} />
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
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="digite sua senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmação de Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirme sua senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
          {loading ? "Carregando..." : "Cadastrar"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          Já possiu uma conta?
          <a className="font-medium underline " href="/auth/login">
            <p>Entrar</p>
          </a>
        </div>
      </Form>
    </div>
  );
}
