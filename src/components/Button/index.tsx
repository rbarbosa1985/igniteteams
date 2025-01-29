import { TouchableOpacityProps } from "react-native";
import { ButtonTypeStyleProps, Container } from "./styles";
import { Title } from "@components/Highlight/styles";

type Props = TouchableOpacityProps & {
  title: string;
  type?: ButtonTypeStyleProps;
};

export function Button({ title, type = "PRIMARY", ...rest }: Props) {
  return (
    <Container type={type} {...rest}>
      <Title>{title}</Title>
    </Container>
  );
}
