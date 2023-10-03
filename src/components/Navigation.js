import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4em;
  margin-bottom: 5em;
`;

const ListContainer = styled.ul`
  display: flex;
  gap: 1em;
`;

const Icon = styled(FontAwesomeIcon)`
  display: block;
  font-size: 2.5em;
  color: #00acee;
  margin: 0 auto;
`;

const Span = styled.span`
  display: block;
  color: white;
  margin-top: 0.4em;
`;

const Navigation = ({ userObj }) => {
  return (
    <Nav>
      <ListContainer>
        <li>
          <Link to="/">
            <Icon icon={faTwitter} />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <Icon icon={faUser} />
            <Span>
              Profile de&nbsp;
              {userObj.displayName}
            </Span>
          </Link>
        </li>
      </ListContainer>
    </Nav>
  );
};

export default Navigation;
