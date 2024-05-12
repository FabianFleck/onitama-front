import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiClientWithToken } from "@/lib/axios";
import Switch from "@mui/material/Switch";
import { getSession } from "next-auth/react";
import { useState } from "react";

export function BattleCreate({ onClose }) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const createBattle = async () => {
    const session = await getSession();
    if (session) {
      try {
        setLoading(true);
        const client = apiClientWithToken(session.token);
        const uri = !checked ? "/api/battle?color=RED" : "/api/battle?color=BLUE";
        const response = await client.post(uri);
        console.log(response);

        if (response.status === 200) {
          setLoading(false);
          onClose({
            type: "success",
            message: "Batalha criada!",
            info: response.data.id,
          });
        } else {
          setLoading(false);
          onClose({
            type: "error",
            message: "Erro ao criar a batalha",
            info: error.response.data.errors[0],
          });
        }
      } catch (error) {
        setLoading(false);
        onClose({
          type: "error",
          message: "Erro ao criar a batalha",
          info: error.response.data.errors[0],
        });
      }
    }
  };

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };

  const handleCreateClick = () => {
    createBattle();
  };

  return (
    <div className="modal">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Criar Batalha</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="framework">Escolha o seu lado</Label>
              <div className="items-center space-x-2">
                <Label>V</Label>
                <Switch checked={checked} onChange={switchHandler} />
                <Label>A</Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => onClose()} variant="outline">
            Voltar
          </Button>
          <Button onClick={handleCreateClick}>
            {loading ? "Carregando..." : "Criar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
