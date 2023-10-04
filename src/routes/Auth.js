import AuthForm from "components/AuthForm";
import { authService, firebaseInstance } from "fbase";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle } from "@fortawesome/free-brands-svg-icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2.5em;
  color: #00acee;
  margin-bottom: 1em;
`;

const Btns = styled.div`
  display: flex;
  justify-content: space-between;
  // width: 100%;
  max-width: 320px;
  gap: 1.5em;
`;

const Btn = styled.button`
  background-color: white;
  color: black;
`;

const IconGoogle = styled(FontAwesomeIcon)`
  margin-left: 0.4em;
`;

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;

    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <Container style={{ paddingLeft: 35, paddingRight: 35 }}>
      <Icon icon={faTwitter} />
      <AuthForm />
      <Btns>
        <Btn onClick={onSocialClick} name="google">
          Continuer avec Google
          <IconGoogle icon={faGoogle} />
        </Btn>
      </Btns>
    </Container>
  );
};

export default Auth;
