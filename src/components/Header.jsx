import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';
import useSearchStore from '../hooks/useSearchStore';
import useUserStore from '../hooks/useUserStore';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  position: fixed;
  top: 0;
  width: 100%;
  height: 3.25em;
  padding-inline: 1em;
  border-bottom: 1px solid #E8E8E8; 
  background-color: white;
  z-index: 100;

  form {
    flex: 1;
  }

  input {
    width: 70%;
    max-width: 50em;
  }

  ul {
    display: flex;
    align-items: center;
    gap: 1em;
    list-style: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
`;

const Logo = styled.div`
  width: 5em;
  height: 1.5em;
  background: url(/assets/images/logo.svg) no-repeat center;
`;

const Input = styled.input`
  width: 9em;
  height: 2em;
  margin-inline: 1em;
  padding-left: 1em;
  border: none;
  border-radius: 1em;
  background: url(/assets/images/search.svg) no-repeat center right 1em;
  background-color: #F5F5F7;

  :focus {
    outline: none;
  }
`;

const StyledLink = styled(Link)`
  font-size: 0.9em;
  color: #8E8E8E;
`;

const Button = styled.button`
  font-size: 0.9em;
  padding: 0.6em 1em;
  border: 1px solid #AB92FF;
  border-radius: 2em;
  background: #BAA5FF;
  color: white;
`;

export default function Header() {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');

  const searchStore = useSearchStore();
  const userStore = useUserStore();

  const handleClickLogout = () => {
    setAccessToken('');
    navigate('/');
  };

  const handleClickTrial = async () => {
    const trialAccessToken = await userStore.trialLogin();

    if (userStore.isLoginFailed) {
      return;
    }

    setAccessToken(trialAccessToken);

    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchStore.keyword}`);
  };

  return (
    <Container>
      <Wrapper>
        <Link to="/">
          <Logo id="logo" data-testid="logo" />
        </Link>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Input name="search" type="text" onChange={(e) => searchStore.changeKeyword(e.target.value)} />
        </form>
        <nav>
          <ul>
            {accessToken
              ? (
                <>
                  <li>
                    <StyledLink to="/mypage">
                      ???????????????
                    </StyledLink>
                  </li>
                  {/* <li>
                <button type="button">
                  ??????
                </button>
              </li> */}
                  <li>
                    <Button type="button" onClick={handleClickLogout}>
                      ????????????
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Button type="button" onClick={handleClickTrial}>
                      ????????????
                    </Button>
                  </li>
                  <li>
                    <StyledLink to="/login">
                      ?????????
                    </StyledLink>
                  </li>
                  <li>
                    <StyledLink to="/signup">
                      ????????????
                    </StyledLink>
                  </li>
                </>
              )}
          </ul>
        </nav>
      </Wrapper>
    </Container>
  );
}
