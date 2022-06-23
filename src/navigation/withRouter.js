import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Component
        navigate={navigate}
        params={params}
        useEffect={useEffect}
        {...props}
      />
    );
  };

  return Wrapper;
};