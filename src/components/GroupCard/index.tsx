import { useNavigation } from "@react-navigation/native";
import { TouchableOpacityProps } from "react-native";

import { Container, Icon, Title } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
};

export function GroupCard({ title, ...rest }: Props) {
  const navigation = useNavigation();

  return (
    <Container {...rest} >
      <Icon />
      <Title>{title}</Title>
    </Container>
  );
}
