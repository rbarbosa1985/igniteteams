import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Keyboard, TextInput } from "react-native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
    group: string;
}

export function Players() {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const newPlayerNameInputRef = useRef<TextInput>(null);
    const { group } = route.params as RouteParams;
    const [team, setTeam] = useState<string>("time a");
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
    const [newPlayerName, setNewPlayerName] = useState("");

    async function handleAddPlayer() {
        // Adicionar jogador
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa',"Digite o nome da pessoa.");
        }
        
        const newPlayer = {
            name: newPlayerName,
            team
        }

        try {

            await playerAddByGroup(newPlayer, group);
            newPlayerNameInputRef.current?.blur();
            Keyboard.dismiss();
            setNewPlayerName("");
            fetchPlayersByTeam();
            
        } catch (error) {
            if(error instanceof AppError){
                Alert.alert('Nova pessoa',error.message);
            }
            else
            {
                console.log(error);
                Alert.alert('Nova pessoa',"Não foi possível adicionar a pessoa.");
            }
        }

    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playerGetByGroupAndTeam(group, team); 
            setPlayers(playersByTeam);
            

        } catch (error) {
            console.log( error);
            Alert.alert('Pessoas',"Não foi possível carregar as pessoas.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemovePlayer(playerName: string) {
        // Remover jogador
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();

        } catch (error) {
            console.log(error);
            Alert.alert('Remover pessoa',"Não foi possível remover a pessoa.");
        }
    }

    async function handleRemoveGroup() {
        Alert.alert('Remover Grupo',"Deseja realmente remover a Turma?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Remover",
                    onPress: async () => groupRemove()
                }
            ]
        );
    }

    async function groupRemove() {
        // Remover turma
        try {
            await groupRemoveByName(group);
            Alert.alert('Remover Turma',"Turma removida com sucesso.");
            navigation.navigate("groups");

        } catch (error) {
            console.log(error);
            Alert.alert('Remover Turma',"Não foi possível remover a Turma.");
        }
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return (
        <Container>
            <Header showBackButton/>
            <Highlight title={group} subtitle="adicione a galera e separe os times"/>
            <Form>
                <Input 
                    placeholder="Nome da pessoa" 
                    autoCorrect={false} 
                    inputRef={newPlayerNameInputRef} 
                    onChangeText={setNewPlayerName} 
                    value={newPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                <ButtonIcon icon="add" onPress={handleAddPlayer} />
            </Form>
            <HeaderList>
                
                <FlatList
                    data={["time a", "time b", "time c"]}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter 
                            title={item} 
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                
                <NumberOfPlayers>{players.length}</NumberOfPlayers>
            </HeaderList>
            {isLoading ? <Loading/> :
                <FlatList
                        data={players}
                        keyExtractor={item => item.name}
                        renderItem={({ item }) => (
                            <PlayerCard 
                                name={item.name} 
                                onRemove={() => handleRemovePlayer(item.name)}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <ListEmpty message="Não a pessoas nesse time." />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            { paddingBottom: 100 },
                            players.length === 0 && { flex: 1 }
                        ]}
                />
            }
            <Button title="Remover turma" type="SECONDARY" onPress={handleRemoveGroup}/>

        </Container>
    )
}