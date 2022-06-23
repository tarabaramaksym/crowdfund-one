import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Breadcrumb = props => {

  let location = useLocation();
  let [breadcrumb, setBreadcrumb] = useState();

  useEffect(() => {
    let tmp = location.pathname.trim().split('/');
    if (breadcrumb && (breadcrumb[breadcrumb.length - 1] == tmp[tmp.length - 1])) {
      return;
    }
    setBreadcrumb(tmp);
  });

  const renderBreadcrumb = () => {
    if (!breadcrumb) {
      return null;
    }
    let path = '';
    return breadcrumb.map((str, index) => {
      if (index == 0) {
        let active = index == breadcrumb.length - 1 || breadcrumb[1] == ''
        return (<li key={index} className={`breadcrumb-item ${active ? '' : 'active'}`}>
          {active ? 'Home' : <Link to={'/'}>Home</Link>}
        </li>);
      }
      if (str == '') {
        return null;
      }
      path = path + '/' + str;
      if (str == 'start') {
        str = 'Start Campaign';
      }
      if (str == 'list-campaigns') {
        str = 'Campaigns'
      }
      str = str.charAt(0).toUpperCase() + str.substr(1);
      return (<li key={index} className={`breadcrumb-item ${index == breadcrumb.length - 1 || str == "Profiles" ? '' : 'active'}`}>
        {index == breadcrumb.length - 1 || str == "Profiles" ? str : <Link to={path}>{str}</Link>}
      </li>);
    });
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {renderBreadcrumb()}
      </ol>
    </nav>
  );
}

export default Breadcrumb;