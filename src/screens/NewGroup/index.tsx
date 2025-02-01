import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { Container, Content, Icon } from "./styles";
import { groupCreate } from "@storage/group/groupCreate";
import { Alert } from "react-native";
import { AppError } from "@utils/AppError";

export function NewGroup() {
  const [group, setGroup] = useState('');
  const navigation = useNavigation();

  async function handleNew() {
    
    try {
      if(group.trim() === '') {
        Alert.alert('Novo Grupo', 'O nome do grupo não pode ser vazio.');
        return;
      }
      await groupCreate(group);
      navigation.navigate("players", { group });  
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert('Novo Grupo', error.message);
      }else{
        Alert.alert('Novo Grupo', 'Não foi possível criar um novo grupo.');
        console.log(error);
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <Highlight
          title="Nova turma"
          subtitle="Crie uma nova turma para jogar com seus amigos!"
        />
        <Input placeholder="Nome da turma." onChangeText={setGroup} />
        <Button title="Criar" style={{ marginTop: 20 }} onPress={handleNew} />
      </Content>
    </Container>
  );
}
