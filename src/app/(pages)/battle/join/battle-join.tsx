import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiClientWithToken } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  battleId: z.string().nonempty("Id necessário"),
});

export function BattleJoin({ onClose }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      battleId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const session = await getSession();
    if (session) {
      try {
        setLoading(true);
        const client = apiClientWithToken(session.token);
        const response = await client.post("/api/battle/" + values.battleId);
        console.log(response);

        if (response.status === 200) {
          setLoading(false);
          onClose({
            type: "success",
            message: "Bora para a batalha!",
            info: response.data.id,
            close: true,
          });
        } else {
          setLoading(false);
          onClose({
            type: "error",
            message: "Erro ao juntar-se a batalha",
            info: error.response.data.errors[0],
            close: false,
          });
        }
      } catch (error) {
        setLoading(false);
        onClose({
          type: "error",
          message: "Erro ao juntar-se a batalha",
          info: error.response.data.errors[0],
          close: false,
        });
      }
    }
  }

  return (
    <div className="modal">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Criar Batalha</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="battleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id da batalha</FormLabel>
                    <FormControl>
                      <Input
                        type="battleId"
                        placeholder="id da batalha"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                {loading ? "Carregando..." : "Juntar-se"}
              </Button>
              <Button
                className="w-full"
                onClick={() => onClose({ close: true })}
                variant="outline"
              >
                Voltar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
