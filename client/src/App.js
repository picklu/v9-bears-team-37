import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/Common/Header';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Root from './components/pages/Root';
import Loading from './components/Common/Loading';
import ShowError from './components/Common/ShowError';

export const UserContext = React.createContext();

const App = ({ currentUser }) => (
  <Query query={ME_QUERY} fetchPolicy='cache-and-network'>
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <ShowError error={error} />;
      const currentUser = data.me;
      console.log(currentUser);

      return (
        <Router>
          <UserContext.Provider value={currentUser}>
            <NavBar fixed='top' currentUser={currentUser} />
            <Switch>
              <Route exact path='/' component={Root} />
            </Switch>
          </UserContext.Provider>
        </Router>
      );
    }}
  </Query>
);

const ME_QUERY = gql`
  {
    me {
      id
      username
      email
      isVerified
    }
  }
`;

const USER_UPDATE_QUERY = gql`
  {
    mutation($id: Int!, $isVerified: Boolean!){
        userUPdate(id: $id, isVerified: $isVerified) {
            id
            username
            email
            isVerified
        }
    }
  }`;


// const GET_DLFILES_QUERY = gql`
//   {
//     dlfiles {
//       id
//       name
//       description
//       url
//     }
//   }
// `;

export default App;
