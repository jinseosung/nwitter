import { useState } from "react";
import { authService } from "fbase";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5em;
  margin-bottom: 1.3em;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  max-width: 320px;
`;

const SubmitInput = styled.input`
  width: 100%;
  max-width: 320px;
  background-color: #00acee;
  color: white;
`;

const Switch = styled.span`
  display: block;
  color: #04aaff;
  cursor: pointer;
  margin-top: 0.7em;
  margin-bottom: 3.6em;
  font-size: 12px;
  text-decoration: underline;
`;

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setpPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setpPassword(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newAccount) {
        await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Mot de passe"
          required
          value={password}
          onChange={onChange}
        />
        <SubmitInput
          type="submit"
          value={newAccount ? "Créer un compte" : "Se connecter"}
        />
        {error}
      </Form>
      <Switch onClick={toggleAccount}>
        {newAccount ? "Se connecter" : "Créer un compte"}
      </Switch>
    </>
  );
};

export default AuthForm;
